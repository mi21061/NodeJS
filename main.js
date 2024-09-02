const groups = require('./groups.json');
const exibitions = require('./exibitions.json');

function getPoints(probFactor, pointFactor){
    return 65 + Math.ceil((Math.random() + probFactor) * pointFactor);
}

function getResult(team1, team2, diff, worstRanking){
    if(Math.random() < 0.01){
        console.log("       "+team1+" predao.");
        return;
    }
    if(Math.random() < 0.01){
        console.log("       "+team2+" predao.");
        return;
    }
    //probFactor je u inverznoj relaciji sa razlikom
    //i najslabiji moze dobiti najjaceg
    let probFactor = -diff/(worstRanking*1.95);

    let points1 = getPoints(probFactor, 40);
    let points2 = getPoints(-probFactor, 40);
    console.log("       "+team1+" - "+team2+" (" + points1 + " : " + points2 + ")");
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
const rounds = groups.A.length;

for(let i = 1; i < rounds; i++){
    console.log("Rezultati "+i+". kola:");
    for (const groupName in groups){
        console.log("   Grupa "+groupName+":" );
        
        let diff = groups[groupName][0].FIBARanking - groups[groupName][i].FIBARanking;
        getResult(groups[groupName][0].Team, groups[groupName][i].Team, diff, worstRanking);

        //igraju 2 i 3, pa 1 i 3, pa 1 i 2
        let j = i - 1 > 0 ? i-1 : 3;
        let k = i + 1 < 4 ? i+1 : 1;
        diff = groups[groupName][j].FIBARanking - groups[groupName][k].FIBARanking;
        getResult(groups[groupName][j].Team, groups[groupName][k].Team, diff, worstRanking);
    }
}