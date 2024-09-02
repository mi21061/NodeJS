# Pojašnjenja

-Funkcija getResult simulira meč

- Faktor verovatnoće pobede koji se računa na osnovu FIBA rangiranja doprinosi u 2 navrata verovatnoci pobede, jednom kao pozitivan faktor, a jednom kao negativan faktor suprotnoj ekipi. Zato se razlika deli sa brojem blizu 2*najgori_rang (da bi i najgori tim imao teoretske šanse da pobedi najbolji)

- Faktor verovatnoće koji zavisi od forme timova se inicijalizuje funkcijom initialize_forms na osnovu prijateljskih utakmica, a zatim se ažurira da sve više doprinosi verovatnoći pobede (ukoliko ekipa ima konstantne rezultate) i uzima u obzir koš razliku u meču.

- Rezultati se upisuju u mapu listi, gde je svaki ključ mape ime države, a lista sadrži informacije o mečevima

-Funkcija getPoints simulira i dodatni faktor neizvesnosti, a za osnovu kao broj poena se koristi 70

- Funkcija groupRankings vrši rangiranje po grupama, a zatim se grade rangovi od 1 do 9, nakon čega se izbacuje 9. tim i šeširi se simuliraju običnim poravnatim nizom

- Funkcija draw vrši žrebanje, uzimajući u obzir da se ne sretnu ekipe iz iste grupe i da se odmah formiraju i polufinalni parovi

- Iz nedostatka vremena nije simulirana eliminaciona faza takmičenja