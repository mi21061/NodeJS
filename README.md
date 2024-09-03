# Pojašnjenja

- Funkcija getResult simulira meč.
    - verovatnoća predaje je 10% (isključivo pre meča) i obe ekipe imaju jednaku šansu da predaju i u tom slučaju službeni rezultat je 20 - 0. U slučaju predaje ne utiče se na formu ekipe, jer meč nije ni odigran.

    - faktor verovatnoće (probFactor) duplo doprinosi verovatnoci pobede. Gradi se od dva sabirka, prvi sabirak uzima u obzir razliku FIBA ranga, a drugi formu. Prvi sabirak ima doprinos maksimalno 60% faktoru verovatnoće(zato se razlika FIBA rangova deli sa najgorim rangom i množi sa 0.3), a faktor forme doprinosi maksimalno 40% faktoru verovatnoće (zato se deli sa zbirom apsolutnih vrednosti koeficijenata forme i množi sa 0.2).

    - funkcija getPoints simulira utakmicu (broj postignutih poena ekipe), pri čemu je osnova za broj poena 75, a faktor poena je 25 (koji može i negativno doprineti). Ideja je da se ne može osvojiti više od 130 poena.

    - forma se preračunava na osnovu koš razlike. Računa se faktor snage protivnika za oba tima (strengthFactor), tako da ne može biti negativan ni veći od 1, a inverzno zavisi od razlike na rang listi (jer što je bolji protivnik, to forma brže raste u slučaju pobede, odnosno sporije pada u slučaju poraza). S obzirom da se faktor snage računa predpostavljajući pobedu, jer raste kako raste snaga protivnika, potrebno ga je ažurirati u slučaju poraza. To se čini tako što se od 1 oduzme i dobija se željeni efekat da forma sporije pada u slučaju poraza što je protivnik jači. Faktor forme se preračunava zatim uzimajući u obzir i razliku u poenima.
    NAPOMENA: nisam stigao da implementiram da inicijalizacija forme uzme u obzir jačinu protivnika (na osnovu prijateljskih utakmica).

    - u strukturu teamResults se upisuju neophodne informacije. teamResults je mapa u kojoj se na osnovu imena tima vraća lista objekata koji predstavljaju rezultate utakmica.

- Funkcija groupRankings vrši rangiranje po grupama, a zatim se grade rangovi od 1 do 9, nakon čega se izbacuje 9. tim i šeširi se simuliraju običnim poravnatim nizom

- Funkcija draw vrši žrebanje, uzimajući u obzir da se ne sretnu ekipe iz iste grupe i da se odmah formiraju i polufinalni parovi

- Funkcija playElimination simulira eliminacionu fazu takmičenja