// Fragen-Imposter: Kategorien mit [Crew-Frage, Imposter-Frage, (Slider), (Lösung)]
const QUESTION_CATEGORIES = [
  {
    id: "q_zahlen",
    name: "Circa-Imposter: Schätzfragen (Slider)",
    icon: "fa-sliders",
    pairs: [
      [
        "Wie viele Jahre dauerte die Altsteinzeit ungefähr?",
        "Wie viele Einwohner hat die Stadt Hamburg ungefähr?",
        { type: "universal", default: 100, unit: "" },
        { main: "ca. 2,5 Millionen Jahre (Beginn vor ca. 2,6 Mio. Jahren bis 10.000 v. Chr.)", imp: "ca. 1,9 Millionen Einwohner (Hamburg)" }
      ],
      [
        "Ab welchem Kontostand (in €) würdest du sofort deinen Job kündigen?",
        "Wie viele Einwohner hat eine Großstadt wie München ungefähr?",
        { type: "universal", default: 100, unit: "" },
        { main: "Persönliche Schätzung (Umfragen-Schnitt in Deutschland: ca. 1,5 – 2 Millionen €)", imp: "ca. 1,51 Millionen Einwohner (München)" }
      ],
      [
        "Wie viele Minuten brauchst du morgens vom Aufwachen bis zum Verlassen des Hauses?",
        "Wie viele Liegestütze schaffst du maximal am Stück ohne Pause?",
        { type: "universal", default: 25, unit: "" },
        { main: "Durchschnitt in Deutschland: ca. 35 – 45 Minuten", imp: "Durchschnitt Erwachsene: ca. 15 – 30 Liegestütze" }
      ],
      [
        "Wie viele Stunden pro Tag verbringst du ehrlich am Smartphone?",
        "Wie viele Stunden Schlaf brauchst du mindestens, um gut gelaunt zu sein?",
        { type: "universal", default: 6, unit: " h" },
        { main: "Durchschnittliche Smartphone-Nutzung: ca. 3,5 – 4,5 Stunden pro Tag", imp: "Empfohlene Schlafdauer: 7 – 8 Stunden" }
      ],
      [
        "In welchem Alter hattest du deinen ersten richtigen Schwarm?",
        "Wie viele Paar Schuhe besitzt du aktuell ungefähr zu Hause?",
        { type: "universal", default: 12, unit: "" },
        { main: "Durchschnitt: meist zwischen 11 und 14 Jahren", imp: "Durchschnitt in Deutschland: ca. 12 – 18 Paar Schuhe" }
      ],
      [
        "Wie viel Euro gibst du bei einem schicken Restaurantbesuch pro Person aus?",
        "Wie viele Kilometer fährst du maximal gerne am Stück mit dem Fahrrad?",
        { type: "universal", default: 40, unit: "" },
        { main: "Gehobener Restaurantbesuch: meist 45 – 80 € pro Person", imp: "Typische Freizeit-Radtour: ca. 25 – 50 km" }
      ],
      [
        "Wie viele ungelesene Mails oder Chats hast du gerade auf dem Handy?",
        "Wie viel Euro würdest du maximal für ein Konzertticket deiner Lieblingsband zahlen?",
        { type: "universal", default: 80, unit: "" },
        { main: "Persönlicher Posteingang-Wert", imp: "Große Stadion-Konzerte kosten heute im Schnitt 90 – 180 €" }
      ],
      [
        "Mit wie vielen Jahren sollte man spätestens von zu Hause ausziehen?",
        "Wie viele Tage Urlaub am Stück braucht man mindestens, um komplett abzuschalten?",
        { type: "universal", default: 20, unit: "" },
        { main: "Statistisches Auszugsalter in Deutschland: ca. 23,8 Jahre", imp: "Erholungsforschung: Tiefenentspannung setzt meist nach 14 – 21 Tagen ein" }
      ],
      [
        "Wie viele enge Freunde braucht man im Leben wirklich?",
        "Wie viele Tassen Kaffee oder Gläser Wasser trinkst du bis zum Nachmittag?",
        { type: "universal", default: 5, unit: "" },
        { main: "Soziologische Studien (Dunbar): 3 bis 5 engste Vertraute", imp: "Empfehlung bis zum Nachmittag: ca. 5 – 8 Gläser/Tassen" }
      ],
      [
        "Wie viel Prozent Akku hat dein Handy meistens abends um 20 Uhr noch?",
        "Wie alt (in Jahren) ist die Person, mit der du am häufigsten telefonierst?",
        { type: "universal", default: 30, unit: "" },
        { main: "Typischer Restakku am Abend: 20 – 45 %", imp: "Persönlicher Vergleichswert" }
      ],
      [
        "Wie viele Jahre hält eine moderne Beziehung/Ehe deiner Schätzung nach im Schnitt?",
        "Wie viele Minuten wartest du maximal auf jemanden, der zu spät zum Treffen kommt?",
        { type: "universal", default: 15, unit: "" },
        { main: "Geschiedene Ehen in Deutschland hielten zuletzt im Schnitt ca. 14 – 15 Jahre", imp: "Akademisches Viertel: meist 15 – 20 Minuten" }
      ],
      [
        "Wie viel Euro kostet deiner Schätzung nach ein guter gebrauchter Kleinwagen?",
        "Wie viele Schritte sollte man laut Fitness-Tracker jeden Tag mindestens gehen?",
        { type: "universal", default: 8000, unit: "" },
        { main: "Durchschnittspreis guter gebrauchter Kleinwagen: ca. 8.000 – 12.000 €", imp: "WHO & Tracker-Richtwert: 8.000 – 10.000 Schritte" }
      ],
      [
        "Bis zu welchem Alter möchte man im besten Fall fit und selbstständig leben?",
        "Bei wie viel km/h auf der Landstraße warst du schon mal kurz unaufmerksam?",
        { type: "universal", default: 90, unit: "" },
        { main: "Wunsch-Lebenserwartung bei guter Gesundheit: meist 85 – 95 Jahre", imp: "Landstraßen-Richtwert in Deutschland: 80 – 100 km/h" }
      ],
      [
        "Wie viele Filme oder Serienfolgen schaust du in einer typischen Woche?",
        "Wie oft am Tag schaust du ungefähr kurz in den Spiegel?",
        { type: "universal", default: 8, unit: "" },
        { main: "Durchschnitt: ca. 6 – 12 Folgen/Filme pro Woche", imp: "Studien zufolge schauen Menschen ca. 8 – 15 Mal täglich in Spiegel/Reflexionen" }
      ],
      [
        "Wie viel Euro hast du aktuell ungefähr als Bargeld dabei?",
        "Wie viele Sekunden kannst du unter Wasser die Luft anhalten?",
        { type: "universal", default: 40, unit: "" },
        { main: "Durchschnittliches Bargeld im Portemonnaie in DE: ca. 45 – 60 €", imp: "Untrainierte Erwachsene halten die Luft ca. 40 – 60 Sekunden an" }
      ],
      [
        "Wie viele Kontakte hast du im Handy, die du eigentlich nie anrufst?",
        "Wie viel Euro kostet ein hochwertiger Wintermantel deiner Meinung nach?",
        { type: "universal", default: 150, unit: "" },
        { main: "Meist liegen 100 – 250 Karteileichen im Smartphone-Adressbuch", imp: "Guter Wintermantel: meist 150 – 300 €" }
      ],
      [
        "In wie vielen Ländern warst du in deinem bisherigen Leben schon?",
        "Wie viele Wecker stellst du dir morgens im Schnitt hintereinander?",
        { type: "universal", default: 6, unit: "" },
        { main: "Durchschnitt der Deutschen: ca. 8 – 12 bereiste Länder", imp: "Snooze-Nutzer stellen meist 2 – 5 Wecker" }
      ],
      [
        "Wie viele Stunden vor Abflug bist du normalerweise am Flughafen?",
        "Wie viele warme oder kalte Mahlzeiten isst du an einem normalen Tag?",
        { type: "universal", default: 3, unit: "" },
        { main: "Empfehlung am Flughafen: 2 bis 3 Stunden vor Abflug", imp: "Klassisch: 3 Hauptmahlzeiten pro Tag" }
      ],
      [
        "Wie viele Kilometer ist der Mond ungefähr von der Erde entfernt?",
        "Wie viel Euro kostet eine Eigentumswohnung in einer deutschen Großstadt ca.?",
        { type: "universal", default: 350000, unit: "" },
        { main: "Exakt 384.400 km im Durchschnitt", imp: "3-Zimmer-Wohnung in deutschen Großstädten: im Schnitt ca. 350.000 – 450.000 €" }
      ],
      [
        "Wie viele Fotos hast du aktuell ungefähr in deiner Handy-Galerie?",
        "Wie viele Kalorien verbrennt man bei einer extrem intensiven Sportwoche ca.?",
        { type: "universal", default: 3500, unit: "" },
        { main: "Durchschnitt auf modernen Smartphones: ca. 2.500 – 6.000 Fotos", imp: "Intensive Sportwoche (5–6 Einheiten): ca. 3.000 – 4.500 kcal" }
      ],
      [
        "Wie viel Grad Celsius hat die perfekte Sommertemperatur für dich?",
        "Mit wie vielen Jahren hat man meistens seinen ersten Vollzeitjob?",
        { type: "universal", default: 25, unit: "" },
        { main: "Wohlfühltemperatur im Sommer: meist 24 – 28 °C", imp: "Berufseinstieg Vollzeit (Ausbildung/Studium): meist mit 20 – 25 Jahren" }
      ],
      [
        "Wie viele Euro gibst du im Monat ungefähr für Streaming, Apps & Abos aus?",
        "Wie viele Minuten dauert dein täglicher Arbeits- oder Schulweg?",
        { type: "universal", default: 30, unit: "" },
        { main: "Durchschnittliche Abo-Ausgaben in DE: ca. 25 – 45 € im Monat", imp: "Durchschnittlicher Pendelweg in DE: ca. 28 Minuten pro Strecke" }
      ],
      [
        "Wie viele Hochzeiten wirst du in deinem gesamten Leben wohl als Gast besuchen?",
        "Wie viele T-Shirts besitzt du ungefähr in deinem Kleiderschrank?",
        { type: "universal", default: 18, unit: "" },
        { main: "Im Schnitt besucht man im Leben ca. 10 – 20 Hochzeiten", imp: "Durchschnitt im Kleiderschrank: ca. 15 – 25 T-Shirts" }
      ],
      [
        "Wie viele Euro sollte man für ein gutes Hochzeitsgeschenk unter Freunden geben?",
        "Wie viele Liegestütze oder Kniebeugen schafft ein durchschnittlicher Erwachsener in 3 Minuten?",
        { type: "universal", default: 80, unit: "" },
        { main: "Übliches Geldgeschenk unter guten Freunden: 50 – 100 € pro Person", imp: "In 3 Minuten (mit kurzen Pausen): ca. 60 – 100 Wiederholungen" }
      ],
      [
        "Wie viele Tage im Jahr regnet es gefühlt in Deutschland?",
        "Wie viel Euro gibt man an einem langen Festival-Wochenende vor Ort aus?",
        { type: "universal", default: 150, unit: "" },
        { main: "Je nach Zählweise ca. 120 – 180 Tage mit Niederschlag pro Jahr (DWD-Mittelwerte)", imp: "Verpflegung & Extras auf einem Festival: meist 120 – 200 €" }
      ],
      [
        "Wie viele Bücher liest oder hörst du in einem gesamten Jahr?",
        "Wie oft im Jahr gehst du ungefähr zum Friseur?",
        { type: "universal", default: 6, unit: "" },
        { main: "Durchschnitt in Deutschland: ca. 5 – 7 Bücher pro Jahr", imp: "Durchschnittliche Friseurbesuche: ca. 4 – 8 Mal pro Jahr" }
      ],
      [
        "Wie viele Minuten hältst du es im Eisbad oder unter eiskalter Dusche maximal aus?",
        "Wie viele Geschwister und Cousins/Cousinen hast du insgesamt?",
        { type: "universal", default: 5, unit: "" },
        { main: "Empfohlene Eisbad-Dauer: 2 bis 5 Minuten", imp: "Durchschnittliche Anzahl Geschwister + Cousins: ca. 4 – 8" }
      ],
      [
        "Wie viel Euro war dein teuerster Spontankauf, den du je getätigt hast?",
        "Wie viele Kilometer bist du an deinem aktivsten Wandertag oder Städtetrip je zu Fuß gelaufen?",
        { type: "universal", default: 30, unit: "" },
        { main: "Persönlicher Spontankauf-Rekord", imp: "Langer Städtetrip oder Tageswanderung: meist 20 – 35 km" }
      ],
      [
        "Wie viele Passwörter hast du im Kopf, ohne nachzuschauen?",
        "Auf wie vielen Hochzeiten oder großen runden Geburtstagen warst du in den letzten 5 Jahren?",
        { type: "universal", default: 7, unit: "" },
        { main: "Die meisten Menschen kennen 5 – 10 Passwörter auswendig", imp: "Meist 5 – 10 große Feiern in 5 Jahren" }
      ],
      [
        "Wie viele Stunden pro Woche verbringst du mit Kochen und Essen?",
        "Wie viele Jahre warst du insgesamt in Schule, Ausbildung oder Studium?",
        { type: "universal", default: 14, unit: "" },
        { main: "Durchschnitt für Kochen & Mahlzeiten: ca. 12 – 15 Stunden pro Woche", imp: "Schule + Ausbildung/Studium: meist 13 – 17 Jahre" }
      ],
      [
        "Wie viele Minuten duschst du durchschnittlich?",
        "Wie viele Minuten brauchst du für ein entspanntes Frühstück am Wochenende?",
        { type: "universal", default: 10, unit: "" },
        { main: "Durchschnitt in Deutschland: ca. 8 – 10 Minuten", imp: "Persönlicher Wert (oft 15 – 30 Minuten)" }
      ],
      [
        "Wie viele Apps hast du ungefähr auf deinem Handy?",
        "Wie viele Folgen hat deine Lieblingsserie ungefähr?",
        { type: "universal", default: 80, unit: "" },
        { main: "Im Schnitt ca. 80 – 100 installierte Apps", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viel Euro gibst du im Monat ungefähr für Lebensmittel aus?",
        "Wie viel Euro kostet für dich ein guter Wochenendtrip pro Person?",
        { type: "universal", default: 250, unit: "" },
        { main: "Ein-Personen-Haushalte in Deutschland: ca. 200 – 300 € im Monat", imp: "Persönlicher Wert (meist 200 – 400 €)" }
      ],
      [
        "Wie viele Stunden pro Woche arbeitest oder lernst du ungefähr?",
        "Wie viele Stunden pro Woche bist du draußen an der frischen Luft?",
        { type: "universal", default: 30, unit: "" },
        { main: "Vollzeit in Deutschland: meist 38 – 40 Stunden", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viele Nachrichten schreibst du an einem normalen Tag ungefähr?",
        "Wie viele Fotos machst du ungefähr in einer Urlaubswoche?",
        { type: "universal", default: 50, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ],
      [
        "Mit wie vielen Jahren hast du dein erstes eigenes Handy bekommen?",
        "Seit wie vielen Jahren kennst du deine älteste Freundin oder deinen ältesten Freund?",
        { type: "universal", default: 12, unit: "" },
        { main: "Heute bekommen Kinder ihr erstes Smartphone meist mit ca. 9 – 11 Jahren", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viel Euro darf ein perfektes erstes Date maximal kosten?",
        "Wie viel Euro hast du zuletzt für ein Geburtstagsgeschenk ausgegeben?",
        { type: "universal", default: 50, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viele Kilometer wohnst du von deinem Geburtsort entfernt?",
        "Wie viele Kilometer bist du maximal schon an einem Tag mit dem Auto gefahren?",
        { type: "universal", default: 300, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viele Bücher stehen ungefähr bei dir zu Hause?",
        "Wie viele Gläser und Tassen hast du ungefähr im Küchenschrank?",
        { type: "universal", default: 40, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viele Minuten dauert für dich die perfekte Mittagspause?",
        "Wie viele Minuten wartest du maximal in einer Schlange vor einem Club?",
        { type: "universal", default: 45, unit: "" },
        { main: "Gesetzlich mindestens 30 Minuten bei mehr als 6 Stunden Arbeit", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viel Prozent deiner Freizeit verbringst du am Handy?",
        "Wie viel Prozent deines Einkommens oder Taschengelds sparst du ungefähr?",
        { type: "universal", default: 20, unit: "" },
        { main: "Persönlicher Wert", imp: "Sparquote in Deutschland: ca. 10 – 11 %" }
      ],
      [
        "Wie viele Länder möchtest du in deinem Leben noch bereisen?",
        "Wie viele deutsche Städte hast du schon besucht?",
        { type: "universal", default: 20, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viel Grad Celsius sollte das Wasser im Pool mindestens haben?",
        "Wie viel Grad Celsius ist für dich die ideale Temperatur im Wohnzimmer?",
        { type: "universal", default: 22, unit: "" },
        { main: "Meist werden 24 – 28 °C als angenehm empfunden", imp: "Empfehlung: ca. 20 – 22 °C" }
      ],
      [
        "Wie viele Euro Trinkgeld gibst du bei einer Restaurantrechnung von 50 €?",
        "Wie viele Euro würdest du maximal für ein Taxi nach einer Party zahlen?",
        { type: "universal", default: 5, unit: "" },
        { main: "Üblich in Deutschland: 5 – 10 % (also ca. 2,50 – 5 €)", imp: "Persönlicher Wert" }
      ],
      [
        "Wie viele Stunden Schlaf hattest du letzte Nacht?",
        "Wie viele Stunden hast du gestern ungefähr geredet oder telefoniert?",
        { type: "universal", default: 7, unit: "" },
        { main: "Persönlicher Wert", imp: "Persönlicher Wert" }
      ]
    ]
  },
  {
    id: "q_rekorde",
    name: "Circa-Imposter: Rekorde & Kuriose Fakten (Slider)",
    icon: "fa-earth-europe",
    pairs: [
      [
        "Wie viele Kilometer misst die Erde im Durchmesser ungefähr?",
        "Wie viele Sitzplätze hat eine große Konzert-Arena (z. B. Olympiahalle München)?",
        { type: "universal", default: 10000, unit: "" },
        { main: "Rund 12.742 Kilometer (mittlerer Erddurchmesser)", imp: "Je nach Bestuhlung ca. 12.000 bis 15.000 Plätze (Olympiahalle München)" }
      ],
      [
        "Wie viele Quadratmeter (m²) groß war die größte Pizza der Welt laut Guinness-Weltrekord?",
        "Wie viele Kilometer Luftlinie sind es von Berlin nach Rom?",
        { type: "universal", default: 1200, unit: "" },
        { main: "1.299,7 m² (Weltrekord 2023 in Los Angeles; zuvor 1.261,65 m² in Rom)", imp: "Ca. 1.184 Kilometer Luftlinie von Berlin nach Rom" }
      ],
      [
        "Wie viele Meter hoch ist der Eiffelturm in Paris inklusive Antennenspitze?",
        "Wie viele Tage im Jahr scheint auf Mallorca durchschnittlich die Sonne?",
        { type: "universal", default: 300, unit: "" },
        { main: "330 Meter (seit der neuen Antenne im Jahr 2022)", imp: "Rund 300 Sonnentage pro Jahr auf Mallorca" }
      ],
      [
        "Wie viele Tasten hat ein klassisches Konzert-Klavier?",
        "Wie viele Sternbilder sind offiziell von der Internationalen Astronomischen Union anerkannt?",
        { type: "universal", default: 80, unit: "" },
        { main: "Exakt 88 Tasten (52 weiße und 36 schwarze)", imp: "Exakt 88 offiziell anerkannte Sternbilder" }
      ],
      [
        "Wie viele Knochen hat ein erwachsener Mensch im Körper?",
        "Wie viele Staaten der Erde werden aktuell von den Vereinten Nationen (UN) anerkannt?",
        { type: "universal", default: 200, unit: "" },
        { main: "Ca. 206 Knochen (Babys haben noch über 300, die später zusammenwachsen)", imp: "193 UN-Mitgliedstaaten (plus 2 Beobachterstaaten = 195)" }
      ],
      [
        "Wie viele Stufen muss man im Kölner Dom bis zur Aussichtsplattform hinaufsteigen?",
        "Wie viele Gramm wiegt ein offizieller Fußball der FIFA zu Spielbeginn?",
        { type: "universal", default: 450, unit: "" },
        { main: "Exakt 533 Stufen bis zur Turmbesteigung in 97 m Höhe", imp: "410 bis 450 Gramm laut offiziellem FIFA-Regelwerk" }
      ],
      [
        "Wie viele Meter hoch ist das höchste Gebäude der Welt (Burj Khalifa in Dubai)?",
        "Wie viele Episoden hat die Kult-Serie „Die Simpsons“ inzwischen ungefähr?",
        { type: "universal", default: 800, unit: "" },
        { main: "828 Meter (Burj Khalifa)", imp: "Über 770 bis 800 Episoden (seit 1989)" }
      ],
      [
        "Wie viele Inseln gehören insgesamt zum Staat Schweden?",
        "Wie viele Wörter umfasst ein sehr dickes Fantasy-Buch (z. B. alle Herr-der-Ringe-Bände zusammen)?",
        { type: "universal", default: 250000, unit: "" },
        { main: "267.570 Inseln (Schweden ist das inselreichste Land der Welt)", imp: "Ca. 480.000 Wörter (Herr der Ringe komplett) bzw. 150.000 pro Einzelband" }
      ],
      [
        "Wie viele Liter Bier wurden auf dem Münchner Oktoberfest in einem Rekordjahr getrunken?",
        "Wie viele Einwohner hat die Schweizer Metropole Zürich inklusive Ballungsraum?",
        { type: "universal", default: 1000000, unit: "" },
        { main: "In Rekordjahren rund 7,5 Millionen Liter (Maß), sonst meist um 7 Millionen", imp: "Ca. 1,4 Millionen im Großraum Zürich (ca. 440.000 in der Kernstadt)" }
      ],
      [
        "Wie viele Sekunden dauerte der längste jemals gemessene Schluckauf eines Menschen?",
        "Wie viele Menschen passen in das größte Fußballstadion Europas (Camp Nou Barcelona)?",
        { type: "universal", default: 100000, unit: "" },
        { main: "Charles Osborne hatte 68 Jahre lang Schluckauf (über 2 Milliarden Sekunden / ca. 24.800 Tage!)", imp: "Ca. 99.354 bis 105.000 Zuschauer (nach Umbau)" }
      ],
      [
        "Wie viele Kilometer lang ist die Chinesische Mauer insgesamt (alle Abschnitte)?",
        "Wie viele Tierarten der Gruppe Vögel und Säugetiere gibt es weltweit zusammen ca.?",
        { type: "universal", default: 20000, unit: "" },
        { main: "21.196 Kilometer laut offizieller archäologischer Vermessung", imp: "Ca. 17.500 Arten (rund 11.000 Vogelarten und 6.500 Säugetierarten)" }
      ],
      [
        "Wie viele Minuten dauerte das längste Tennis-Match der Geschichte in Wimbledon (Isner vs. Mahut)?",
        "Wie viele Kilometer legt die Internationale Raumstation (ISS) in nur einer einzigen Minute zurück?",
        { type: "universal", default: 500, unit: "" },
        { main: "665 Minuten (11 Stunden und 5 Minuten über 3 Tage im Jahr 2010)", imp: "Ca. 460 Kilometer pro Minute (rund 27.600 km/h)" }
      ],
      [
        "Wie viele Euro Münzgeld werden jeden Tag durchschnittlich in den Trevi-Brunnen in Rom geworfen?",
        "Wie viele Meter hoch ist die Zugspitze als höchster Berg Deutschlands?",
        { type: "universal", default: 3000, unit: "" },
        { main: "Ca. 3.000 bis 4.000 Euro pro Tag (rund 1,4 bis 1,5 Mio. € im Jahr für wohltätige Zwecke)", imp: "Exakt 2.962 Meter über dem Meeresspiegel" }
      ],
      [
        "Wie viele Hotdogs hat Rekordhalter Joey Chestnut beim Wettessen in nur 10 Minuten geschafft?",
        "Wie viele Jahre alt wurde die älteste jemals offiziell dokumentierte Katze der Welt?",
        { type: "universal", default: 50, unit: "" },
        { main: "76 Hotdogs in 10 Minuten (Weltrekord von Joey Chestnut)", imp: "38 Jahre (Katze „Creme Puff“ aus Texas, 1967–2005)" }
      ],
      [
        "Wie viele Brücken gibt es in der Hansestadt Hamburg insgesamt?",
        "Wie viele Meter tief ist der Baikalsee (der tiefste See der Erde)?",
        { type: "universal", default: 2000, unit: "" },
        { main: "Rund 2.500 Brücken (mehr als Venedig, Amsterdam und London zusammen!)", imp: "1.642 Meter tief" }
      ],
      [
        "Wie viele Wörter spricht ein durchschnittlicher Mensch an einem einzigen Tag?",
        "Wie viele Zuschauer passen in ein ausverkauftes großes Basketball-Stadion in der NBA?",
        { type: "universal", default: 16000, unit: "" },
        { main: "Studien zufolge durchschnittlich ca. 16.000 Wörter pro Tag", imp: "Durchschnittlich 18.000 bis 20.000 Zuschauer" }
      ],
      [
        "Wie viele Punkte auf den Würfeln gibt es in einem kompletten Kniffel-Becher (5 Würfel) insgesamt?",
        "Wie viele Bundesstaaten gehören zu den USA plus wie viele Nachbarländer hat Deutschland?",
        { type: "universal", default: 80, unit: "" },
        { main: "105 Augen insgesamt (21 Augen pro Würfel × 5 Würfel)", imp: "59 insgesamt (50 US-Bundesstaaten + 9 deutsche Nachbarländer)" }
      ],
      [
        "Wie viele Kilometer lang ist der längste Straßentunnel der Welt (Lærdalstunnel in Norwegen)?",
        "Wie viele Stunden dauert ein Direktflug von Frankfurt nach Australien (inkl. kurzem Tankstopp)?",
        { type: "universal", default: 22, unit: "" },
        { main: "24,51 Kilometer Länge", imp: "Ca. 20 bis 22 Stunden Flugzeit" }
      ],
      [
        "Wie viele Millionen Euro kostete das teuerste jemals versteigerte Gemälde („Salvator Mundi“)?",
        "Wie viele Tausend Einwohner hat die Stadt Duisburg ungefähr?",
        { type: "universal", default: 400, unit: "" },
        { main: "Rund 400 Millionen Euro (450,3 Mio. US-Dollar im Jahr 2017)", imp: "Rund 500 Tausend Einwohner (Duisburg)" }
      ],
      [
        "Wie viele Zähne hat ein ausgewachsener Weißer Hai gleichzeitig in seinem Revolvergebiss?",
        "Wie viele Tage dauert die Schwangerschaft bei einem Menschen im Durchschnitt?",
        { type: "universal", default: 280, unit: "" },
        { main: "Rund 300 Zähne gleichzeitig in mehreren Reihen (im Leben bis zu 30.000)", imp: "Rund 280 Tage (40 Wochen)" }
      ],
      [
        "Wie viele Millionen Passagiere nutzen den größten Flughafen Deutschlands (Frankfurt) pro Jahr?",
        "Wie viele Millionen Einwohner hat Italien insgesamt?",
        { type: "universal", default: 60, unit: "" },
        { main: "Rund 60 bis 70 Millionen Passagiere pro Jahr", imp: "Rund 59 Millionen Einwohner" }
      ],
      [
        "Wie viele Goldmedaillen hat Schwimm-Legende Michael Phelps bei Olympischen Spielen gewonnen?",
        "Wie viele Buchstaben hat das griechische Alphabet?",
        { type: "universal", default: 24, unit: "" },
        { main: "23 olympische Goldmedaillen (insgesamt 28 Medaillen)", imp: "24 Buchstaben (von Alpha bis Omega)" }
      ],
      [
        "Wie viele Zimmer hat der Buckingham Palace in London insgesamt?",
        "Wie viele km/h beträgt die Schallgeschwindigkeit in der Luft (auf Meereshöhe)?",
        { type: "universal", default: 1000, unit: "" },
        { main: "775 Zimmer (davon 78 Badezimmer und 52 königliche/Gäste-Schlafzimmer)", imp: "Ca. 1.235 km/h (343 Meter pro Sekunde)" }
      ],
      [
        "Wie viele Jahre dauerte der sogenannte „Hundertjährige Krieg“ zwischen England und Frankreich wirklich?",
        "Wie alt (in Jahren) wurde die älteste dokumentierte Frau der Welt (Jeanne Calment)?",
        { type: "universal", default: 115, unit: "" },
        { main: "116 Jahre (von 1337 bis 1453)", imp: "122 Jahre und 164 Tage (Jeanne Calment, 1875–1997)" }
      ],
      [
        "Wie viele Dönerbuden gibt es allein in der Hauptstadt Berlin ungefähr?",
        "Wie viele Minuten hat ein kompletter Tag (24 Stunden)?",
        { type: "universal", default: 1400, unit: "" },
        { main: "Rund 1.600 Döner-Imbisse in Berlin", imp: "Exakt 1.440 Minuten (24 × 60)" }
      ],
      [
        "Wie viele Gramm wiegt das menschliche Gehirn eines Erwachsenen durchschnittlich?",
        "Wie viele Kilometer lang ist der Rhein von der Quelle bis zur Mündung?",
        { type: "universal", default: 1300, unit: "" },
        { main: "Ca. 1.300 bis 1.400 Gramm", imp: "1.233 Kilometer Gesamtlänge" }
      ],
      [
        "Wie viele Millionen Fahrräder gibt es in Deutschland insgesamt?",
        "Wie viele Millionen Menschen leben in der Türkei?",
        { type: "universal", default: 84, unit: "" },
        { main: "Rund 84 Millionen Fahrräder (fast 1 Fahrrad pro Einwohner)", imp: "Rund 85 Millionen Einwohner in der Türkei" }
      ],
      [
        "Wie viele Felder hat eine klassische Dartscheibe insgesamt (inkl. Double, Triple & Bullseye)?",
        "Wie viele Jahre vergehen zwischen zwei Vorbeiflügen des Halleyschen Kometen an der Erde?",
        { type: "universal", default: 76, unit: "" },
        { main: "82 separate Trefferfelder auf einer Standard-Dartscheibe", imp: "Im Schnitt 75 bis 76 Jahre" }
      ],
      [
        "Wie viele Tausend Kilometer Stau gab es 2023 auf deutschen Autobahnen insgesamt?",
        "Wie viele Kilometer sind es Luftlinie von Hamburg nach München?",
        { type: "universal", default: 700, unit: "" },
        { main: "Rund 840 Tausend Kilometer (ADAC-Staubilanz 2023)", imp: "Rund 610 Kilometer Luftlinie" }
      ],
      [
        "Wie viele verschiedene Käsesorten werden in Frankreich offiziell hergestellt?",
        "Wie viele Tage dauert ein Jahr auf dem Nachbarplaneten Mars (in Erdtagen)?",
        { type: "universal", default: 600, unit: "" },
        { main: "Über 1.000 Käsesorten (Schätzungen reichen bis ca. 1.600)", imp: "687 Erdtage dauert ein Mars-Umlauf um die Sonne" }
      ],
      [
        "Wie viele Menschen waren bisher insgesamt auf der Oberfläche des Mondes?",
        "Wie viele Hirnnerven-Paare besitzt der Mensch?",
        { type: "universal", default: 12, unit: "" },
        { main: "Exakt 12 Menschen (alle im Rahmen der Apollo-Missionen 1969–1972)", imp: "Exakt 12 Hirnnerven-Paare" }
      ],
      [
        "Wie viele Wirbel hat die menschliche Wirbelsäule insgesamt?",
        "Die Sommerspiele 2024 in Paris waren die Spiele der wievielten Olympiade?",
        { type: "universal", default: 33, unit: "" },
        { main: "33 bis 34 Wirbel (7 Hals-, 12 Brust-, 5 Lendenwirbel plus Kreuz- und Steißbein)", imp: "Der 33. Olympiade (3 Olympiaden fielen wegen Kriegen aus)" }
      ],
      [
        "Wie viele Meter tief ist der tiefste Punkt der Weltmeere (Marianengraben)?",
        "Wie viele Seen gibt es im US-Bundesstaat Minnesota („Land of 10,000 Lakes“) tatsächlich?",
        { type: "universal", default: 11000, unit: "" },
        { main: "Ca. 10.900 bis 11.000 Meter unter dem Meeresspiegel (Challengertief)", imp: "11.842 offizielle Seen über 4 Hektar Größe" }
      ],
      [
        "Wie viele Tage überlebte ein Mensch maximal ohne Schlaf beim offiziellen wissenschaftlichen Experiment (Randy Gardner)?",
        "Wie viele Spieler stehen beim Fußball in einer Mannschaft inklusive Torwart auf dem Platz?",
        { type: "universal", default: 11, unit: "" },
        { main: "11 Tage (264 Stunden im Jahr 1964)", imp: "11 Spieler pro Team" }
      ],
      [
        "Wie viele Liter Wasser verbraucht eine Person in Deutschland durchschnittlich pro Tag im Haushalt?",
        "Wie viele km/h erreichte der schnellste jemals gemessene Aufschlag im Profi-Tennis?",
        { type: "universal", default: 200, unit: "" },
        { main: "Ca. 125 Liter Trinkwasser pro Kopf und Tag in Deutschland", imp: "263,4 km/h (Weltrekord von Sam Groth im Jahr 2012)" }
      ],
      [
        "Wie viele Sekunden braucht das Sonnenlicht von der Sonne bis auf die Erde?",
        "Wie viele Meter hoch ist der Berliner Fernsehturm inklusive Antenne?",
        { type: "universal", default: 480, unit: "" },
        { main: "Ca. 499 Sekunden (8 Minuten und 19 Sekunden)", imp: "368 Meter" }
      ],
      [
        "Wie viele Muskeln benutzt der Mensch ungefähr, wenn er einen einzigen Schritt vorwärts geht?",
        "Wie viele Staaten der Welt haben Linksverkehr auf den Straßen?",
        { type: "universal", default: 75, unit: "" },
        { main: "Rund 200 Muskeln arbeiten bei einem einzigen Schritt zusammen", imp: "Ca. 75 Länder und Territorien weltweit fahren links" }
      ],
      [
        "Wie viele Milliarden Mal wurde das Musikvideo „Despacito“ auf YouTube ungefähr aufgerufen?",
        "Wie viele Zeitzonen überquert man, wenn man einmal quer durch ganz Russland reist?",
        { type: "universal", default: 10, unit: "" },
        { main: "Über 8,5 Milliarden Aufrufe (Stand 2025)", imp: "11 Zeitzonen innerhalb Russlands" }
      ],
      [
        "Wie viele Kilogramm Schokolade isst jeder Deutsche statistisch gesehen in einem Jahr?",
        "Wie viele Stunden dauert der längste Nonstop-Linienflug der Welt (Singapur – New York)?",
        { type: "universal", default: 15, unit: "" },
        { main: "Rund 9,5 bis 10 Kilogramm Schokolade pro Kopf und Jahr", imp: "Knapp 19 Stunden Flugzeit (18 Std. 50 Min.)" }
      ],
      [
        "Wie viele Millionen Jahre vor unserer Zeit starben die Dinosaurier aus?",
        "Wie viel Prozent der Erdoberfläche sind von Wasser bedeckt?",
        { type: "universal", default: 68, unit: "" },
        { main: "Vor rund 66 Millionen Jahren (Ende der Kreidezeit)", imp: "Rund 71 Prozent der Erdoberfläche sind mit Wasser bedeckt" }
      ],
      [
        "Wie viele Meter hoch ist das Empire State Building mit Antenne?",
        "Wie viele Kilometer sind es Luftlinie von Berlin nach Köln?",
        { type: "universal", default: 450, unit: "" },
        { main: "Rund 443 Meter", imp: "Rund 480 Kilometer" }
      ],
      [
        "Wie viele km/h fährt ein ICE in Deutschland maximal im Linienbetrieb?",
        "Wie viele Meter war der Eiffelturm bei seiner Eröffnung 1889 hoch?",
        { type: "universal", default: 300, unit: "" },
        { main: "300 km/h", imp: "Rund 300 Meter (heute mit Antennen 330 m)" }
      ],
      [
        "Wie viele Einwohner hat Island ungefähr?",
        "Wie viele Einwohner hat die Stadt Bochum ungefähr?",
        { type: "universal", default: 380000, unit: "" },
        { main: "Rund 390.000 Einwohner", imp: "Rund 365.000 Einwohner" }
      ],
      [
        "Wie alt wurde Johann Wolfgang von Goethe?",
        "Wie alt wurde Pablo Picasso?",
        { type: "universal", default: 85, unit: "" },
        { main: "82 Jahre (1749–1832)", imp: "91 Jahre (1881–1973)" }
      ],
      [
        "Wie viele Kilometer lang ist der Nord-Ostsee-Kanal?",
        "Wie viele Minuten dauert ein Fußballspiel inklusive Halbzeitpause?",
        { type: "universal", default: 100, unit: "" },
        { main: "Rund 98 Kilometer", imp: "105 Minuten (2 × 45 + 15 Minuten Pause)" }
      ],
      [
        "Wie viele Sekunden dauerte der erste Motorflug der Brüder Wright 1903?",
        "Wie viele Apostel hatte Jesus laut Bibel?",
        { type: "universal", default: 12, unit: "" },
        { main: "12 Sekunden", imp: "12 Apostel" }
      ],
      [
        "Wie viele Meter tief ist der Bodensee an seiner tiefsten Stelle?",
        "Wie viele Tore schoss Gerd Müller in der Fußball-Bundesliga?",
        { type: "universal", default: 300, unit: "" },
        { main: "Rund 251 Meter", imp: "365 Bundesliga-Tore" }
      ],
      [
        "Wie viele Nachbarländer hat Deutschland?",
        "Wie viele Spieler hat ein Baseballteam gleichzeitig auf dem Feld?",
        { type: "universal", default: 9, unit: "" },
        { main: "9 Nachbarländer", imp: "9 Spieler" }
      ],
      [
        "Wie viele Millionen Kilometer ist die Sonne von der Erde entfernt?",
        "Wie viele Minuten dauert der Film „Titanic“ (1997)?",
        { type: "universal", default: 170, unit: "" },
        { main: "Rund 150 Millionen Kilometer (149,6 Mio. km)", imp: "194 Minuten" }
      ],
      [
        "Wie viele Meter hoch ist der Mount Everest?",
        "Wie viele Stunden hat ein Jahr (ohne Schaltjahr)?",
        { type: "universal", default: 8800, unit: "" },
        { main: "8.849 Meter", imp: "8.760 Stunden" }
      ],
      [
        "Wie viele Spiele gibt es in einer kompletten Saison der Fußball-Bundesliga?",
        "Wie viele Tage hat ein Jahr (ohne Schaltjahr)?",
        { type: "universal", default: 330, unit: "" },
        { main: "306 Spiele (18 Teams, 34 Spieltage)", imp: "365 Tage" }
      ],
      [
        "Wie viele Zähne hat ein erwachsener Hund?",
        "Wie viele Kilometer lang ist ein Marathon (gerundet)?",
        { type: "universal", default: 42, unit: "" },
        { main: "42 Zähne", imp: "42 Kilometer (genau 42,195 km)" }
      ],
      [
        "Wie oft schlägt ein menschliches Herz ungefähr an einem Tag?",
        "Wie viele Einwohner hat die Stadt Jena ungefähr?",
        { type: "universal", default: 100000, unit: "" },
        { main: "Rund 100.000 Mal", imp: "Rund 110.000 Einwohner" }
      ],
      [
        "Wie viele Tage dauerte die Mondmission Apollo 11 insgesamt?",
        "Wie viele Beine hat eine Spinne?",
        { type: "universal", default: 8, unit: "" },
        { main: "Rund 8 Tage (16. bis 24. Juli 1969)", imp: "8 Beine" }
      ],
      [
        "Wie viele Kilometer lang ist die Elbe insgesamt?",
        "Wie viele Gramm wiegt ein Liter Wasser?",
        { type: "universal", default: 1050, unit: "" },
        { main: "Rund 1.094 Kilometer", imp: "Rund 1.000 Gramm" }
      ]
    ]
  },
  {
    id: "q_natur_technik",
    name: "Circa-Imposter: Natur, Körper & Technik (Slider)",
    icon: "fa-atom",
    pairs: [
      [
        "Wie oft schlägt ein gesundes menschliches Herz in einer ruhigen Minute?",
        "Wie viele Jahre alt kann ein frei lebender afrikanischer Elefant maximal werden?",
        { type: "universal", default: 65, unit: "" },
        { main: "Ca. 60 bis 80 Schläge pro Minute im Ruhepuls", imp: "Ca. 60 bis 70 Jahre in freier Wildbahn" }
      ],
      [
        "Wie viele Geschmacksknospen hat ein Mensch durchschnittlich auf der Zunge?",
        "Wie viel Euro kostet der Führerschein (Klasse B) heute im Schnitt?",
        { type: "universal", default: 4000, unit: "" },
        { main: "Ca. 5.000 bis 10.000 Geschmacksknospen", imp: "Inzwischen durchschnittlich 3.000 bis 4.500 Euro" }
      ],
      [
        "Wie viele km/h schnell kann ein Gepard beim Sprint auf kurzer Strecke maximal werden?",
        "Wie viele Elemente stehen aktuell im Periodensystem der Chemie?",
        { type: "universal", default: 115, unit: "" },
        { main: "Ca. 100 bis 120 km/h", imp: "Exakt 118 nachgewiesene chemische Elemente" }
      ],
      [
        "Wie viele Haare hat ein durchschnittlicher Mensch insgesamt auf dem Kopf?",
        "Wie viele Zuschauer passen in das größte Stadion der Welt (Rungrado-Stadion in Nordkorea)?",
        { type: "universal", default: 100000, unit: "" },
        { main: "Ca. 100.000 bis 150.000 Kopfhaare", imp: "Ca. 114.000 bis 150.000 Plätze" }
      ],
      [
        "Wie viele Liter Blut fließen im Körper eines durchschnittlichen Erwachsenen?",
        "Wie viele Ringe hat das offizielle Symbol der Olympischen Spiele?",
        { type: "universal", default: 5, unit: "" },
        { main: "Ca. 5 bis 6 Liter Blut", imp: "5 verschlungene olympische Ringe" }
      ],
      [
        "Wie viele Atemzüge macht ein Erwachsener in Ruhe pro Minute?",
        "Wie viele Bundesländer hat die Bundesrepublik Deutschland?",
        { type: "universal", default: 15, unit: "" },
        { main: "Ca. 12 bis 16 Atemzüge pro Minute", imp: "16 Bundesländer" }
      ],
      [
        "Wie viele Tage kann ein Kamel in der Wüste maximal komplett ohne frisches Trinkwasser auskommen?",
        "Wie viele Karten hat ein klassisches deutsches Skatblatt?",
        { type: "universal", default: 25, unit: "" },
        { main: "Bei Hitze ca. 2 bis 3 Wochen, im kühlen Winter sogar deutlich länger", imp: "Exakt 32 Spielkarten" }
      ],
      [
        "Wie viele Kilometer lang sind alle Blutgefäße eines erwachsenen Menschen aneinandergereiht?",
        "Wie viele Stunden hat ein Zeitraum von 11 Jahren ungefähr?",
        { type: "universal", default: 100000, unit: "" },
        { main: "Rund 100.000 Kilometer (zweieinhalb Mal um die Erde!)", imp: "Rund 96.360 Stunden" }
      ],
      [
        "Wie viele Grad Celsius heiß ist die Oberfläche der Sonne ungefähr?",
        "Wie viele Meter hoch ist der höchste Berg Afrikas (Kilimandscharo)?",
        { type: "universal", default: 5800, unit: "" },
        { main: "Ca. 5.500 °C an der Sonnenoberfläche (Photosphäre)", imp: "5.895 Meter über dem Meeresspiegel" }
      ],
      [
        "Wie viele Augen hat eine typische Würfelqualle insgesamt?",
        "Wie viele Stunden hat ein einzelner Tag auf der Erde?",
        { type: "universal", default: 24, unit: "" },
        { main: "Exakt 24 Augen (verteilt auf 4 Sinnesgruben)", imp: "24 Stunden" }
      ],
      [
        "Wie viele Kilogramm wiegt die Zunge eines ausgewachsenen Blauwals alleine?",
        "Wie viele Meter über dem Meeresspiegel liegt ein hoch gelegenes Skigebiet in den Alpen?",
        { type: "universal", default: 3000, unit: "" },
        { main: "Rund 2.700 bis 3.000 Kilogramm (so schwer wie ein ganzer Elefant!)", imp: "Ca. 2.500 bis 3.200 Meter Höhe" }
      ],
      [
        "Wie viele Mal pro Minute schlägt ein kleiner Kolibri im Schwebeflug mit seinen Flügeln?",
        "Wie viele Minuten dauert ein Wochenende von Freitag 18 Uhr bis Sonntag 24 Uhr?",
        { type: "universal", default: 3000, unit: "" },
        { main: "Rund 2.400 bis 4.800 Flügelschläge pro Minute (40–80 Mal pro Sekunde!)", imp: "3.240 Minuten (54 Stunden)" }
      ],
      [
        "Wie viele Knochen besitzt der Hals einer langhalsigen Giraffe (Halswirbel)?",
        "Wie viele Weltwunder der Antike gab es?",
        { type: "universal", default: 7, unit: "" },
        { main: "Genau 7 Halswirbel (genauso viele wie der Mensch, nur jeweils bis zu 25 cm lang!)", imp: "7 Weltwunder der Antike" }
      ],
      [
        "Wie viele Bienen leben im Hochsommer in einem großen Bienenvolk?",
        "Wie viele Zuschauer passen in das Berliner Olympiastadion?",
        { type: "universal", default: 65000, unit: "" },
        { main: "Ca. 40.000 bis 60.000 Bienen in einem Volk im Sommer", imp: "74.475 Sitzplätze im Berliner Olympiastadion" }
      ],
      [
        "Wie viele Dezibel (dB) laut ist ein startender Düsenjet in 100 Metern Entfernung?",
        "Wie viele Minuten dauert ein Fußballspiel inklusive Verlängerung und Halbzeitpausen insgesamt?",
        { type: "universal", default: 140, unit: "" },
        { main: "Ca. 120 bis 140 Dezibel (Bereich der Schmerzgrenze)", imp: "Ca. 140 bis 145 Minuten" }
      ],
      [
        "Wie viele Prozent der menschlichen DNA stimmen mit der DNA eines Schimpansen überein?",
        "Wie viel Grad Celsius beträgt die Siedetemperatur von Wasser auf Meereshöhe?",
        { type: "universal", default: 99, unit: "" },
        { main: "Rund 98,7 bis 99 Prozent Übereinstimmung", imp: "Exakt 100 Grad Celsius" }
      ],
      [
        "Wie viele Jahre braucht eine Plastikflasche im Meer ungefähr, bis sie sich zersetzt hat?",
        "Wie viele Euro kostet aktuell eine neue Spielekonsole (z. B. PlayStation 5)?",
        { type: "universal", default: 450, unit: "" },
        { main: "Rund 450 Jahre laut Umweltbundesamt", imp: "Rund 450 bis 550 Euro" }
      ],
      [
        "Wie viele Monde kreisen nach aktuellem astronomischem Stand um den Planeten Saturn?",
        "Wie viele Länder nehmen typischerweise an einer großen Fußball-WM-Qualifikation teil?",
        { type: "universal", default: 150, unit: "" },
        { main: "274 bestätigte Saturnmonde (Stand 2025 – Rekord im Sonnensystem)", imp: "Rund 200 bis 210 Nationalmannschaften weltweit" }
      ],
      [
        "Wie viele Liter Speichel produziert ein Mensch im Laufe eines gesamten Jahres?",
        "Wie viele Meter hoch ist der Kölner Dom?",
        { type: "universal", default: 155, unit: "" },
        { main: "Ca. 200 bis 550 Liter pro Jahr (etwa 0,5 bis 1,5 Liter pro Tag)", imp: "157,38 Meter Höhe" }
      ],
      [
        "Wie viele Millionen Tonnen wiegt die Cheops-Pyramide in Gizeh geschätzt (in Millionen)?",
        "Wie viele Saiten hat eine klassische Konzertgitarre?",
        { type: "universal", default: 6, unit: "" },
        { main: "Rund 6 Millionen Tonnen (aus ca. 2,3 Millionen Steinblöcken)", imp: "6 Saiten" }
      ],
      [
        "Wie viele Stunden am Tag schläft ein Koala-Bär in den Eukalyptusbäumen?",
        "Wie viele Spieler stehen beim Eishockey von beiden Teams zusammen inkl. Torhütern maximal gleichzeitig auf dem Eis?",
        { type: "universal", default: 18, unit: "" },
        { main: "Bis zu 18 bis 20 Stunden täglich (wegen der energiearmen Eukalyptusblätter)", imp: "12 Spieler (6 pro Mannschaft)" }
      ],
      [
        "Wie viele Kilometer sind es von der Erdoberfläche bis zum Erdmittelpunkt?",
        "Wie viele Sprachen werden heute weltweit noch aktiv gesprochen?",
        { type: "universal", default: 6500, unit: "" },
        { main: "6.371 Kilometer mittlerer Erdradius bis zum Erdkern", imp: "Rund 6.500 bis 7.000 gesprochene Sprachen weltweit" }
      ],
      [
        "Wie viele Herzen besitzt ein gewöhnlicher Oktopus (Krake)?",
        "Wie viele Streifen hat das bekannte Markenlogo von Adidas?",
        { type: "universal", default: 3, unit: "" },
        { main: "Exakt 3 Herzen (ein Haupt- und zwei Kiemenherzen)", imp: "3 Streifen" }
      ],
      [
        "Wie viele Millionen Mal blinzelt ein Mensch in einem gesamten Jahr ungefähr?",
        "Wie viele Millionen Einwohner hat Österreich ungefähr?",
        { type: "universal", default: 9, unit: "" },
        { main: "Ca. 5 bis 8 Millionen Mal pro Jahr (ca. 15.000 Mal am Tag)", imp: "Rund 9,1 Millionen Einwohner" }
      ],
      [
        "Wie viele km/h erreichte der schnellste Mensch der Welt (Usain Bolt) in seiner Spitzengeschwindigkeit?",
        "Wie viele US-Präsidenten gab es von George Washington bis heute?",
        { type: "universal", default: 45, unit: "" },
        { main: "44,72 km/h beim 100-Meter-Weltrekord in Berlin 2009", imp: "47 Präsidentschaften (45 verschiedene Personen)" }
      ],
      [
        "Wie viele Gramm Honig sammelt eine einzelne Honigbiene in ihrem gesamten Leben?",
        "Wie viele Finger hat eine menschliche Hand?",
        { type: "universal", default: 5, unit: "" },
        { main: "Nur etwa 0,5 bis 1 Gramm – rund ein Zwölftel Teelöffel", imp: "5 Finger" }
      ],
      [
        "Wie viele Tage dauert es, bis sich unsere äußerste Hautschicht (Epidermis) einmal komplett erneuert hat?",
        "Wie viele Tage hat der kürzeste Monat des Jahres (Februar)?",
        { type: "universal", default: 28, unit: "" },
        { main: "Ca. 27 bis 28 Tage", imp: "28 Tage (29 im Schaltjahr)" }
      ],
      [
        "Wie viele Kalorien hat eine große Tafel Vollmilchschokolade (100 g)?",
        "Wie viele Minuten dauert ein Flug von Frankfurt nach New York?",
        { type: "universal", default: 520, unit: "" },
        { main: "Ca. 530 bis 550 Kilokalorien pro 100 g", imp: "Ca. 500 bis 520 Minuten (gut 8,5 Stunden)" }
      ],
      [
        "Wie viele Meter hoch ist die Freiheitsstatue in New York inklusive Sockel?",
        "Wie viele Minuten dauert ein klassisches Fußballspiel ohne Nachspielzeit?",
        { type: "universal", default: 92, unit: "" },
        { main: "93 Meter Gesamthöhe (die Figur selbst misst 46 Meter)", imp: "90 Minuten Spielzeit" }
      ],
      [
        "Wie viele Jahre alt ist der älteste bekannte lebende Baum der Erde (Borstenkiefer „Methuselah“)?",
        "Wie viele Meter hoch ist das Matterhorn in der Schweiz?",
        { type: "universal", default: 4600, unit: "" },
        { main: "Rund 4.855 Jahre alt (in den White Mountains, Kalifornien)", imp: "4.478 Meter über dem Meeresspiegel" }
      ],
      [
        "Wie viele Liter Luft atmet ein Erwachsener in Ruhe pro Minute ungefähr?",
        "Wie viele Kontinente gibt es?",
        { type: "universal", default: 7, unit: "" },
        { main: "Ca. 6 bis 8 Liter pro Minute", imp: "7 Kontinente" }
      ],
      [
        "Wie viel Grad Celsius beträgt die normale Körpertemperatur eines Menschen?",
        "Ab wie viel Grad Celsius spricht der Wetterdienst von einem „heißen Tag“?",
        { type: "universal", default: 33, unit: "" },
        { main: "Ca. 36,5 bis 37 °C", imp: "Ab 30 °C" }
      ],
      [
        "Wie viele km/h erreicht ein Wanderfalke im Sturzflug?",
        "Wie viele Tage hat ein Jahr?",
        { type: "universal", default: 350, unit: "" },
        { main: "Über 300 km/h (Messungen bis ca. 390 km/h)", imp: "365 Tage" }
      ],
      [
        "Wie viele Muskeln hat der menschliche Körper ungefähr?",
        "Wie viele Gramm wiegt ein offizieller Basketball?",
        { type: "universal", default: 600, unit: "" },
        { main: "Rund 650 Muskeln", imp: "Ca. 570 bis 650 Gramm" }
      ],
      [
        "Wie viele Jahre alt kann eine Riesenschildkröte werden?",
        "Wie viele Zentimeter groß ist ein Mann in Deutschland im Durchschnitt?",
        { type: "universal", default: 170, unit: "" },
        { main: "Über 150 Jahre", imp: "Rund 179 bis 180 Zentimeter" }
      ],
      [
        "Wie viele Liter Wasser passen ungefähr in eine volle Badewanne?",
        "Wie viele Kilogramm wiegt ein ausgewachsenes Löwenmännchen?",
        { type: "universal", default: 170, unit: "" },
        { main: "Ca. 120 bis 180 Liter", imp: "Ca. 150 bis 250 Kilogramm" }
      ],
      [
        "Wie viele Grad Celsius heiß ist flüssige Lava ungefähr?",
        "Wie viele km/h fliegt ein Passagierjet in Reiseflughöhe ungefähr?",
        { type: "universal", default: 900, unit: "" },
        { main: "Ca. 700 bis 1.200 °C", imp: "Ca. 850 bis 900 km/h" }
      ],
      [
        "Wie viele Protonen hat ein Kohlenstoffatom?",
        "Wie viele Beine hat ein Insekt?",
        { type: "universal", default: 6, unit: "" },
        { main: "6 Protonen", imp: "6 Beine" }
      ],
      [
        "Wie viele Meter tief können Pottwale tauchen?",
        "Wie viele Kilometer sind es Luftlinie von Berlin nach Madrid?",
        { type: "universal", default: 1900, unit: "" },
        { main: "Über 2.000 Meter", imp: "Rund 1.870 Kilometer" }
      ],
      [
        "Wie viele Gramm wiegt ein Hühnerei der Größe M?",
        "Wie viele Kilogramm wiegt ein erwachsener Mensch im Durchschnitt?",
        { type: "universal", default: 65, unit: "" },
        { main: "53 bis 63 Gramm", imp: "Ca. 70 bis 80 Kilogramm" }
      ],
      [
        "Wie viele Stunden braucht die Erde für eine Drehung um sich selbst?",
        "Wie viel Karat hat reines Gold?",
        { type: "universal", default: 24, unit: "" },
        { main: "Rund 24 Stunden (genau 23 h 56 min)", imp: "24 Karat" }
      ],
      [
        "Wie viele Bit hat ein Byte?",
        "Wie viele Arme hat ein Oktopus?",
        { type: "universal", default: 8, unit: "" },
        { main: "8 Bit", imp: "8 Arme" }
      ],
      [
        "Wie viele Kilometer pro Sekunde legt die Erde auf ihrer Bahn um die Sonne zurück?",
        "Wie viele Tage hat der Monat April?",
        { type: "universal", default: 30, unit: "" },
        { main: "Rund 30 Kilometer pro Sekunde", imp: "30 Tage" }
      ],
      [
        "Wie viel Prozent des Körpers eines Erwachsenen bestehen aus Wasser?",
        "Wie viele Minuten hat eine Stunde?",
        { type: "universal", default: 60, unit: "" },
        { main: "Rund 55 bis 60 Prozent", imp: "60 Minuten" }
      ],
      [
        "Wie viele Kilometer hoch fliegt die Internationale Raumstation ISS ungefähr?",
        "Wie viele Meter ist eine Runde auf der Leichtathletik-Bahn lang?",
        { type: "universal", default: 400, unit: "" },
        { main: "Rund 400 Kilometer", imp: "400 Meter" }
      ]
    ]
  },
  {
    id: "q_skala",
    name: "Circa-Imposter: Skala 1–10 (Slider)",
    icon: "fa-gauge-high",
    pairs: [
      [
        "Auf einer Skala von 1–10: Wie gut kannst du kochen?",
        "Auf einer Skala von 1–10: Wie pünktlich bist du bei Verabredungen?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie ordentlich ist deine Wohnung genau jetzt?",
        "Auf einer Skala von 1–10: Wie gut kannst du Geheimnisse für dich behalten?",
        { min: 1, max: 10, step: 1, default: 8, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie mutig bist du in einer riesigen Achterbahn?",
        "Auf einer Skala von 1–10: Wie gut kannst du mit Geld umgehen?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut bist du im Flirten?",
        "Auf einer Skala von 1–10: Wie gut ist dein Orientierungssinn ohne Navi?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie geduldig bist du im Straßenverkehr?",
        "Auf einer Skala von 1–10: Wie ausgeschlafen fühlst du dich heute?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du singen?",
        "Auf einer Skala von 1–10: Wie leicht erschreckst du dich bei Horrorfilmen?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sportlich schätzt du dich aktuell ein?",
        "Auf einer Skala von 1–10: Wie gut kannst du bei Spielen verlieren?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie abergläubisch bist du?",
        "Auf einer Skala von 1–10: Wie nachtragend bist du nach einem Streit?",
        { min: 1, max: 10, step: 1, default: 4, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut überstehst du einen langen Partyabend?",
        "Auf einer Skala von 1–10: Wie begabt bist du beim Möbelaufbau?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr achtest du auf gesunde Ernährung?",
        "Auf einer Skala von 1–10: Wie gut merkst du dir Namen von neuen Leuten?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie spontan bist du bei Wochenendplänen?",
        "Auf einer Skala von 1–10: Wie gut bist du im Notlügen, ohne rot zu werden?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie romantisch bist du?",
        "Auf einer Skala von 1–10: Wie schnell antwortest du auf Nachrichten?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie technikaffin bist du?",
        "Auf einer Skala von 1–10: Wie gerne stehst du auf Partys im Mittelpunkt?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kommst du morgens aus dem Bett?",
        "Auf einer Skala von 1–10: Wie eifersüchtig bist du?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du rückwärts einparken?",
        "Auf einer Skala von 1–10: Wie gerne telefonierst du mit Fremden?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie wählerisch bist du beim Essen?",
        "Auf einer Skala von 1–10: Wie gut hältst du Sommerhitze über 32 Grad aus?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie oft verlegst du Schlüssel oder Handy?",
        "Auf einer Skala von 1–10: Wie sehr magst du Überraschungspartys?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du tanzen?",
        "Auf einer Skala von 1–10: Wie gut kannst du frei vor vielen Leuten reden?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du Massagen geben?",
        "Auf einer Skala von 1–10: Wie sicher fühlst du dich bei Glatteis auf der Straße?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du Geschenke schön einpacken?",
        "Auf einer Skala von 1–10: Wie gerne gehst du alleine ins Kino oder Restaurant?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie leicht lässt du dich beim Arbeiten ablenken?",
        "Auf einer Skala von 1–10: Wie sehr liebst du scharfes Essen?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut ist dein Pokerface beim Spielen?",
        "Auf einer Skala von 1–10: Wie ordentlich ist der Kofferraum oder dein Rucksack gerade?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gerne machst du Campingurlaub im Zelt?",
        "Auf einer Skala von 1–10: Wie gut erinnerst du dich an Geburtstage ohne Kalender?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du verhandeln oder feilschen?",
        "Auf einer Skala von 1–10: Wie entspannt bleibst du bei Turbulenzen im Flugzeug?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr achtest du auf Markenkleidung?",
        "Auf einer Skala von 1–10: Wie gerne stehst du am Grill?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du mit kleinen Kindern umgehen?",
        "Auf einer Skala von 1–10: Wie gut hältst du deine Neujahrsvorsätze ein?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie harmoniebedürftig bist du?",
        "Auf einer Skala von 1–10: Wie gerne probierst du exotisches Essen aus?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du zeichnen oder malen?",
        "Auf einer Skala von 1–10: Wie gerne gehst du im Winter spazieren?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie schlagfertig bist du in Diskussionen?",
        "Auf einer Skala von 1–10: Wie pünktlich zahlst du Rechnungen?",
        { min: 1, max: 10, step: 1, default: 8, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr freust du dich auf das nächste Wochenende?",
        "Auf einer Skala von 1–10: Wie gut war dein letzter Urlaub?",
        { min: 1, max: 10, step: 1, default: 8, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du Überraschungen geheim halten?",
        "Auf einer Skala von 1–10: Wie gut kannst du bei Gesellschaftsspielen bluffen?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr liebst du Schokolade?",
        "Auf einer Skala von 1–10: Wie sehr liebst du Kaffee?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gerne gehst du ins Fitnessstudio?",
        "Auf einer Skala von 1–10: Wie gerne gehst du joggen?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du mit Stress umgehen?",
        "Auf einer Skala von 1–10: Wie ruhig bleibst du, wenn dein Zug Verspätung hat?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr nervt dich schlechtes WLAN?",
        "Auf einer Skala von 1–10: Wie sehr nervt dich ein leerer Handyakku unterwegs?",
        { min: 1, max: 10, step: 1, default: 8, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kannst du Karaoke singen?",
        "Auf einer Skala von 1–10: Wie gerne tanzt du auf Hochzeiten?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gerne spielst du Brettspiele?",
        "Auf einer Skala von 1–10: Wie gerne spielst du Videospiele?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie wichtig ist dir ein aufgeräumter Schreibtisch?",
        "Auf einer Skala von 1–10: Wie wichtig ist dir ein gemachtes Bett?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr freust du dich auf Weihnachten?",
        "Auf einer Skala von 1–10: Wie sehr freust du dich auf deinen Geburtstag?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gerne fährst du Auto?",
        "Auf einer Skala von 1–10: Wie gerne fährst du Fahrrad?",
        { min: 1, max: 10, step: 1, default: 6, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie mutig bist du bei neuen Frisuren?",
        "Auf einer Skala von 1–10: Wie mutig bist du bei ungewöhnlicher Kleidung?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut ist dein Englisch?",
        "Auf einer Skala von 1–10: Wie gut kannst du Texte schreiben?",
        { min: 1, max: 10, step: 1, default: 7, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie sehr magst du Regenwetter?",
        "Auf einer Skala von 1–10: Wie sehr magst du Gewitter?",
        { min: 1, max: 10, step: 1, default: 4, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gerne gehst du shoppen?",
        "Auf einer Skala von 1–10: Wie gerne gehst du auf Flohmärkte?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ],
      [
        "Auf einer Skala von 1–10: Wie gut kennst du dich mit Fußball aus?",
        "Auf einer Skala von 1–10: Wie gut kennst du dich mit Promi-News aus?",
        { min: 1, max: 10, step: 1, default: 5, unit: " / 10" }
      ]
    ]
  },
  {
    id: "q_orte",
    name: "Orte, Städte & Reisen",
    icon: "fa-map-location-dot",
    pairs: [
      ["Was ist deine absolute Lieblingsstadt auf der Welt?", "Welche Stadt würdest du Touristen eher nicht empfehlen?"],
      ["In welches Land würdest du am liebsten auswandern?", "In welchem Land würdest du niemals länger als 2 Tage bleiben wollen?"],
      ["Was ist der romantischste Ort für ein erstes Date?", "Was ist der peinlichste Ort, um seinen Ex-Partner zufällig zu treffen?"],
      ["Welchen Ort besuchst du im Alltag fast jede Woche?", "An welchem Ort warst du schon seit mindestens 3 Jahren nicht mehr?"],
      ["Wo kann man im Urlaub am besten komplett entspannen?", "An welchem Ort bekommt man garantiert sofort schlechte Laune?"],
      ["Welche Stadt hat deiner Meinung nach das beste Essen?", "In welcher Stadt ist das Leben viel zu teuer und überbewertet?"],
      ["Welches Reiseziel steht ganz oben auf deiner Bucket-List?", "Welches Reiseziel finden alle toll, lässt dich aber völlig kalt?"],
      ["Wo würdest du dich bei einer Zombie-Apokalypse verschanzen?", "Wo verliert man beim Feiern am schnellsten sein Handy oder seinen Schlüssel?"],
      ["In welchem Raum deiner Wohnung hältst du dich am liebsten auf?", "Welchen Raum in deiner Wohnung putzt du am allerungernsten?"],
      ["Was war dein bisher schönster Urlaubsort überhaupt?", "Wohin ging deine chaotischste Klassenfahrt damals?"],
      ["In welcher Stadt würdest du gerne mal ein ganzes Wochenende durchfeiern?", "In welcher Stadt würdest du dich nachts alleine unwohl fühlen?"],
      ["Welches Land hat deiner Meinung nach die freundlichsten Menschen?", "Welches Land hat für dich die komplizierteste Sprache?"],
      ["Wo lernt man am leichtesten neue Leute kennen?", "Wo möchte man auf keinen Fall von Fremden angesprochen werden?"],
      ["Was ist der beste Ort für einen Heiratsantrag?", "Was ist der unpassendste Ort für ein lautes Telefonat?"],
      ["Auf welche Insel würdest du sofort reisen?", "Welche Insel kennst du eigentlich nur aus dem Fernsehen?"],
      ["Wo gibt es in deiner Gegend den besten Ausblick?", "Wo steht man in deiner Gegend fast immer im Stau oder in der Schlange?"],
      ["In welchem Geschäft könntest du stundenlang stöbern?", "Aus welchem Geschäft gehst du immer so schnell wie möglich wieder raus?"],
      ["Welches Wahrzeichen möchtest du unbedingt mal live sehen?", "Welches berühmte Wahrzeichen sieht auf Fotos größer aus als in echt?"],
      ["Wo würdest du deinen 30. oder 40. Geburtstag am liebsten feiern?", "Wo würdest du niemals freiwillig übernachten?"],
      ["Welche Stadt hat die schönste Architektur?", "Welche Stadt wirkt auf dich eher grau und hektisch?"],
      ["An welchem Ort hast du als Kind am liebsten gespielt?", "An welchem Ort musstest du als Kind immer stillsitzen?"],
      ["Welches Nachbarland besuchst du am liebsten?", "Durch welches Land bist du bisher nur durchgefahren?"],
      ["Wo kann man am Sonntag am besten spazieren gehen?", "Wo ist es am Wochenende immer viel zu überfüllt?"],
      ["Welcher Ort inspiriert dich zu guten Ideen?", "An welchem Ort vergisst man sofort, was man eigentlich wollte?"],
      ["Wo würdest du ein Ferienhaus kaufen, wenn Geld keine Rolle spielt?", "Wo wäre dir das Wetter auf Dauer viel zu extrem?"],
      ["Welches Museum oder Stadion hat dich am meisten beeindruckt?", "In welchem Gebäude hast du dich schon mal komplett verlaufen?"],
      ["Wo schmeckt das Essen im Urlaub am allerbesten?", "Wo bekommt man meistens nur überteuerte Touristen-Fallen?"],
      ["Welchen Kontinent findest du kulturell am spannendsten?", "Vor welchem Kontinent hättest du wegen giftiger Tiere am meisten Respekt?"],
      ["Wo sitzt du im Zug oder Flugzeug am liebsten?", "Wo bekommt man im Reisebus am schnellsten Reiseübelkeit?"],
      ["An welchem Ort vergisst man sofort die Uhrzeit?", "An welchem Ort schaut man jede Minute ungeduldig auf die Uhr?"],
      ["In welchem Café oder Restaurant deiner Stadt bestellst du am liebsten?", "In welchem Laden wurdest du schon einmal richtig unfreundlich bedient?"],
      ["Welcher Strand oder Badesee ist für dich im Sommer unschlagbar?", "An welchem Gewässer gibt es im Sommer immer die meisten Mücken?"],
      ["Welche europäische Hauptstadt sollte jeder einmal gesehen haben?", "In welcher Hauptstadt ist der Straßenverkehr das reinste Chaos?"],
      ["Wo machst du am liebsten Fotos im Urlaub?", "Wo stehen immer viel zu viele Touristen für ein Foto im Weg?"],
      ["An welchem Ort fühlst du dich sofort wie zu Hause?", "An welchem Ort fühlst du dich immer fehl am Platz?"],
      ["Welcher Freizeitpark hat die besten Achterbahnen?", "Wo steht man stundenlang für nur zwei Minuten Fahrspaß an?"],
      ["In welcher Region Deutschlands kann man am besten Urlaub machen?", "Welche Region kennt man eigentlich nur von Autobahnschildern?"],
      ["Wo würdest du gerne einmal Silvester feiern?", "Wo ist es an Silvester viel zu laut und gefährlich?"],
      ["Welches Stadion oder welche Konzerthalle hat die beste Stimmung?", "Wo findet man nach einer Veranstaltung nie einen Parkplatz?"],
      ["An welchem Ort hast du deinen bisher schönsten Sonnenuntergang gesehen?", "An welchem Ort wurdest du schon einmal komplett vom Regen überrascht?"],
      ["In welcher Stadt würdest du gerne ein Jahr studieren?", "In welcher Stadt würdest du nie eine Wohnung suchen wollen?"],
      ["Welcher Ort ist perfekt für einen Junggesellenabschied?", "Wo würdest du niemals deinen Junggesellenabschied feiern?"],
      ["Welches Land hat die schönsten Strände?", "In welchem Land war das Wetter im Urlaub am schlechtesten?"],
      ["Wo kann man am besten Ski fahren?", "Wo ist es im Winter am ungemütlichsten?"],
      ["Welche Stadt würdest du für einen Städtetrip im Advent wählen?", "Welche Stadt ist im Sommer viel zu heiß zum Besichtigen?"],
      ["Wohin würdest du mit einem Wohnmobil reisen?", "Wohin würdest du nie mit dem Auto fahren wollen?"],
      ["Wo frühstückst du am liebsten, wenn du auswärts isst?", "Wo bekommt man den schlechtesten Kaffee?"],
      ["Welcher Ort in deiner Heimat ist ein Geheimtipp?", "Welcher Ort in deiner Heimat ist total überlaufen?"],
      ["In welchem Land würdest du gerne eine Safari machen?", "In welchem Land hättest du am meisten Respekt vor den Tieren?"],
      ["Welche Stadt hat das beste Nachtleben?", "In welcher Stadt werden um 22 Uhr die Bürgersteige hochgeklappt?"],
      ["Wo würdest du gerne einmal Polarlichter sehen?", "Wo war es für dich jemals am kältesten?"],
      ["Welches Bundesland würdest du Touristen empfehlen?", "Welches Bundesland kennst du am wenigsten?"],
      ["Wo verbringst du am liebsten einen Regentag?", "Wo hast du schon mal wegen Regen festgesessen?"],
      ["Welche Insel würdest du für Flitterwochen wählen?", "Welche Insel wäre dir für einen ganzen Urlaub zu langweilig?"],
      ["Wo würdest du gerne ein eigenes Café eröffnen?", "Wo würdest du niemals einen Laden eröffnen?"]
    ]
  },
  {
    id: "q_alltag",
    name: "Alltag, Vorlieben & Gewohnheiten",
    icon: "fa-bolt",
    pairs: [
      ["Welches Gericht könntest du problemlos dreimal pro Woche essen?", "Welches Essen hast du als Kind gehasst, isst es heute aber ab und zu?"],
      ["Was ist das Erste, was du nach dem Feierabend zu Hause machst?", "Was schiebst du im Haushalt immer bis zur letzten Sekunde vor dir her?"],
      ["Welches Schulfach lag dir früher am allerbesten?", "In welchem Schulfach hast du früher am häufigsten abgeschrieben oder gedöst?"],
      ["Was ist für dich das beste Geschenk zum Geburtstag?", "Worüber freut man sich beim Auspacken meist nur aus Höflichkeit?"],
      ["Welche App auf deinem Handy nutzt du jeden einzelnen Tag?", "Welche App auf deinem Handy frisst dir viel zu viel Lebenszeit weg?"],
      ["Welches Tier hättest du gerne als treuen Begleiter?", "Vor welchem Tier hast du insgeheim großen Respekt oder leichten Ekel?"],
      ["Was bestellst du dir fast immer an der Bar oder im Café?", "Welches Getränk trinkst du nur, wenn absolut nichts anderes mehr da ist?"],
      ["Welche Eigenschaft schätzt du an deinem besten Freund am meisten?", "Welche Eigenschaft nennt man im Bewerbungsgespräch gerne als Stärke?"],
      ["Wofür gibst du gerne auch mal etwas mehr Geld aus?", "Wofür gibst du Geld aus und ärgerst dich hinterher oft darüber?"],
      ["Welches Hobby wolltest du schon immer mal richtig lernen?", "Welches Hobby sieht von außen total einfach aus, ist aber mega anstrengend?"],
      ["Was darf bei einem perfekten Sonntag auf keinen Fall fehlen?", "Was fällt dir immer erst Sonntagabend spät wieder ein?"],
      ["Welches Kleidungsstück trägst du am allerliebsten?", "Welches Kleidungsstück liegt seit Jahren ungetragen ganz hinten im Schrank?"],
      ["Welche Musikrichtung hörst du beim Autofahren oder Sport am liebsten?", "Zu welcher Musikrichtung kann man erst spät nachts auf Partys tanzen?"],
      ["Was kaufst du im Supermarkt fast jedes Mal spontan?", "Was vergisst man beim Einkaufen fast immer als Erstes?"],
      ["Welches Brett- oder Kartenspiel gewinnst du fast immer?", "Bei welchem Spiel gibt es in der Gruppe immer die hitzigsten Diskussionen?"],
      ["Was machst du, wenn du abends absolut nicht einschlafen kannst?", "Was macht man heimlich während eines langweiligen Online-Meetings?"],
      ["Welches Obst oder Gemüse landet bei dir ständig im Einkaufswagen?", "Welches Lebensmittel wird im Kühlschrank am schnellsten vergessen?"],
      ["Was war dein Traumberuf, als du acht Jahre alt warst?", "Welchen Beruf würdest du für kein Geld der Welt ausüben wollen?"],
      ["Welches Geräusch entspannt dich sofort?", "Welches Geräusch bringt dich morgens sofort auf die Palme?"],
      ["Welche Serie hast du an einem einzigen Wochenende durchgeschaut?", "Welche bekannte Serie hast du nach der ersten Folge abgebrochen?"],
      ["Welches Gewürz benutzt du beim Kochen fast immer?", "Welches Gewürz ruiniert für dich sofort jedes Gericht?"],
      ["Was liegt immer griffbereit neben deinem Bett?", "Was sucht man morgens in der Hektik immer am längsten?"],
      ["Welchen Sport schaust du dir gerne im Fernsehen an?", "Bei welchem Sport versteht man die Regeln erst nach dreimaligem Erklären?"],
      ["Welche Eissorte nimmst du in der Eisdiele fast immer?", "Welche Eissorte sieht bunt aus, schmeckt aber völlig künstlich?"],
      ["Was ist dein liebstes Ritual am Morgen?", "Was lässt du morgens als Erstes weg, wenn du verschlafen hast?"],
      ["Welches Haushaltsgerät rettet dir im Alltag am meisten Zeit?", "Welches Küchengerät benutzt man einmal im Jahr und nie wieder?"],
      ["Welchen Pizzabelag bestellst du am liebsten?", "Welcher Pizzabelag sorgt am Tisch immer für Diskussionen?"],
      ["Welche Jahreszeit gefällt dir vom Lebensgefühl am besten?", "In welcher Jahreszeit wird man gefühlt jedes Mal erkältet?"],
      ["Was machst du bei einer langen Zug- oder Autofahrt am liebsten?", "Wovon wird einem auf dem Rücksitz im Auto sofort schlecht?"],
      ["Welchen Snack holst du dir im Kino immer?", "Welcher Snack macht beim Essen im Kino viel zu laute Geräusche?"],
      ["Welches Lied bringt dich sofort zum Mitsingen?", "Welcher Ohrwurm nervt dich schon beim ersten Ton im Radio?"],
      ["Was ist für dich das beste Mittel gegen schlechte Laune?", "Was macht schlechte Laune garantiert noch schlimmer?"],
      ["Welches Brettspiel oder Videospiel könntest du die ganze Nacht durchspielen?", "Bei welchem Spiel verlierst du nach 10 Minuten die Geduld?"],
      ["Welchen Kuchen oder welches Gebäck isst du am liebsten?", "Welches Gebäck krümelt beim Essen immer das ganze Sofa voll?"],
      ["Worauf freust du dich nach einem langen Urlaub zu Hause am meisten?", "Was nervt dich schon am ersten Tag nach dem Urlaub sofort wieder?"],
      ["Welche Hausarbeit erledigst du eigentlich ganz gerne nebenbei?", "Welche Hausarbeit würdest du sofort an einen Roboter abgeben?"],
      ["Was bestellst du beim Lieferdienst, wenn du richtig Hunger hast?", "Welches Essen schmeckt geliefert fast immer schlechter als vor Ort?"],
      ["Mit welchem Hintergrundgeräusch kannst du am besten entspannen?", "Welches Geräusch aus der Nachbarwohnung treibt einen in den Wahnsinn?"],
      ["Welche Süßigkeit aus deiner Kindheit vermisst du heute?", "Welche Süßigkeit bleibt in gemischten Tüten immer bis zum Schluss übrig?"],
      ["Was kaufst du immer auf Vorrat ein?", "Was ist zu Hause grundsätzlich genau dann leer, wenn man es braucht?"],
      ["Welches Frühstück macht dich glücklich?", "Was isst du, wenn der Kühlschrank fast leer ist?"],
      ["Welches Getränk bestellst du auf einer Party als Erstes?", "Welches Getränk würdest du auf einer Party nie trinken?"],
      ["Welche Farbe hat dein Lieblingspullover?", "Welche Farbe würdest du nie als Wandfarbe wählen?"],
      ["Welcher Wochentag ist dein Lieblingstag?", "An welchem Wochentag bist du am müdesten?"],
      ["Welche Serie empfiehlst du jedem?", "Welche Serie schaust du nur nebenbei mit dem Handy in der Hand?"],
      ["Was ist dein Lieblingsgericht von Oma oder Mama?", "Welches Gericht gab es früher viel zu oft?"],
      ["Was machst du als Erstes, wenn du aufwachst?", "Was machst du als Letztes vor dem Einschlafen?"],
      ["Welche Sportart würdest du gerne richtig gut können?", "Welche Sportart hast du im Schulsport gehasst?"],
      ["Was trinkst du am liebsten im Sommer?", "Was trinkst du am liebsten im Winter?"],
      ["Welches Spielzeug hattest du als Kind am liebsten?", "Welches Spielzeug wolltest du immer haben, hast es aber nie bekommen?"],
      ["Welchen Podcast oder Kanal hörst oder schaust du gerne?", "Wem folgst du in Social Media, obwohl er oder sie dich nervt?"],
      ["Was ist dein Lieblingsduft?", "Welcher Geruch erinnert dich an deine Kindheit?"],
      ["Welches Möbelstück würdest du dir sofort neu kaufen?", "Welches Möbelstück steht bei dir eigentlich nur herum?"],
      ["Welcher Feiertag ist dein liebster?", "Welcher Feiertag ist dir eigentlich egal?"],
      ["Was kochst du, wenn Gäste kommen?", "Was kochst du, wenn es richtig schnell gehen muss?"]
    ]
  },
  {
    id: "q_personen",
    name: "Personen, Promis & Typen",
    icon: "fa-user-astronaut",
    pairs: [
      ["Mit welchem Promi würdest du gerne mal einen Abend lang essen gehen?", "Welcher Promi wird deiner Meinung nach völlig überschätzt?"],
      ["Wer aus dieser Spielrunde würde bei „Wer wird Millionär“ am weitesten kommen?", "Wer aus dieser Spielrunde würde im Dschungelcamp als Erstes aufgeben?"],
      ["Mit welcher historischen Persönlichkeit würdest du gerne für einen Tag tauschen?", "Vor welcher historischen Persönlichkeit hättest du am meisten Respekt gehabt?"],
      ["Wer aus dieser Runde könnte am besten ein Doppelleben als Geheimagent führen?", "Wer aus dieser Runde verplappert sich bei Überraschungen immer als Erstes?"],
      ["Welcher Filmcharakter oder Superheld ist dir am ähnlichsten?", "Welcher Filmcharakter hat dich im Kino am meisten genervt?"],
      ["Wen aus dieser Runde würdest du anrufen, wenn du nachts im Nirgendwo strandest?", "Wer aus dieser Runde geht fast nie ans Telefon, wenn man ihn dringend braucht?"],
      ["Welcher Musiker oder welche Band liefert den Soundtrack deines Lebens?", "Welchen Musiker hört man heimlich, gibt es aber selten zu?"],
      ["Wer aus dieser Runde würde als Bürgermeister die besten Partys organisieren?", "Wer aus dieser Runde würde im Lotto gewinnen und es niemandem erzählen?"],
      ["Welcher Schauspieler sollte dich in der Verfilmung deines Lebens spielen?", "Welcher Schauspieler spielt in jedem Film gefühlt immer dieselbe Rolle?"],
      ["Wer in dieser Runde hat den außergewöhnlichsten Geschmack?", "Wer in dieser Runde braucht morgens im Bad mit Abstand am längsten?"],
      ["Von welchem Experten oder Beruf lässt du dir gerne Ratschläge geben?", "Welcher Berufsgruppe glaubst du prinzipiell erst mal nur die Hälfte?"],
      ["Wer aus dieser Runde würde eine Survival-Show am ehesten gewinnen?", "Wer aus dieser Runde würde nach zwei Stunden ohne Internet nervös werden?"],
      ["Welchen Sportler bewunderst du für seine Disziplin am meisten?", "Welcher Sportler sorgt abseits des Platzes für die meisten Schlagzeilen?"],
      ["Wer aus dieser Runde ist der beste Beifahrer auf langen Roadtrips?", "Wer aus dieser Runde sollte beim Autofahren lieber niemals die Musik auswählen?"],
      ["Mit welchem fiktiven Bösewicht hast du insgeheim ein bisschen Verständnis?", "Welcher fiktive Held trifft in Filmen immer die unlogischsten Entscheidungen?"],
      ["Wer aus unserer Runde hat immer die besten Geschenkideen?", "Wer aus unserer Runde kauft Geschenke immer erst auf den allerletzten Drücker?"],
      ["Welcher Promi wirkt im Fernsehen total sympathisch und bodenständig?", "Welcher Promi wäre im echten Leben wahrscheinlich extrem anstrengend?"],
      ["Wer aus dieser Runde könnte am besten als Stand-up-Comedian auftreten?", "Wer aus dieser Runde lacht über seine eigenen Witze immer am längsten?"],
      ["Wer aus dieser Runde würde sich am ehesten spontan ein verrücktes Tattoo stechen lassen?", "Wer aus dieser Runde braucht im Restaurant immer 20 Minuten für die Speisekarte?"],
      ["Welcher Lehrer oder Professor ist dir positiv im Gedächtnis geblieben?", "Welcher Typ Mensch drängelt sich an der Supermarktkasse immer vor?"],
      ["Wer aus dieser Runde wäre der strengste Schiedsrichter?", "Wer aus dieser Runde diskutiert bei Brettspielen am längsten über die Regeln?"],
      ["Welcher Komiker bringt dich zuverlässig zum Lachen?", "Über welchen Humor kannst du meistens nur müde lächeln?"],
      ["Wer aus dieser Runde würde im Mittelalter als König regieren?", "Wer aus dieser Runde würde sich in einer fremden Stadt nach 5 Minuten verlaufen?"],
      ["Mit wem aus dieser Runde würdest du eine Firma gründen?", "Mit wem aus dieser Runde sollte man lieber kein gemeinsames Bankkonto haben?"],
      ["Welcher Promi altert deiner Meinung nach mit beeindruckender Eleganz?", "Welcher Promi sieht heute völlig anders aus als früher?"],
      ["Wer aus dieser Runde hat für jedes Problem sofort eine praktische Lösung?", "Wer aus dieser Runde googelt bei kleinen Symptomen sofort die schlimmsten Krankheiten?"],
      ["Welche fiktive Familie aus einer Serie findest du am sympathischsten?", "In welcher Serien-WG würdest du es keinen Tag aushalten?"],
      ["Wer aus dieser Runde behält in chaotischen Momenten immer die Ruhe?", "Wer aus dieser Runde gerät schon beim Kofferpacken in Stress?"],
      ["Welcher Regisseur oder Autor hat dich am meisten begeistert?", "Welcher Influencer oder TV-Star taucht für deinen Geschmack viel zu oft überall auf?"],
      ["Wer aus dieser Runde würde ein Geheimnis mit ins Grab nehmen?", "Wer aus dieser Runde erzählt Geschichten jedes Mal ein bisschen dramatischer?"],
      ["Wer aus dieser Runde würde bei einem Quizduell als Telefonjoker am meisten helfen?", "Wer aus dieser Runde rät bei Wissensfragen immer mit voller Überzeugung drauflos?"],
      ["Mit welchem Sportstar würdest du gerne mal eine Trainingseinheit absolvieren?", "Gegen welchen Sportstar würdest du nicht mal eine Minute durchhalten?"],
      ["Wer aus dieser Runde hat das beste Gespür für Mode und Stil?", "Wer aus dieser Runde würde am liebsten jeden Tag in Jogginghose herumlaufen?"],
      ["Welcher Promi könnte deiner Meinung nach auch ein guter Politiker sein?", "Welcher Promi sollte sich aus ernsten Themen lieber komplett heraushalten?"],
      ["Wer aus dieser Runde findet sich auch ohne Handy in jeder fremden Stadt zurecht?", "Wer aus dieser Runde läuft selbst mit Google Maps erstmal in die falsche Richtung?"],
      ["Welchen fiktiven Detektiv würdest du bei einem Kriminalfall engagieren?", "Welcher Film-Polizist sorgt im Einsatz immer für den größten Sachschaden?"],
      ["Wer aus dieser Runde wäre der geduldigste Lehrer?", "Wer aus dieser Runde verliert beim Erklären von Technik am schnellsten die Nerven?"],
      ["Mit welcher berühmten Band würdest du gerne mal auf Welttournee gehen?", "Welche Band hatte eigentlich nur einen einzigen guten Hit?"],
      ["Wer aus dieser Runde macht die besten Fotos von anderen?", "Wer aus dieser Runde schaut auf Gruppenfotos fast immer gerade weg?"],
      ["Welcher Koch oder Food-Creator macht dir sofort Hunger?", "Bei welchem TV-Koch wirkt jedes Rezept viel zu kompliziert?"],
      ["Wer aus dieser Runde wäre der beste Reiseführer?", "Wer aus dieser Runde plant Urlaube bis ins kleinste Detail?"],
      ["Welcher Promi wäre der perfekte Nachbar?", "Welcher Promi wäre ein anstrengender Mitbewohner?"],
      ["Wer aus dieser Runde würde in einer Quizshow am meisten Geld gewinnen?", "Wer aus dieser Runde kennt die meisten unnützen Fakten?"],
      ["Wer aus dieser Runde wäre der beste DJ?", "Wer aus dieser Runde singt im Auto am lautesten mit?"],
      ["Welche Märchenfigur passt am besten zu dir?", "Welche Märchenfigur fandest du als Kind gruselig?"],
      ["Wer aus dieser Runde wäre der beste Babysitter?", "Wer aus dieser Runde wäre am liebsten Tierpfleger im Zoo?"],
      ["Welcher YouTuber oder Streamer ist am unterhaltsamsten?", "Welcher YouTuber oder Streamer ist dir zu laut?"],
      ["Wer aus dieser Runde würde in einem Horrorfilm am längsten überleben?", "Wer aus dieser Runde würde im Horrorfilm als Erstes allein in den Keller gehen?"],
      ["Welche Disney-Figur wärst du gerne?", "Welcher Disney-Bösewicht ist am coolsten?"],
      ["Wer aus dieser Runde wäre die beste Sportlehrkraft?", "Wer aus dieser Runde hätte den Sportunterricht am liebsten geschwänzt?"],
      ["Welcher Sänger oder welche Sängerin hat die schönste Stimme?", "Welcher Sänger oder welche Sängerin wird dir schnell zu viel?"],
      ["Wer aus dieser Runde hat die schönste Handschrift?", "Wer aus dieser Runde schickt die längsten Sprachnachrichten?"],
      ["Welche historische Person würdest du gerne interviewen?", "Welche historische Person wurde im Schulunterricht zu oft behandelt?"],
      ["Wer aus dieser Runde würde am ehesten eine eigene Kochshow bekommen?", "Wer aus dieser Runde lässt beim Kochen am meisten anbrennen?"],
      ["Welchen Spitznamen hattest du früher?", "Welchen Spitznamen würdest du heute niemandem verraten?"]
    ]
  },
  {
    id: "q_dilemma",
    name: "Beichten, Moral & Dilemma",
    icon: "fa-scale-balanced",
    pairs: [
      ["Welche kleine Notlüge benutzt du im Alltag am häufigsten?", "Welche Ausrede glaubst du anderen Leuten grundsätzlich nie?"],
      ["Welche Superkraft hättest du im Alltag am allerliebsten?", "Welche Superkraft würde in den falschen Händen das größte Chaos anrichten?"],
      ["Was würdest du tun, wenn du für 24 Stunden komplett unsichtbar wärst?", "Was macht man nur, wenn man ganz sicher weiß, dass man alleine zu Hause ist?"],
      ["Welche Regel oder welches Gesetz würdest du sofort abschaffen?", "Welche gesellschaftliche Regel halten fast alle ein, obwohl sie sinnlos wirkt?"],
      ["Worauf bist du in deinem bisherigen Leben besonders stolz?", "Was würdest du deinem 16-jährigen Ich heute raten?"],
      ["Was ist für dich beim ersten Date ein absolutes No-Go?", "Welche kleine Macke findest du an anderen Menschen eigentlich ganz charmant?"],
      ["In welches Jahrzehnt würdest du mit einer Zeitmaschine sofort reisen?", "In welchem Jahrzehnt hättest du auf keinen Fall leben wollen?"],
      ["Was würdest du als Erstes kaufen, wenn du heute eine Million gewinnst?", "Welcher Luxusartikel ist deiner Meinung nach reine Geldverschwendung?"],
      ["Welches Kompliment hört man im Leben am allerliebsten?", "Welcher Satz in einem Streit macht alles sofort noch schlimmer?"],
      ["Was war der mutigste Moment in deinem bisherigen Leben?", "Bei welcher Situation hattest du im Nachhinein mehr Glück als Verstand?"],
      ["Worüber könntest du spontan einen langen Vortrag halten?", "Bei welchem Gesprächsthema schaltest du innerlich sofort ab?"],
      ["Welche Erfindung der Menschheit ist für dich die wichtigste überhaupt?", "Welche moderne Erfindung hat das Zusammenleben eher stressiger gemacht?"],
      ["Welchen Gegenstand würdest du zuerst auf eine Reise mitnehmen?", "Welchen Gegenstand hebst du nur aus Sentimentalität noch auf?"],
      ["Welchen Rat würdest du jedem jungen Menschen mit auf den Weg geben?", "Welchen Spruch von Eltern konnte man früher überhaupt nicht mehr hören?"],
      ["Was ist das Beste am Erwachsensein?", "Was vermisst du aus deiner Kindheit am allermeisten?"],
      ["Welches Geheimnis über die Zukunft würdest du gerne heute schon wissen?", "Was möchte man über seine Mitmenschen lieber niemals zu genau wissen?"],
      ["Wie sieht für dich der perfekte Ruhestand später einmal aus?", "Was stellt man sich romantisch vor, ist in der Realität aber anstrengend?"],
      ["Womit kann man dich in fünf Sekunden wieder aufmuntern?", "Womit bringt man dich in fünf Sekunden auf die Palme?"],
      ["Welchen Trend hast du früher begeistert mitgemacht?", "Welchen aktuellen Trend wirst du wahrscheinlich nie verstehen?"],
      ["Was würdest du ändern, wenn du für einen Tag Weltpräsident wärst?", "Worüber regen sich Menschen im Alltag viel zu unnötig auf?"],
      ["Welche Fähigkeit würdest du gerne über Nacht perfekt beherrschen?", "Was hast du schon dreimal angefangen zu lernen und wieder aufgehört?"],
      ["Was macht für dich eine richtig gute Freundschaft aus?", "Woran merkt man sofort, dass jemand unehrlich ist?"],
      ["Welches Risiko hat sich in deinem Leben am meisten gelohnt?", "Welche Entscheidung würdest du rückblickend heute anders treffen?"],
      ["Was würdest du tun, wenn du ab morgen nie wieder arbeiten müsstest?", "Was wird im Urlaub nach spätestens einer Woche langweilig?"],
      ["Welche Gewohnheit hat dein Leben spürbar verbessert?", "Welche kleine schlechte Angewohnheit wirst du einfach nicht los?"],
      ["Wofür bist du im Alltag am meisten dankbar?", "Was nimmt man im Alltag viel zu oft als selbstverständlich hin?"],
      ["Welches Erlebnis hat deine Sicht auf die Welt verändert?", "Welcher Ratschlag aus dem Internet funktioniert in der Praxis fast nie?"],
      ["Worüber kannst du immer wieder herzlich lachen?", "Worüber sollte man lieber keine Witze machen?"],
      ["Was ist für dich der größte Luxus im hektischen Alltag?", "Was raubt dir unter der Woche am meisten Energie?"],
      ["Welchen Traum möchtest du dir in den nächsten 5 Jahren erfüllen?", "Welchen Kindheitstraum hast du inzwischen komplett abgehakt?"],
      ["Welche Fähigkeit von Tieren hättest du als Mensch am liebsten?", "Welche Eigenschaft von Tieren wäre im menschlichen Alltag extrem unpraktisch?"],
      ["Worüber hast du dir früher viel zu viele Sorgen gemacht?", "Worüber machen sich Menschen heute deiner Meinung nach zu wenig Gedanken?"],
      ["Welches Schulfach sollte man heute dringend neu einführen?", "Welches Thema aus der Schulzeit hast du im echten Leben noch nie gebraucht?"],
      ["Was würdest du tun, wenn das Internet weltweit für eine Woche ausfällt?", "Was vermisst man schon nach zehn Minuten Stromausfall am meisten?"],
      ["Welche kleine Aufmerksamkeit im Alltag freut dich am meisten?", "Welche gut gemeinte Frage von Bekannten nervt auf Dauer?"],
      ["Welches Talent würdest du gerne gegen eines deiner eigenen tauschen?", "Welches Talent wird in Castingshows völlig überbewertet?"],
      ["Was ist für dich das wichtigste Kriterium bei einer großen Lebensentscheidung?", "Worauf hört man oft zu sehr, obwohl es eigentlich unwichtig ist?"],
      ["Welche historische Erfindung hättest du gerne selbst gemacht?", "Welche Erfindung hat die Welt zwar verändert, sorgt aber täglich für Hektik?"],
      ["Was würdest du auf eine einsame Insel als Unterhaltung mitnehmen?", "Was würde dir auf einer einsamen Insel schon am zweiten Tag auf die Nerven gehen?"],
      ["Welches ungeschriebene Gesetz im Freundeskreis ist dir besonders heilig?", "Welche Ausrede bei kurzfristigen Absagen benutzt fast jeder mal?"],
      ["Würdest du lieber fliegen oder unsichtbar sein können – und warum?", "Welche Superkraft wäre im Büro oder in der Schule am nützlichsten?"],
      ["Was würdest du mit einer Woche Extra-Urlaub machen?", "Was würdest du tun, wenn morgen überraschend ein Feiertag wäre?"],
      ["Welche Regel aus deiner Kindheit fandest du unfair?", "Welche Regel würdest du deinen eigenen Kindern auch aufstellen?"],
      ["Welchen Fehler würdest du nie wieder machen?", "Welchen Fehler machen gefühlt alle in deinem Alter?"],
      ["Was ist das Mutigste, das du je gegessen hast?", "Was würdest du niemals essen, egal für wie viel Geld?"],
      ["Was würdest du mit 10.000 € sofort machen?", "Wofür würdest du niemals 10.000 € ausgeben?"],
      ["Wofür würdest du um 5 Uhr morgens aufstehen?", "Wofür würdest du die ganze Nacht wach bleiben?"],
      ["Welche Notlüge war im Nachhinein die beste Idee?", "Welche Ausrede hast du schon mal komplett übertrieben?"],
      ["Was würdest du an deinem Leben nie ändern?", "Was würdest du an deinem Alltag sofort ändern?"],
      ["Welchen Beruf würdest du gerne einen Tag lang ausprobieren?", "Welchen Beruf unterschätzen die meisten Menschen?"],
      ["Wem würdest du gerne einmal richtig Danke sagen?", "Wem schuldest du eigentlich noch eine Entschuldigung?"],
      ["Was ist das Beste, das dir dieses Jahr passiert ist?", "Was hat dich dieses Jahr am meisten überrascht?"],
      ["Was würdest du in eine Zeitkapsel für in 20 Jahren legen?", "Was würdest du aus deiner Vergangenheit am liebsten verschwinden lassen?"],
      ["Welche Fähigkeit sollte jeder Mensch lernen?", "Welche Fähigkeit wird in der Schule viel zu wenig beigebracht?"],
      ["Worauf könntest du einen Monat lang problemlos verzichten?", "Worauf könntest du keinen einzigen Tag verzichten?"]
    ]
  }
];
