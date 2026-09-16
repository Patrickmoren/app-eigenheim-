const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,
       ShadingType,AlignmentType,BorderStyle,PageBreak,Footer,PageNumber}=d;
const fs=require('fs');
const TOT=9020, KOPF="0F5C6E", TINT="EDF1F2", ZEBRA="F7F9F9",
      OK="2F6B45", WARN="8A5A0B", CRIT="A3312B";

const txt=(t,o={})=>new Paragraph({children:[new TextRun({text:t,size:21,...o})],
  spacing:{after:o.after!==undefined?o.after:130}});
const h1=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_1,spacing:{before:340,after:150}});
const h2=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_2,spacing:{before:260,after:110}});
const leer=(n=1)=>Array.from({length:n},()=>new Paragraph({children:[new TextRun("")],spacing:{after:0}}));

function zelle(t,{w,kopf=false,zebra=false,bold=false,farbe=null}={}){
  return new TableCell({width:{size:w,type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR,fill:kopf?KOPF:zebra?ZEBRA:"FFFFFF",color:"auto"},
    margins:{top:70,bottom:70,left:100,right:100},
    children:[new Paragraph({children:[new TextRun({text:String(t),bold:kopf||bold,size:18,
      color:kopf?"FFFFFF":(farbe||"1A1A1A")})],spacing:{after:0}})]});
}
function tabelle(kopfzeile,zeilen,breiten,farbspalte=null){
  const rows=[new TableRow({tableHeader:true,children:kopfzeile.map((t,i)=>zelle(t,{w:breiten[i],kopf:true}))})];
  zeilen.forEach((z,i)=>rows.push(new TableRow({children:z.map((t,j)=>{
    let farbe=null, bold=(j===0);
    if(farbspalte!==null && j===farbspalte){
      bold=true;
      if(/^(ja|vollständig)/i.test(String(t))) farbe=OK;
      else if(/^(teilweise|eingeschränkt)/i.test(String(t))) farbe=WARN;
      else if(/^(nein|entfällt)/i.test(String(t))) farbe=CRIT;
    }
    return zelle(t,{w:breiten[j],zebra:i%2===1,bold,farbe});
  })})));
  return new Table({columnWidths:breiten,width:{size:breiten.reduce((a,b)=>a+b,0),type:WidthType.DXA},rows,
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},bottom:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      left:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},right:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"},insideVertical:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"}}});
}
function kasten(titel,zeilen,rand=KOPF){
  return new Table({columnWidths:[TOT],width:{size:TOT,type:WidthType.DXA},
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:rand},bottom:{style:BorderStyle.SINGLE,size:4,color:rand},
      left:{style:BorderStyle.SINGLE,size:18,color:rand},right:{style:BorderStyle.SINGLE,size:4,color:rand},
      insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},
    rows:[new TableRow({children:[new TableCell({width:{size:TOT,type:WidthType.DXA},
      shading:{type:ShadingType.CLEAR,fill:TINT,color:"auto"},margins:{top:140,bottom:140,left:180,right:160},
      children:[new Paragraph({children:[new TextRun({text:titel,bold:true,size:19,color:"0B4655"})],spacing:{after:70}})]
        .concat(zeilen.map(t=>new Paragraph({children:[new TextRun({text:t,size:19})],spacing:{after:50}})))})]})]});
}

const k=[]; const push=(...x)=>x.forEach(e=>k.push(e));

push(new Paragraph({children:[new TextRun({text:"Leerstandsmanager",bold:true,size:48,color:KOPF})],spacing:{after:60}}));
push(new Paragraph({children:[new TextRun({text:"Machbarkeitsprüfung Power Apps",size:30,color:"5A6B76"})],spacing:{after:240}}));
push(new Paragraph({children:[new TextRun({text:"Fassung vom 16. September 2026 · Entscheidungsgrundlage",size:19,color:"85939C"})],
  spacing:{after:320},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"C6D0D5",space:8}}}));

push(kasten("Fragestellung",[
  "Lässt sich der Prototyp auf Microsoft Power Apps über SharePoint-Listen abbilden – also innerhalb der bestehenden Microsoft-365-Umgebung und ohne eigene Serverinfrastruktur?",
  "Geprüft wird, was erhalten bleibt, was eingeschränkt ist, was wegfällt, was es kostet und wie lange es dauert."]));
push(...leer());

push(kasten("Ergebnis vorweg",[
  "Machbar. Rund vier Fünftel des Verhaltens lassen sich abbilden, die fachlich wichtigen Regeln vollständig.",
  "Der Aufwand liegt bei etwa 27 bis 38 Personentagen – nicht bei zwei Nachmittagen Konfiguration.",
  "Der eigentliche Preis ist nicht der Aufbau, sondern die Wartbarkeit: Die Logik liegt in Formeln innerhalb der App und lässt sich schlecht prüfen, versionieren und übergeben.",
  "Empfehlung am Schluss in Abschnitt 10."],KOPF));
push(...leer());

/* 1 */
push(h1("1. Wie der Aufbau aussähe"));
push(txt("Power Apps ist keine Datenbank, sondern eine Oberfläche. Die Daten lägen in SharePoint-Listen, die Logik in der App, die Erinnerungen in Power Automate. Drei Bausteine:"));
push(tabelle(["Baustein","Rolle","Inhalt"],[
  ["SharePoint-Listen","Speicher","Fälle, Prozessschritte, Protokoll, Stammdaten, Benutzer und Teams"],
  ["Power Apps (Canvas App)","Oberfläche und Logik","Bildschirme, abgeleitete Werte, Fristen, Regeln, Rechte"],
  ["Power Automate","Zeitgesteuertes","Tägliche Prüfung der Fristen, E-Mail-Erinnerungen"]
],[2400,2000,4620]));
push(txt("Alle drei sind in den gängigen Microsoft-365-Plänen enthalten, solange nur Standardverbindungen verwendet werden – siehe Abschnitt 8.",{after:200}));

/* 2 */
push(h1("2. Datenmodell in SharePoint"));
push(txt("Entscheidend ist, wie die zwanzig Prozessschritte je Fall abgelegt werden. Es gibt zwei Wege, und die Wahl bestimmt fast alles Weitere."));
push(tabelle(["Weg","Aufbau","Folge"],[
  ["A · Spalten","20 Ja/Nein-Spalten je Fall, wie im heutigen Excel","Einfach, aber ohne Datum und Benutzer je Schritt – die Historie und die Durchlaufzeiten fallen weg. Damit wäre der Hauptgewinn verloren."],
  ["B · eigene Liste","Eine Liste «Prozessschritte» mit einer Zeile je Schritt und Fall","Datum, Benutzer, Zustand und Frist je Schritt. Entspricht dem Konzept – aber rund zwanzigmal so viele Zeilen."]
],[1700,2900,4420]));
push(txt("Weg B ist fachlich richtig und wird hier vorausgesetzt. Bei 150 Fällen pro Jahr entstehen rund 3 000 Schrittzeilen jährlich. Das ist für SharePoint unproblematisch, aber es hat Folgen für die Abfragen (Abschnitt 6)."));
push(...leer());
push(tabelle(["Liste","Zeilen je Jahr (geschätzt)","Zweck"],[
  ["Fälle","ca. 150","Ein Eintrag je Mieterwechsel"],
  ["Prozessschritte","ca. 3 000","Ein Eintrag je Schritt und Fall, mit Zustand, Datum, Benutzer, Frist"],
  ["Protokoll","ca. 4 000","Nachweis jeder Änderung"],
  ["Teams / Benutzer","ca. 15","Zuordnung Bewirtschafter zu BS 01 und BS 02"],
  ["Objekte (gespiegelt)","Bestand","Aus Garaio REM übernommen, nur lesend"]
],[2200,2400,4420]));

push(new Paragraph({children:[new PageBreak()]}));

/* 3 */
push(h1("3. Bildschirm für Bildschirm"));
push(txt("Bewertung: «vollständig» heisst gleichwertig, «eingeschränkt» heisst fachlich vorhanden, aber umständlicher oder weniger übersichtlich."));
push(tabelle(["Aus dem Prototyp","In Power Apps","Bewertung"],[
  ["Dashboard mit Kennzahlen","Bildschirm mit Beschriftungen über berechnete Sammlungen","vollständig"],
  ["Aufgabenliste nach Dringlichkeit","Katalog (Gallery) mit sortierter Sammlung","vollständig"],
  ["Arbeitsbereiche mit Zählern","Schaltflächen mit gefilterten Sammlungen","vollständig"],
  ["Fallliste mit Suche und Filtern","Katalog mit Suchfeld und Auswahlfeldern","vollständig"],
  ["Phasenbalken je Fall","Fünf Rechtecke, Farbe über Formel","vollständig"],
  ["Fallakte mit fünf Abschnitten","Bildschirm mit ein-/ausklappbaren Bereichen","eingeschränkt"],
  ["Schritte erledigen, «nicht nötig», rückgängig","Schaltflächen mit Patch auf die Schrittliste","vollständig"],
  ["Kasten «Nächster Schritt»","Formel über die offenen Schritte der aktuellen Phase","vollständig"],
  ["Durcharbeiten mit Fortschritt","Sammlung als Warteschlange, Index in einer Variablen","eingeschränkt"],
  ["Zurückstellen mit Datum","Spalte in der Fallliste, Filter in den Ansichten","vollständig"],
  ["Teamübersicht mit Einstieg je Mitarbeiter","Katalog über die Bewirtschafter, Navigation auf Detailbildschirm","vollständig"],
  ["Zuständigkeit übergeben","Auswahlfeld mit Patch und Protokolleintrag","vollständig"],
  ["Prüfungen und Warnungen","Formeln je Fall, Anzeige in einem Katalog","vollständig"],
  ["Auswertung mit Gruppierung je Team","Kataloge mit GroupBy, Balken als Rechtecke","eingeschränkt"],
  ["Export nach Excel","Katalogexport oder Flow, der eine Datei erzeugt","eingeschränkt"],
  ["Feldhilfe am Symbol","Sichtbarkeit über Variablen","vollständig"],
  ["Helles und dunkles Erscheinungsbild","entfällt","nein"],
  ["Bedienung am Telefon","Power-Apps-App oder Browser, eigenes Layout nötig","eingeschränkt"]
],[3100,3600,2320],2));

push(new Paragraph({children:[new PageBreak()]}));

/* 4 */
push(h1("4. Was vollständig erhalten bleibt"));
push(txt("Die fachlichen Regeln – also das, was den Wert ausmacht – lassen sich in Power Fx abbilden. Alle hier genannten Berechnungen sind reine Datumsarithmetik und Bedingungen:"));
push(tabelle(["Regel","Umsetzung"],[
  ["Leerstandstage ab dem Tag nach dem Haftungsdatum","DateDiff über die beiden Daten, minus eins bei abgeschlossenen Fällen"],
  ["Vorlauftage und Berichtsmonat","DateDiff beziehungsweise DateAdd und Text auf dem Leerstandsbeginn"],
  ["Sollfrist 30 Tage vor der Wohnungsabgabe","DateAdd auf dem Haftungsdatum"],
  ["Handwerkerfrist 3 Tage nach der Abnahme","DateAdd auf dem Erledigungsdatum des Abnahmeschritts"],
  ["Phase aus den erledigten Schritten ableiten","Bedingung über die Schrittliste des Falls"],
  ["Abschluss erst bei vollständiger Schlussabrechnung","Schaltfläche nur aktiv, wenn alle Schritte der Phase erledigt sind"],
  ["Drei Zustände je Schritt","Auswahlspalte offen / erledigt / nicht erforderlich"],
  ["Datum und Benutzer beim Erledigen","Now() und User().FullName beim Patch"],
  ["Warnung bei zwei offenen Fällen je Objekt","Zählung über die Fallliste beim Anlegen"],
  ["Plausibilitätsprüfung der Daten","Bedingungen im Formular vor dem Speichern"],
  ["Teamrechte","Zuordnung aus der Teamliste, Schaltflächen entsprechend gesperrt"],
  ["Erinnerungen an Fristen","Täglicher Ablauf in Power Automate mit E-Mail"]
],[3400,5620]));

/* 5 */
push(h1("5. Was eingeschränkt ist"));
push(tabelle(["Punkt","Einschränkung"],[
  ["Dichte der Darstellung","Power Apps arbeitet mit absolut positionierten Elementen. Eine Fallakte mit fünf Abschnitten und zwanzig Schritten wird entweder sehr lang oder muss auf mehrere Bildschirme verteilt werden."],
  ["Ein- und Ausklappen","Möglich, aber jede Sichtbarkeit und jede Verschiebung muss von Hand formuliert werden. Was im Prototyp der Browser erledigt, wird hier Formelarbeit."],
  ["Durcharbeiten","Warteschlange und Fortschritt sind machbar. Das automatische Weiterspringen nach einer Handlung muss an jeder Schaltfläche einzeln ausformuliert werden."],
  ["Auswertung","Gruppierung und Summen gehen. Diagramme sind entweder die eingebauten, schlichten Steuerelemente oder von Hand aus Rechtecken gebaut."],
  ["Export","Kein Knopf wie im Browser. Entweder Katalogexport nach CSV oder ein Ablauf, der eine Datei in SharePoint ablegt."],
  ["Telefon","Ein zweites Layout ist nötig. Für die Abnahme vor Ort empfiehlt sich ein eigener, reduzierter Bildschirm."]
],[2400,6620]));

/* 6 */
push(h1("6. Technische Fallstricke"));
push(tabelle(["Thema","Was zu beachten ist"],[
  ["Abfragegrenze","SharePoint liefert an Power Apps standardmässig 500 Zeilen, einstellbar bis 2 000. Komplexe Filter werden nicht an SharePoint weitergereicht, sondern erst in der App ausgewertet – dann greift die Grenze. Abhilfe: nur offene Fälle laden und die Schrittliste je Fall nachladen."],
  ["Verknüpfung der Listen","SharePoint kennt keine echten Beziehungen. Die Zuordnung Schritt zu Fall erfolgt über eine Nachschlagespalte; Löschweitergaben und Konsistenz sind selbst sicherzustellen."],
  ["Gleichzeitiges Arbeiten","Zwei Personen am selben Fall überschreiben sich gegenseitig ohne Warnung, wenn nichts dagegen unternommen wird. Im Prototyp stellt sich die Frage nicht, hier schon."],
  ["Startzeit","Eine Canvas App mit mehreren Listen braucht beim Start spürbar Zeit, besonders beim ersten Aufruf am Tag."],
  ["Versionierung","Eine Canvas App ist eine einzelne Datei. Änderungen lassen sich nicht wie Programmtext vergleichen; Prüfungen im Vier-Augen-Prinzip sind kaum möglich."]
],[2200,6820]));

push(new Paragraph({children:[new PageBreak()]}));

/* 7 */
push(h1("7. Aufwand"));
push(txt("Schätzung für eine Person mit Power-Apps-Erfahrung, inklusive Abstimmung und Test, ohne Datenübernahme aus dem bestehenden Excel."));
push(tabelle(["Arbeitspaket","Personentage"],[
  ["Listen, Spalten, Ansichten, Berechtigungen","2 – 3"],
  ["Grundgerüst der App: Navigation, Fallliste, Fallakte","5 – 8"],
  ["Fachliche Logik: Phasen, nächster Schritt, Fristen, Abschlussregel","5 – 8"],
  ["Durcharbeiten und Zurückstellen","2 – 3"],
  ["Teamsichten, Rechte, Zuständigkeit übergeben","3 – 5"],
  ["Auswertung und Export","3 – 4"],
  ["Abläufe für Erinnerungen","2"],
  ["Test, Übernahme der laufenden Fälle, Einführung","5"],
  ["Gesamt","27 – 38"]
],[6200,2820]));
push(txt("Das entspricht rund sechs bis acht Wochen Vollzeit, bei Teilzeit entsprechend länger. Zum Vergleich: Eine eigene Web-Applikation im selben Umfang liegt erfahrungsgemäss in derselben Grössenordnung – der Unterschied liegt nicht im Aufbau, sondern im Betrieb und in der Wartbarkeit.",{after:200}));

/* 8 */
push(h1("8. Lizenzen"));
push(tabelle(["Frage","Antwort"],[
  ["Reicht unsere bestehende Lizenz?","Vermutlich ja. Canvas Apps mit Standardverbindungen – SharePoint, Outlook, Office 365 – sind in den gängigen Microsoft-365-Plänen enthalten."],
  ["Wann wird es kostenpflichtig?","Sobald Dataverse oder sogenannte Premium-Verbindungen verwendet werden, etwa für eine direkte Anbindung an Garaio REM. Dann fällt eine Lizenz je Benutzer und Monat an."],
  ["Lässt sich das vermeiden?","Ja, solange nur SharePoint als Speicher dient. Die Anbindung an Garaio REM wäre der Punkt, an dem die Frage neu zu stellen ist."],
  ["Was ist zu prüfen?","Ob euer Mandant das Erstellen von Apps überhaupt zulässt. Das sieht man in wenigen Minuten, indem jemand versucht, eine leere App anzulegen."]
],[2600,6420]));
push(...leer());
push(kasten("Diese Angaben sind vor einer Umsetzung zu bestätigen",[
  "Microsoft ändert Lizenzbedingungen regelmässig. Die obigen Aussagen entsprechen meinem Kenntnisstand, ersetzen aber keine Prüfung anhand eurer konkreten Vertragsunterlagen.",
  "Ebenso ungeprüft ist, ob euer Mandant Power Platform eingeschränkt hat – das ist eine Einstellung, die viele Organisationen setzen."],WARN));

/* 9 */
push(h1("9. Risiken"));
push(tabelle(["Risiko","Auswirkung","Abhilfe"],[
  ["Mandant sperrt Power Platform","Der ganze Weg entfällt","Vorab prüfen, bevor Aufwand entsteht"],
  ["Wartbarkeit","Wer die App gebaut hat, wird zur einzigen Person, die sie ändern kann","Von Beginn an dokumentieren; Formeln sparsam und benannt halten"],
  ["Abfragegrenzen bei wachsendem Bestand","Unvollständige Listen ohne sichtbare Warnung","Nur offene Fälle laden, Abgeschlossene archivieren"],
  ["Lizenzänderung durch Microsoft","Nachträgliche Kosten je Benutzer","Auf Standardverbindungen beschränken"],
  ["Schleichende Ausweitung","Aus dem Pendenzenwerkzeug wird doch eine zweite Datenhaltung","Abgrenzung zu Garaio REM schriftlich festhalten – siehe Prozessbeschreibung"]
],[2600,3200,3220]));

/* 10 */
push(h1("10. Empfehlung"));
push(txt("Power Apps trägt diese Anwendung fachlich. Die Regeln, auf die es ankommt – Fristen aus dem Haftungsdatum, der nächste Schritt, die Abschlusssperre, die Teamsichten – lassen sich vollständig abbilden. Was leidet, ist die Übersichtlichkeit der Fallakte und die Wartbarkeit auf Jahre."));
push(...leer());
push(tabelle(["Wenn …","dann"],[
  ["… eine eigene Web-Applikation betrieben werden darf","diesen Weg gehen. Gleicher Aufbauaufwand, bessere Oberfläche, prüfbarer Programmtext, kein Lizenzrisiko."],
  ["… das nicht in Frage kommt","Power Apps. Es ist die einzige Variante, die die Führung durch den Prozess erhält und ohne eigene Infrastruktur auskommt."],
  ["… vorerst gar nichts entschieden wird","Nicht die SharePoint-Liste allein aufsetzen. Sie behebt die technischen Mängel des Excels, nicht den eigentlichen: dass eine Checkliste als Tabelle geführt wird."]
],[3000,6020]));
push(...leer());
push(kasten("Nächster Schritt, unabhängig von der Entscheidung",[
  "Eine Frage klären: Darf bei euch eine eigene Web-Applikation betrieben werden – und ist sie von unterwegs erreichbar, für die Abnahme vor Ort?",
  "Die Antwort entscheidet zwischen den beiden Wegen. Alles Weitere – Prototyp, Prozessbeschreibung, Bedienungsanleitung – gilt für beide und bleibt verwendbar."],KOPF));

const doc=new Document({
  creator:"Schäppi Grundstücke", title:"Machbarkeitsprüfung Power Apps",
  description:"Prüfung, ob der Leerstandsmanager auf Power Apps über SharePoint abbildbar ist",
  styles:{default:{
    document:{run:{font:"Calibri",size:21,color:"1A1A1A"},paragraph:{spacing:{line:290,after:130}}},
    heading1:{run:{font:"Calibri",size:30,bold:true,color:KOPF},paragraph:{spacing:{before:340,after:150}}},
    heading2:{run:{font:"Calibri",size:24,bold:true,color:"0B4655"},paragraph:{spacing:{before:260,after:110}}}}},
  sections:[{properties:{page:{margin:{top:1200,right:1440,bottom:1200,left:1440}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,
      children:[new TextRun({text:"Machbarkeitsprüfung Power Apps · Seite ",size:16,color:"85939C"}),
        new TextRun({children:[PageNumber.CURRENT],size:16,color:"85939C"})]})]})},
    children:k}]
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Machbarkeitspruefung-PowerApps.docx",b);
  console.log("erstellt:",Math.round(b.length/1024),"KB");});
