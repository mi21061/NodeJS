const groups = require('./groups.json');
const exibitions = require('./exibitions.json');

function initialize_teamResults(teamResults, groups){
    for(groupName in groups){
        groups[groupName].forEach(team => {
            teamResults[team.Team] = [];
        });
    }
}

function getPoints(probFactor, pointFactor){
    return 65 + Math.ceil((Math.random() + probFactor) * pointFactor);
}

function getResult(team1, team2, diff, worstRanking, teamResults, round){
    let surrender = false;
    let winner = 0;
    let points1;
    let points2;
    if(Math.random() < 0.01){
        surrender = true;
        if (Math.random() > 0.5){
            winner = 2;
            //U kosarci u slucaju predaje 20 : 0 je rez
            points1 = 0;
            points2 = 20;
            console.log("       "+team1+" predao.");
        }
        else{
            winner = 1;
            points1 = 20;
            points2 = 0;
            console.log("       "+team2+" predao.");
        }
    }
    else{
        //probFactor je u inverznoj relaciji sa razlikom
        //i najslabiji moze dobiti najjaceg
        let probFactor = -diff/(worstRanking*1.95);

        points1 = getPoints(probFactor, 40);
        points2 = getPoints(-probFactor, 40);
        //no ties
        if(points1 == points2){
            points1 += 1;
        }
        winner = points1 - points2 > 0 ? 1 : 2;
        console.log("       "+team1+" - "+team2+" (" + points1 + " : " + points2 + ")");
    }

    teamResults[team1][round-1] ={ opponent : team2,
                                  win : winner == 1 ? true : false,
                                  surrender : winner == 1 ? false : surrender,
                                  ptsScored : points1,
                                  ptsOpp : points2};

    teamResults[team2][round-1] = { opponent : team1,
                                  win : winner == 2 ? true : false,
                                  surrender : winner == 2 ? false : surrender,
                                  ptsScored : points2,
                                  ptsOpp : points1};
}

function groupRankings(teamResults, rounds){
    let teamCounter = 0;
    let groupId = 0;
    groupResults = [[], [], []];
    for (team in teamResults){
        if(teamCounter == 4){
            teamCounter = 0;
            groupId++;
        }
        let points = 0;
        groupResults[groupId][teamCounter] = {team : team,
                                              points : 0,
                                              ptsScoredSum : 0,
                                              ptsOppSum : 0,
                                              wins : 0, 
                                              losses : 0,
                                              priority : 0}
        for(let j = 0; j < rounds; j++){
            let matchResults = teamResults[team][j];
            points += matchResults.win ? 2 : (matchResults.surrender ? 0 : 1);
            groupResults[groupId][teamCounter][matchResults.opponent] = 
                                matchResults.ptsScored - matchResults.ptsOpp;
            groupResults[groupId][teamCounter].ptsScoredSum += matchResults.ptsScored;
            groupResults[groupId][teamCounter].ptsOppSum += matchResults.ptsOpp;
            groupResults[groupId][teamCounter].wins += matchResults.win ? 1 : 0;
            groupResults[groupId][teamCounter].losses += matchResults.win ? 0 : 1;
        }
        groupResults[groupId][teamCounter].points = points;
        teamCounter++;
    }
    
    for (let i = 0; i < groupResults.length; i++){
        groupResults[i].sort((team1, team2) => (team1.points > team2.points) ? -1 : 1);
    }

    for (let i = 0; i < groupResults.length; i++){
        let j = 0;
        while (j < groupResults[i].length-1){
            let k = j;
            let team0 = -1;
            while(groupResults[i][k].points == groupResults[i][++k].points){
                let team1 = groupResults[i][k-1];
                let team2 = groupResults[i][k];

                team1.priority += team1[team2.team];
                team2.priority += team2[team1.team];

                if (team0 != -1){
                    team0.priority += team0[team2.team];
                    team2.priority += team2[team0.team];
                }

                team0 = team1;

                if(k == groupResults[i].length-1){
                    break;
                }
            }
            j = k;
        }
    }

    for (let i = 0; i < groupResults.length; i++){
        groupResults[i].sort((team1, team2) => (team1.points > team2.points) ? -1 : (team1.points == team2.points) ? ((team1.priority > team2.priority) ? -1 : 1) : 1);
    }

    return groupResults;
}

let worstRanking = 0;
for (const groupName in groups){
    //najgori rang na FIBA
    worstRanking = groups[groupName]
                                .reduce((acc, group) => 
                                        {
                                            return (acc = acc > group.FIBARanking ? acc : group.FIBARanking);
                                        }, worstRanking);
}
//broj kola
const rounds = groups.A.length-1;
let teamResults = {};
initialize_teamResults(teamResults, groups);
for(let i = 1; i <= rounds; i++){
    console.log("Rezultati "+i+". kola:");
    for (const groupName in groups){
        console.log("   Grupa "+groupName+":" );
        
        let rankingDiff = groups[groupName][0].FIBARanking - groups[groupName][i].FIBARanking;
        getResult(groups[groupName][0].Team, groups[groupName][i].Team, rankingDiff, worstRanking, teamResults, i);

        //igraju 2 i 3, pa 1 i 3, pa 1 i 2
        let j = i - 1 > 0 ? i-1 : 3;
        let k = i + 1 < 4 ? i+1 : 1;
        rankingDiff = groups[groupName][j].FIBARanking - groups[groupName][k].FIBARanking;
        getResult(groups[groupName][j].Team, groups[groupName][k].Team, rankingDiff, worstRanking, teamResults, i);
    }
}
const groupStandings = groupRankings(teamResults, rounds);
console.log('Konacan plasman u grupama:');
let groupId = 0;
for(let groupName in groups){
    console.log('   Grupa '+groupName+'(Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)');
    for(let j = 0; j < groupStandings[0].length; j++){
        console.log((j+1)+". "+groupStandings[groupId][j].team+"     / "+
            groupStandings[groupId][j].wins+" / "+groupStandings[groupId][j].losses+
            " / "+groupStandings[groupId][j].points+" / "+groupStandings[groupId][j].ptsScoredSum+" / "
            +groupStandings[groupId][j].ptsOppSum+" / "+
            (groupStandings[groupId][j].ptsScoredSum-groupStandings[groupId][j].ptsOppSum));
    }
    groupId++;
}

let teamRangs = [[], [], []];

for(let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
        teamRangs[i].push({team : groupStandings[j][i].team,
                              points : groupStandings[j][i].points,
                              ptsScoredSum : groupStandings[j][i].ptsScoredSum,
                              ptsDiff : (groupStandings[j][i].ptsScoredSum - groupStandings[j][i].ptsOppSum)});
    }
}

for(let i = 0; i < 3; i++){
    teamRangs[i].sort(function (e1, e2) {
        if(e1.points > e2.points){
            return -1;
        }
        else if(e1.points == e2.points){
            if(e1.ptsDiff > e2.ptsDiff){
                return -1;
            }
            else if(e1.ptsDiff == e2.ptsDiff){
                if(e1.ptsScoredSum > e2.ptsScoredSum){
                    return -1;
                }
                else{
                    return 1;
                }
            }
            else{
                return 1;
            }
        }
        else{
            return 1;
        }
    });
}

teamRangs = teamRangs.flat();
teamRangs.pop();
console.log('Konacan plasman: ');
for(let i = 0; i < teamRangs.length; i++){
    console.log((i+1)+". "+teamRangs[i].team);
}