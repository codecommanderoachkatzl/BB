const markets = [
  {
    "name": "Burgadvent auf Aggstein",
    "place": "Burgruine Aggstein",
    "region": "Wachau",
    "start": "2026-11-06",
    "end": "2026-11-08",
    "url": "https://ruineaggstein.at/veranstaltungen/burgadvent",
    "note": "Fr 14–20 Uhr, Sa und So 10–20 Uhr. Schmiede und Glasbläser zeigen ihr Handwerk im Burghof."
  },
  {
    "name": "Burgadvent auf Aggstein",
    "place": "Burgruine Aggstein",
    "region": "Wachau",
    "start": "2026-11-13",
    "end": "2026-11-15",
    "url": "https://ruineaggstein.at/veranstaltungen/burgadvent",
    "note": "Fr 14–20 Uhr, Sa und So 10–20 Uhr. Schmiede und Glasbläser zeigen ihr Handwerk im Burghof."
  },
  {
    "name": "Weihnachtsmarkt auf Burg Clam",
    "place": "Klam · Burg Clam",
    "region": "Mühlviertel",
    "start": "2026-11-14",
    "end": "2026-11-15",
    "url": "https://events.eventjet.at/e/mittelalterlicher-weihnachtsmarkt-burg-clam-2/",
    "note": "Mittelalterlicher Markt im Burghof. Sa 11–20 Uhr, So 11–19 Uhr."
  },
  {
    "name": "Burgadvent auf Aggstein",
    "place": "Burgruine Aggstein",
    "region": "Wachau",
    "start": "2026-11-20",
    "end": "2026-11-22",
    "url": "https://ruineaggstein.at/veranstaltungen/burgadvent",
    "note": "Fr 14–20 Uhr, Sa und So 10–20 Uhr. Schmiede und Glasbläser zeigen ihr Handwerk im Burghof."
  },
  {
    "name": "Adventmarkt im Schloss Rosenau",
    "place": "Schloss Rosenau bei Zwettl",
    "region": "Waldviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.waldviertel.at/veranstaltungen/adventmarkt-im-schloss-rosenau",
    "note": "Sa 12–19 Uhr, So 11–18 Uhr. Kunsthandwerk im Schloss und beim Meierhofheurigen, Konzerte in der Pfarrkirche."
  },
  {
    "name": "Adventmarkt im Schloss Schwarzenau",
    "place": "Schwarzenau · Schloss",
    "region": "Waldviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.waldviertel.at/veranstaltungen/adventmarkt-im-schloss-schwarzenau",
    "note": "Sa 10–19 Uhr, So 10–17 Uhr. Im Schlosshof spielen Bläserensembles, im Schloss gibt es hausgemachte Mehlspeisen."
  },
  {
    "name": "Adventausstellung auf Burg Kreuzen",
    "place": "Bad Kreuzen · Burg Kreuzen",
    "region": "Mühlviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.bad-kreuzen.at/Adventausstellung_auf_Burg_Kreuzen_1",
    "note": "Vom Gewölbekeller bis zum Turm zeigen regionale Künstler Krippen, Keramik und Christbaumschmuck."
  },
  {
    "name": "Mauthausner Adventmarkt",
    "place": "Mauthausen · Heindlkai",
    "region": "Mühlviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://mauthausen.at/Mauthausner_Adventmarkt_4",
    "note": "Ab 14 Uhr am Heindlkai, im Schloss Pragstein und beim Betreubaren Wohnen."
  },
  {
    "name": "Adventmarkt Allerheiligen",
    "place": "Allerheiligen im Mühlkreis",
    "region": "Mühlviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.allerheiligen.ooe.gv.at/ADVENTMARKT_ALLERHEILIGEN_2",
    "note": "Adventwochenende mit Ausstellung und regionaler Kulinarik."
  },
  {
    "name": "Adventmarkt in der Käsemacherwelt",
    "place": "Heidenreichstein · Käsemacherwelt",
    "region": "Waldviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.waldviertel.at/veranstaltungen/adventmarkt-in-der-kaesemacherwelt-1",
    "note": "10–18 Uhr. Neben Kunsthandwerk und Käse gibt es für Kinder eine Wichtelwerkstatt."
  },
  {
    "name": "Schremser Advent",
    "place": "Schrems · Hauptplatz",
    "region": "Waldviertel",
    "start": "2026-11-21",
    "end": "2026-11-22",
    "url": "https://www.waldviertel.at/veranstaltungen/schremser-advent-auch-im-kunstmuseum-im-idea-shop",
    "note": "Markt am Hauptplatz 13–19 Uhr. Die Weihnachtsausstellung im IDEA-Shop öffnet bereits um 10 Uhr."
  },
  {
    "name": "Adventmarkt der Produktionsschule",
    "place": "Perg · Herrenstraße 17",
    "region": "Mühlviertel",
    "start": "2026-11-24",
    "end": "2026-11-25",
    "url": "https://www.perg.at/events/advent-markt-produktionsschule/",
    "note": "Jeweils 9–12 und 13–16 Uhr. In der 17er Garage gibt es winterliche Werkstücke aus der Produktionsschule."
  },
  {
    "name": "Schwertberger Christkindlmarkt",
    "place": "Schwertberg · Marktplatz",
    "region": "Mühlviertel",
    "start": "2026-11-27",
    "end": "2026-11-29",
    "url": "https://www.schwertberg.at/Christkindlmarkt_2026_Jetzt_als_Aussteller_anmelden_1",
    "note": "Fr 17–22 Uhr, Sa 14–22 Uhr, So 14–18 Uhr. Am Marktplatz und im Gemeindeamt."
  },
  {
    "name": "Adventmarkt Kirchbach",
    "place": "Kirchbach bei Rappottenstein",
    "region": "Waldviertel",
    "start": "2026-11-28",
    "end": "2026-11-29",
    "url": "https://www.rappottenstein.gv.at/Adventmarkt_Kirchbach",
    "note": "Marktstände am Kirchbacher Marktplatz und eine Ausstellung im Pfarrsaal."
  },
  {
    "name": "Naarner Advent",
    "place": "Naarn im Machlande · Pfarrplatz",
    "region": "Mühlviertel",
    "start": "2026-11-28",
    "end": "2026-11-29",
    "url": "https://www.naarn.at/Naarner_Advent",
    "note": "Sa 15–22 Uhr, So 10–18 Uhr. Der Markt erstreckt sich vom Ortsplatz bis ins Pfarrheim."
  },
  {
    "name": "Pergkirchner Adventzauber",
    "place": "Pergkirchen · Ortsplatz",
    "region": "Mühlviertel",
    "start": "2026-11-28",
    "end": "2026-11-28",
    "url": "https://perg.ooe-bv.at/termine/event/termin/pergkirchner-adventzauber",
    "note": "16–22 Uhr. Der Musikverein Pergkirchen lädt auf den Ortsplatz ein."
  },
  {
    "name": "Münzbacher Adventzauber",
    "place": "Münzbach",
    "region": "Mühlviertel",
    "start": "2026-11-28",
    "end": "2026-11-29",
    "url": "https://guideyourtime.at/themen/adventmaerkte/perg",
    "note": "Adventmarkt am ersten Adventwochenende in Münzbach."
  },
  {
    "name": "Perger Christkindlmarkt",
    "place": "Perg · Stadtpfarrkirche",
    "region": "Mühlviertel",
    "start": "2026-12-04",
    "end": "2026-12-06",
    "url": "https://www.stadtmarketing-perg.at/christkindlmarkt-perg/",
    "note": "Marktstände Fr 12–19 Uhr, Sa 11–19 Uhr, So 10.15–18 Uhr. Weitere Aussteller im Pfarrheim."
  },
  {
    "name": "Adventmarkt Bad Traunstein",
    "place": "Bad Traunstein · Marktplatz",
    "region": "Waldviertel",
    "start": "2026-12-04",
    "end": "2026-12-06",
    "url": "https://www.waldviertel.at/veranstaltungen/adventmarkt-bad-traunstein",
    "note": "Fr ab 19 Uhr, Sa ab 14 Uhr, So ab 10 Uhr. Der Kirchenchor eröffnet den Markt am Freitagabend."
  },
  {
    "name": "Gmünder Adventmarkt",
    "place": "Gmünd · Stadtplatz",
    "region": "Waldviertel",
    "start": "2026-12-04",
    "end": "2026-12-06",
    "url": "https://www.waldviertel.at/veranstaltungen/gmuender-adventmarkt",
    "note": "Fr bis So ab 14 Uhr in der Fußgängerzone am Stadtplatz."
  },
  {
    "name": "Goldener Zwettler Advent",
    "place": "Zwettl · Innenstadt",
    "region": "Waldviertel",
    "start": "2026-12-05",
    "end": "2026-12-08",
    "url": "https://zwettl.gv.at/Goldener_Zwettler_Advent_2026",
    "note": "Sa und So 10–19 Uhr, Mo 14–19 Uhr, Di 10–18 Uhr. Hüttendörfer am Dreifaltigkeitsplatz, Sparkassenplatz und Hauptplatz."
  },
  {
    "name": "D’ Weihnocht im Woid",
    "place": "Pabneukirchen · Holzwelten",
    "region": "Mühlviertel",
    "start": "2026-12-05",
    "end": "2026-12-05",
    "url": "https://www.oberoesterreich.at/oesterreich-veranstaltung/detail/430241139/d-weihnocht-im-woid.html",
    "note": "13–22 Uhr. Auf der Waldlichtung treffen Handwerksstände, Bläsermusik und eine lebende Krippe zusammen."
  },
  {
    "name": "Mitterkirchner Adventzauber",
    "place": "Mitterkirchen im Machland",
    "region": "Mühlviertel",
    "start": "2026-12-05",
    "end": "2026-12-06",
    "url": "https://www.mitterkirchen.ooe.gv.at/Mitterkirchner_Adventzauber_5",
    "note": "Sa 13–18 Uhr, So 10–17.30 Uhr. Kunsthandwerk und Spezialitäten aus der Region."
  },
  {
    "name": "Waldhausener Advent",
    "place": "Waldhausen im Strudengau · Stift",
    "region": "Mühlviertel",
    "start": "2026-12-05",
    "end": "2026-12-06",
    "url": "https://www.waldhausen.at/Waldhausener_Advent_13",
    "note": "10–19 Uhr. Im Stift zeigen Glasbläser und Weber ihr Handwerk. Im Pavillon sind Krippen ausgestellt."
  },
  {
    "name": "Langschläger Dorfadvent",
    "place": "Langschlag · Marktplatz",
    "region": "Waldviertel",
    "start": "2026-12-05",
    "end": "2026-12-06",
    "url": "https://www.langschlag.at/Freizeit_Tourismus/Veranstaltungen/Veranstaltungskalender",
    "note": "Der Dorferneuerungsverein Lebendiges Langschlag lädt auf den Marktplatz ein."
  },
  {
    "name": "Adventmarkt Schweiggers",
    "place": "Schweiggers · Veranstaltungssaal",
    "region": "Waldviertel",
    "start": "2026-12-05",
    "end": "2026-12-06",
    "url": "https://www.schweiggers.gv.at/Adventmarkt",
    "note": "13–19 Uhr im Veranstaltungssaal, Gmünder Straße 2."
  },
  {
    "name": "Advent im Dorf",
    "place": "Kleinnondorf · Grafenschlag",
    "region": "Waldviertel",
    "start": "2026-12-05",
    "end": "2026-12-05",
    "url": "https://www.grafenschlag.at/Advent_im_Dorf",
    "note": "14–23 Uhr. Beim Indoor-Weihnachtsmarkt gibt es Holzschnitzereien, Christbäume und eine Bastelecke für Kinder."
  },
  {
    "name": "Waldhausener Advent",
    "place": "Waldhausen im Strudengau · Stift",
    "region": "Mühlviertel",
    "start": "2026-12-08",
    "end": "2026-12-08",
    "url": "https://www.waldhausen.at/Waldhausener_Advent_13",
    "note": "10–19 Uhr. Im Stift zeigen Glasbläser und Weber ihr Handwerk. Im Pavillon sind Krippen ausgestellt."
  },
  {
    "name": "Adventmarkt Schweiggers",
    "place": "Schweiggers · Veranstaltungssaal",
    "region": "Waldviertel",
    "start": "2026-12-08",
    "end": "2026-12-08",
    "url": "https://www.schweiggers.gv.at/Adventmarkt",
    "note": "13–19 Uhr im Veranstaltungssaal, Gmünder Straße 2."
  },
  {
    "name": "Greiner Adventmarkt",
    "place": "Grein · Stadtplatz",
    "region": "Mühlviertel",
    "start": "2026-12-11",
    "end": "2026-12-12",
    "url": "https://www.grein.ooe.gv.at/Greiner_Adventmarkt_2",
    "note": "Fr und Sa 14–20 Uhr am Stadtplatz."
  },
  {
    "name": "Advent im KoHo",
    "place": "Grein · KoHo Kunst und Keramik",
    "region": "Mühlviertel",
    "start": "2026-12-11",
    "end": "2026-12-12",
    "url": "https://www.grein.at/Adventmarkt_1",
    "note": "14–20 Uhr. Parallel zum Markt am Stadtplatz öffnet das KoHo seinen Hof und seine Räume."
  },
  {
    "name": "Adventmarkt Schweiggers",
    "place": "Schweiggers · Veranstaltungssaal",
    "region": "Waldviertel",
    "start": "2026-12-12",
    "end": "2026-12-13",
    "url": "https://www.schweiggers.gv.at/Adventmarkt",
    "note": "13–19 Uhr im Veranstaltungssaal, Gmünder Straße 2."
  },
  {
    "name": "Adventmarkt Altmelon",
    "place": "Altmelon bei Arbesbach",
    "region": "Waldviertel",
    "start": "2026-12-12",
    "end": "2026-12-13",
    "url": "https://nachrichten.jetzt/veranstaltung/adventmarkt-in-altmelon-2026-12-12/",
    "note": "Sa ab 14 Uhr, So ab 9 Uhr. Der Adventmarkt findet in Altmelon statt."
  },
  {
    "name": "Rieder Adventmarkt",
    "place": "Ried in der Riedmark · Marktplatz",
    "region": "Mühlviertel",
    "start": "2026-12-12",
    "end": "2026-12-13",
    "url": "https://www.ried-riedmark.at/Adventmarkt_2026_7",
    "note": "Kunsthandwerk und Kulinarik am Marktplatz in Ried."
  },
  {
    "name": "Weihnachtsjahrmarkt",
    "place": "Groß Gerungs · Hauptplatz",
    "region": "Waldviertel",
    "start": "2026-12-18",
    "end": "2026-12-18",
    "url": "https://www.waldviertel.at/veranstaltungen/weihnachtsjahrmarkt",
    "note": "7–12 Uhr. Am Freitag vor Weihnachten findet der traditionelle Jahrmarkt auf dem Hauptplatz statt."
  }
];
