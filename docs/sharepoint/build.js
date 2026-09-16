const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,
       ShadingType,AlignmentType,BorderStyle,PageBreak,Footer,PageNumber}=d;
const fs=require('fs');
const TOT=9020, KOPF="0F5C6E", TINT="EDF1F2", ZEBRA="F7F9F9", WARN="8A5A0B";

const txt=(t,o={})=>new Paragraph({children:[new TextRun({text:t,size:21,...o})],
  spacing:{after:o.after!==undefined?o.after:130}});
const h1=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_1,spacing:{before:340,after:150}});
const h2=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_2,spacing:{before:260,after:110}});
const leer=(n=1)=>Array.from({length:n},()=>new Paragraph({children:[new TextRun("")],spacing:{after:0}}));
const schritte=l=>l.map((t,i)=>new Paragraph({
  children:[new TextRun({text:(i+1)+".  ",bold:true,size:21,color:KOPF}),new TextRun({text:t,size:21})],
  spacing:{after:70},indent:{left:300,hanging:300}}));

function zelle(t,{w,kopf=false,zebra=false,bold=false,mono=false}={}){
  return new TableCell({width:{size:w,type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR,fill:kopf?KOPF:zebra?ZEBRA:"FFFFFF",color:"auto"},
    margins:{top:60,bottom:60,left:100,right:100},
    children:[new Paragraph({children:[new TextRun({text:String(t),bold:kopf||bold,
      size:mono?16:17, font:mono?"Consolas":undefined,
      color:kopf?"FFFFFF":"1A1A1A"})],spacing:{after:0}})]});
}
function tabelle(kopfzeile,zeilen,breiten,monoSpalten=[]){
  const rows=[new TableRow({tableHeader:true,children:kopfzeile.map((t,i)=>zelle(t,{w:breiten[i],kopf:true}))})];
  zeilen.forEach((z,i)=>rows.push(new TableRow({children:z.map((t,j)=>
    zelle(t,{w:breiten[j],zebra:i%2===1,mono:monoSpalten.indexOf(j)>=0,bold:(j===0&&monoSpalten.indexOf(0)<0)}))})));
  return new Table({columnWidths:breiten,width:{size:breiten.reduce((a,b)=>a+b,0),type:WidthType.DXA},rows,
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},bottom:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      left:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},right:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"},insideVertical:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"}}});
}
function code(zeilen){
  return new Table({columnWidths:[TOT],width:{size:TOT,type:WidthType.DXA},
    borders:{top:{style:BorderStyle.SINGLE,size:2,color:"C6D0D5"},bottom:{style:BorderStyle.SINGLE,size:2,color:"C6D0D5"},
      left:{style:BorderStyle.SINGLE,size:12,color:"C6D0D5"},right:{style:BorderStyle.SINGLE,size:2,color:"C6D0D5"},
      insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},
    rows:[new TableRow({children:[new TableCell({width:{size:TOT,type:WidthType.DXA},
      shading:{type:ShadingType.CLEAR,fill:"F7F9F9",color:"auto"},margins:{top:110,bottom:110,left:140,right:120},
      children:zeilen.map(t=>new Paragraph({children:[new TextRun({text:t,size:16,font:"Consolas"})],spacing:{after:20}}))})]})]});
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
push(new Paragraph({children:[new TextRun({text:"Aufbauanleitung SharePoint-Liste",size:30,color:"5A6B76"})],spacing:{after:240}}));
push(new Paragraph({children:[new TextRun({text:"Fassung vom 16. September 2026 · Arbeitsanleitung",size:19,color:"85939C"})],
  spacing:{after:320},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"C6D0D5",space:8}}}));

push(kasten("Was am Ende dasteht",[
  "Eine SharePoint-Liste, auf die alle neun Bewirtschafter gleichzeitig zugreifen – ein gemeinsamer Bestand, nicht neun Kopien.",
  "Jeder Prozessschritt wird mit Datum festgehalten statt mit «Ja». Wer ihn gesetzt hat, steht im Versionsverlauf.",
  "Fristen werden aus dem Haftungsdatum berechnet. Überfällige Fälle färben sich rot und erscheinen in einer eigenen Ansicht.",
  "Neun vorbereitete Ansichten, je nach Aufgabe: meine Fälle, überfällig, die drei Arbeitsbereiche, die zwei Teams, zurückgestellt, abgeschlossen.",
  "Eine tägliche E-Mail an jeden Bewirtschafter mit seinen überfälligen und bald fälligen Punkten.",
  "Aufwand: zwei bis drei Tage. Ohne IT umsetzbar, wenn ihr eine SharePoint-Website besitzt."]));
push(...leer());

push(kasten("Was diese Lösung nicht leistet",[
  "Sie führt nicht durch den Prozess. Es gibt keinen Kasten «Nächster Schritt» und kein Durcharbeiten am Stapel – die Liste zeigt Zeilen, der Bewirtschafter entscheidet selbst.",
  "Sie hindert niemanden daran, einen Fall mit offener Schlussabrechnung abzuschliessen.",
  "Die Phase wird aus sechs Meilensteinen abgeleitet, nicht aus allen zwanzig Schritten wie im Prototyp.",
  "Das ist bewusst so entschieden. Wer später mehr Führung will, kann auf derselben Liste eine Power App aufsetzen, ohne die Daten neu aufzubauen."],WARN));

/* 1 */
push(h1("1. Voraussetzungen"));
push(tabelle(["Was","Anmerkung"],[
  ["Eine SharePoint-Website, auf der ihr Besitzer seid","Meist die Team-Website der Bewirtschaftung. Ohne Besitzerrechte lassen sich keine Listen anlegen."],
  ["Zugriff für alle neun Bewirtschafter","Mitglied der Website genügt; Beitragsrechte auf der Liste."],
  ["Power Automate","Für die tägliche Fristenprüfung. In den gängigen Microsoft-365-Plänen enthalten."]
],[3400,5620]));

/* 2 */
push(h1("2. Liste anlegen"));
push(...schritte([
  "Auf der Website: Neu → Liste → Leere Liste.",
  "Name: Leerstände. Beschreibung: Pendenzen zu Mieterwechseln. Datenführung bleibt in Garaio REM.",
  "Nicht in der Websitenavigation anzeigen, wenn die Website noch andere Zwecke hat.",
  "Nach dem Anlegen: Einstellungen → Listeneinstellungen → Versionsverlauf aktivieren. Das ist der Nachweis, wer wann was geändert hat – ohne ihn fehlt die Historie."]));
push(...leer());
push(kasten("Wichtig beim Anlegen der Spalten",[
  "SharePoint merkt sich den Namen, den eine Spalte beim Anlegen hat, als internen Namen – dauerhaft. Umlaute und Leerzeichen werden dabei in unleserliche Zeichenfolgen übersetzt, die später in Formeln und Formatierungen gebraucht werden.",
  "Deshalb: Spalte zuerst mit dem technischen Namen aus der linken Spalte anlegen, danach über die Spalteneinstellungen in den Anzeigenamen umbenennen. Das kostet zwei Klicks je Spalte und spart später viel Ärger."],WARN));

push(new Paragraph({children:[new PageBreak()]}));

/* 3 */
push(h1("3. Spalten"));
push(h2("3.1 Fall und Objekt"));
push(tabelle(["Anlegen als","Umbenennen in","Typ","Hinweis"],[
  ["Title","Fall-Nr.","Text","bereits vorhanden, nur umbenennen"],
  ["ObjNr","Obj.-Nr.","Text","aus Garaio REM"],
  ["Liegenschaft","Liegenschaft","Text","aus Garaio REM"],
  ["Stock","Stock","Text",""],
  ["Zimmer","Anz. Zimmer","Zahl","1 Dezimalstelle"],
  ["Eigentuemer","Eigentümer","Text",""],
  ["Dossier","Dossier","Hyperlink","Link ins Objektdossier"],
  ["Bewirtschafter","Bewirtschafter","Person","eine Person, Pflichtfeld"],
  ["Team","Team","Auswahl","BS 01, BS 02"]
],[1900,2400,1500,3220],[0]));

push(h2("3.2 Mieter und Daten"));
push(tabelle(["Anlegen als","Umbenennen in","Typ","Hinweis"],[
  ["ExMieter","ex-Mieter","Text","Pflichtfeld"],
  ["GekuendigtPer","gekündigt per","Datum","Pflichtfeld, nur Datum"],
  ["HaftungBis","Haftungsdatum","Datum","Pflichtfeld. Letzter Tag der Mieterhaftung"],
  ["MieterSeit","Mieter seit","Datum",""],
  ["NeuerMieter","neuer Mieter","Text",""],
  ["VermietetPer","Vermietet per","Datum",""],
  ["Notiz","Notiz","Mehrere Textzeilen","nur Text, kein Rich-Text"]
],[1900,2400,1500,3220],[0]));

push(h2("3.3 Termine"));
push(tabelle(["Anlegen als","Umbenennen in","Typ","Hinweis"],[
  ["WaTermin","WA-Termin","Datum","vereinbarter Abnahmetermin"],
  ["SchluesselTermin","Schlüsselübergabe-Termin","Datum",""],
  ["VertragFrist","Vertrag retour bis","Datum","optional im Einzelfall"]
],[1900,2400,1500,3220],[0]));

push(h2("3.4 Erledigte Schritte"));
push(txt("Alle als Typ Datum anlegen. Leer bedeutet offen. Damit ist gleichzeitig festgehalten, wann der Schritt erledigt wurde – genau das fehlt im heutigen Excel."));
push(tabelle(["Anlegen als","Umbenennen in","Excel-Spalte"],[
  ["E01KueBest","Kündigung bestätigt / G-Rem","L"],
  ["E02MeldWerke","Meldung Werke / EGT","M"],
  ["E03Vorbesicht","Vorbesichtigung","O"],
  ["E04Vmz","VMZ aktualisiert","P"],
  ["E05Inserat","Inserat online","Q"],
  ["E06Wa","Wohnungsabnahme durchgeführt","T"],
  ["E07Handwerker","Handwerker aufgeboten","S"],
  ["E08Zustimmung","Zustimmungserklärung","U"],
  ["E09Instandst","Instandstellungen beauftragt","V"],
  ["E10VertragVers","Vertrag versendet","X"],
  ["E11VertragRet","Vertrag retour","Y"],
  ["E12InfoWerke","Info Werke / EGT","AA"],
  ["E13Schluessel","Schlüsselübergabe erfolgt","AB"],
  ["E14Reinigung","Reinigung veranlasst","AC"],
  ["E15Namensschild","Namensschilder","AD"],
  ["E16Kaution","Kaution / G-Rem mutiert","AE"],
  ["E17Rg","Instandstellungs-RG","AF"],
  ["E18Sa","Schlussabrechnung","AG"],
  ["E19Zahlung","Zahlungseingang","AH"],
  ["Abgeschlossen","Fall abgeschlossen","AI"]
],[2200,4400,2420],[0]));

push(h2("3.5 Steuerung"));
push(tabelle(["Anlegen als","Umbenennen in","Typ","Hinweis"],[
  ["NichtNoetig","nicht erforderlich","Auswahl, Mehrfach","Auswahlwerte: die 19 Schrittnamen aus 3.4. Hält fest, dass ein Schritt bewusst entfällt – sonst bliebe er ewig «offen»"],
  ["ZurueckBis","zurückgestellt bis","Datum","Fall ruht bis zu diesem Tag"],
  ["Ueberfaellig","überfällig","Ja/Nein","wird vom Ablauf gesetzt, nicht von Hand"],
  ["Leerstandstage","Leerstandstage","Zahl","wird vom Ablauf gesetzt, 0 Dezimalstellen"]
],[1900,2400,1500,3220],[0]));

push(new Paragraph({children:[new PageBreak()]}));

/* 4 */
push(h1("4. Berechnete Spalten"));
push(txt("Typ «Berechnet». Die Formeln stehen unten zum Kopieren. Der Rückgabetyp ist jeweils angegeben."));
push(...leer());

push(h2("Leerstandsbeginn — Rückgabetyp Datum"));
push(txt("Der Leerstand beginnt am Tag nach dem Haftungsdatum.",{after:70}));
push(code(["=IF(ISBLANK([Haftungsdatum]),\"\",[Haftungsdatum]+1)"]));
push(...leer());

push(h2("Sollfrist Abnahmetermin — Rückgabetyp Datum"));
push(txt("30 Tage vor der Wohnungsabgabe muss der Abnahmetermin vereinbart sein.",{after:70}));
push(code(["=IF(ISBLANK([Haftungsdatum]),\"\",[Haftungsdatum]-30)"]));
push(...leer());

push(h2("Sollfrist Handwerker — Rückgabetyp Datum"));
push(txt("3 Tage nach der durchgeführten Abnahme. Vorher entsteht keine Frist.",{after:70}));
push(code(["=IF(ISBLANK([Wohnungsabnahme durchgeführt]),\"\",[Wohnungsabnahme durchgeführt]+3)"]));
push(...leer());

push(h2("Phase — Rückgabetyp Text"));
push(txt("Abgeleitet aus sechs Meilensteinen. Die Zahl am Anfang sorgt für die richtige Sortierung.",{after:70}));
push(code([
 "=IF(NOT(ISBLANK([Fall abgeschlossen])),\"6 · abgeschlossen\",",
 " IF(NOT(ISBLANK([Zahlungseingang])),\"5 · bereit zum Abschluss\",",
 " IF(NOT(ISBLANK([Kaution / G-Rem mutiert])),\"5 · Schlussabrechnung\",",
 " IF(NOT(ISBLANK([Vertrag retour])),\"4 · Übergabe\",",
 " IF(NOT(ISBLANK([Instandstellungen beauftragt])),\"3 · Neuvermietung\",",
 " IF(NOT(ISBLANK([Haftungsdatum])),\"2 · Abnahme & Vermarktung\",",
 " \"1 · Erfassung\"))))))"]));
push(...leer());

push(h2("Arbeitsbereich — Rückgabetyp Text"));
push(txt("Fasst die Phasen zu den drei Bereichen zusammen; Grundlage für drei der Ansichten.",{after:70}));
push(code([
 "=IF(LEFT([Phase],1)=\"6\",\"abgeschlossen\",",
 " IF(OR(LEFT([Phase],1)=\"1\",LEFT([Phase],1)=\"2\"),\"Kündigung & Abnahme\",",
 " IF(OR(LEFT([Phase],1)=\"3\",LEFT([Phase],1)=\"4\"),\"Wiedervermietung\",",
 " \"Schlussabrechnung\")))"]));
push(...leer());

push(h2("Berichtsmonat — Rückgabetyp Text"));
push(txt("Monat des Leerstandsbeginns, nicht des Haftungsdatums.",{after:70}));
push(code(["=IF(ISBLANK([Haftungsdatum]),\"\",TEXT([Haftungsdatum]+1,\"JJJJ-MM\"))"]));
push(...leer());

push(kasten("Zwei Hinweise zu den Formeln",[
  "Auf einer deutschsprachigen Website erwartet SharePoint teilweise deutsche Funktionsnamen: WENN statt IF, ISTLEER statt ISBLANK, NICHT statt NOT, ODER statt OR, LINKS statt LEFT. Meldet die Formel einen Syntaxfehler, ist das die erste Ursache, die zu prüfen ist.",
  "Berechnete Spalten dürfen HEUTE() nicht verwenden – SharePoint lässt das nicht zu. Deshalb werden Leerstandstage und das Kennzeichen «überfällig» vom täglichen Ablauf geschrieben und nicht berechnet (Abschnitt 6)."],WARN));

push(new Paragraph({children:[new PageBreak()]}));

/* 5 */
push(h1("5. Ansichten"));
push(txt("Die Liste hat rund vierzig Spalten – niemand sieht sie je alle. Die Ansichten sind der eigentliche Kern dieser Lösung: Jede zeigt sechs bis zehn Spalten für genau eine Aufgabe."));
push(tabelle(["Ansicht","Filter","Sortierung / Gruppierung"],[
  ["Meine offenen Fälle","Bewirtschafter ist gleich [Ich] UND Fall abgeschlossen ist leer","Haftungsdatum aufsteigend"],
  ["Überfällig","überfällig ist Ja UND Fall abgeschlossen ist leer","Haftungsdatum aufsteigend"],
  ["Kündigung & Abnahme","Arbeitsbereich ist «Kündigung & Abnahme»","gruppiert nach Bewirtschafter"],
  ["Wiedervermietung","Arbeitsbereich ist «Wiedervermietung»","gruppiert nach Bewirtschafter"],
  ["Schlussabrechnung","Arbeitsbereich ist «Schlussabrechnung»","gruppiert nach Bewirtschafter"],
  ["Team BS 01","Team ist BS 01 UND Fall abgeschlossen ist leer","gruppiert nach Bewirtschafter"],
  ["Team BS 02","Team ist BS 02 UND Fall abgeschlossen ist leer","gruppiert nach Bewirtschafter"],
  ["Zurückgestellt","zurückgestellt bis ist grösser oder gleich [Heute]","zurückgestellt bis aufsteigend"],
  ["Abgeschlossen","Fall abgeschlossen ist nicht leer","Fall abgeschlossen absteigend"]
],[2200,3700,3120]));
push(...leer());
push(txt("Spalten je Ansicht – ein Vorschlag, der auf einen Bildschirm passt:"));
push(tabelle(["Ansicht","Spalten"],[
  ["Meine offenen Fälle · Überfällig","Fall-Nr. · Obj.-Nr. · Liegenschaft · ex-Mieter · Phase · Haftungsdatum · Leerstandstage · WA-Termin"],
  ["Kündigung & Abnahme","Obj.-Nr. · Liegenschaft · ex-Mieter · Haftungsdatum · Sollfrist Abnahmetermin · WA-Termin · Wohnungsabnahme durchgeführt · Handwerker aufgeboten"],
  ["Wiedervermietung","Obj.-Nr. · Liegenschaft · neuer Mieter · Vertrag versendet · Vertrag retour · Vermietet per · Schlüsselübergabe-Termin · Kaution / G-Rem mutiert"],
  ["Schlussabrechnung","Obj.-Nr. · ex-Mieter · Instandstellungs-RG · Schlussabrechnung · Zahlungseingang · Fall abgeschlossen"],
  ["Team BS 01 / BS 02","Bewirtschafter · Obj.-Nr. · Liegenschaft · Phase · Haftungsdatum · Leerstandstage · überfällig"]
],[2600,6420]));
push(...leer());
push(kasten("Der Trick mit [Ich] und [Heute]",[
  "Ansichtsfilter dürfen [Ich] und [Heute] verwenden – anders als berechnete Spalten. Damit funktioniert «Meine offenen Fälle» für alle neun Personen mit einer einzigen Ansicht, und «Zurückgestellt» bleibt ohne Ablauf aktuell."]));

/* 6 */
push(h1("6. Farbliche Kennzeichnung"));
push(txt("Vier Dateien liegen im Ordner «formatierung» bei. Inhalt kopieren und in SharePoint einfügen."));
push(tabelle(["Datei","Wohin","Wirkung"],[
  ["zeilenformatierung.json","Ansicht → Aktuelle Ansicht formatieren → Zeilen","Abgeschlossene Fälle grün, überfällige rot, zurückgestellte grau"],
  ["spalte-phase.json","Spalte Phase → Spalte formatieren","Phase als farbige Plakette, dunkler je weiter fortgeschritten"],
  ["spalte-erledigt.json","auf jede der 19 Erledigt-Spalten","Zeigt «offen» oder ein Häkchen mit Datum"],
  ["spalte-termin.json","auf WA-Termin und Schlüsselübergabe-Termin","Verstrichene Termine rot"]
],[2600,3000,3420]));

push(new Paragraph({children:[new PageBreak()]}));

/* 7 */
push(h1("7. Abläufe in Power Automate"));
push(h2("7.1 Tägliche Fristenprüfung"));
push(txt("Setzt «überfällig» und «Leerstandstage». Ohne diesen Ablauf bleiben beide Spalten leer.",{after:70}));
push(...schritte([
  "Power Automate → Erstellen → Geplanter Cloud-Flow. Name: Leerstände – Fristen prüfen. Täglich, 06:00.",
  "Aktion «Elemente abrufen» auf die Liste Leerstände. Filterabfrage: Abgeschlossen eq null. Anzahl der Elemente: 2000.",
  "Innerhalb «Auf alle anwenden» eine Aktion «Element aktualisieren» einfügen.",
  "Leerstandstage berechnen: Differenz in Tagen zwischen dem Leerstandsbeginn und heute, negative Werte auf 0 setzen. Bei gesetztem «Vermietet per» stattdessen bis zum Tag davor rechnen.",
  "überfällig auf Ja setzen, wenn eine dieser Bedingungen zutrifft: WA-Termin liegt in der Vergangenheit und «Wohnungsabnahme durchgeführt» ist leer; oder Sollfrist Abnahmetermin ist überschritten und WA-Termin ist leer; oder Sollfrist Handwerker ist überschritten und «Handwerker aufgeboten» ist leer; oder Schlüsselübergabe-Termin liegt in der Vergangenheit und «Schlüsselübergabe erfolgt» ist leer. Sonst auf Nein.",
  "Fälle mit «zurückgestellt bis» in der Zukunft überspringen."]));
push(...leer());
push(h2("7.2 Tägliche Erinnerung"));
push(...schritte([
  "Zweiter geplanter Flow, täglich 07:00. Name: Leerstände – Erinnerung.",
  "Elemente abrufen mit Filterabfrage: Abgeschlossen eq null and Ueberfaellig eq 1.",
  "Nach Bewirtschafter gruppieren: über eine Liste der neun Personen laufen und je Person die zugehörigen Einträge filtern.",
  "E-Mail senden an die Person, Betreff «Leerstände – überfällige Punkte», im Text je Fall Obj.-Nr., Liegenschaft, Phase und den Grund der Überfälligkeit, dazu ein Link auf die Ansicht «Überfällig».",
  "Keine E-Mail senden, wenn die Person nichts Überfälliges hat."]));
push(...leer());
push(h2("7.3 Dublettenwarnung, optional"));
push(txt("Trigger «Wenn ein Element erstellt wird». Elemente abrufen mit derselben Obj.-Nr. und Abgeschlossen eq null. Ist die Anzahl grösser als eins, E-Mail an die erfassende Person mit dem Hinweis, dass zum selben Objekt bereits ein Fall offen ist."));

/* 8 */
push(h1("8. Laufende Fälle übernehmen"));
push(...schritte([
  "In der Liste die Ansicht «Alle Elemente» öffnen und auf «Bearbeitung im Raster» umschalten.",
  "Aus dem bestehenden Excel Obj.-Nr., Liegenschaft, ex-Mieter, gekündigt per und Haftungsdatum spaltenweise einfügen.",
  "Bewirtschafter und Team je Zeile setzen – das geht im Raster ebenfalls.",
  "Erledigte Schritte nachtragen. Ist das genaue Datum nicht bekannt, das Datum der Übernahme eintragen und in der Notiz vermerken.",
  "Danach den Flow aus 7.1 einmal von Hand starten, damit Leerstandstage und «überfällig» sofort stimmen."]));
push(...leer());
push(kasten("Regel für den Umstieg",[
  "Ab dem Stichtag wird ausschliesslich in der Liste gearbeitet. Das alte Excel wird schreibgeschützt abgelegt, nicht parallel weitergeführt – sonst entstehen zwei Wahrheiten und das Problem ist grösser als vorher."],WARN));

/* 9 */
push(h1("9. Bedienung im Alltag"));
push(tabelle(["Aufgabe","Vorgehen"],[
  ["Tag beginnen","Ansicht «Meine offenen Fälle» öffnen, danach «Überfällig» prüfen."],
  ["Schritt erledigen","In der Zeile das entsprechende Datumsfeld auf das heutige Datum setzen."],
  ["Schritt entfällt","In «nicht erforderlich» den Schrittnamen auswählen. Das Datumsfeld bleibt leer."],
  ["Neuen Fall erfassen","Neu → Objektangaben, ex-Mieter, gekündigt per und Haftungsdatum. Mehr ist zum Anlegen nicht nötig."],
  ["Fall zurückstellen","«zurückgestellt bis» setzen. Der Fall verschwindet aus der Überfällig-Ansicht und erscheint unter «Zurückgestellt»."],
  ["Fall abschliessen","«Fall abgeschlossen» auf das heutige Datum setzen – erst, wenn der Zahlungseingang erfasst ist."],
  ["Nachvollziehen, wer was geändert hat","Element öffnen → Versionsverlauf."]
],[2400,6620]));

/* 10 */
push(h1("10. Grenzen dieser Lösung"));
push(txt("Damit später niemand überrascht ist:"));
push(tabelle(["Was fehlt","Folge"],[
  ["Keine Führung durch den Prozess","Der Bewirtschafter muss selbst wissen, was als Nächstes dran ist. Die Ansichten helfen, ersetzen es aber nicht."],
  ["Keine Abschlusssperre","Ein Fall lässt sich abschliessen, obwohl die Schlussabrechnung offen ist. Nur ein Hinweis im Ablauf wäre möglich, keine echte Sperre."],
  ["Phase aus sechs Meilensteinen","Gröber als im Prototyp, der alle zwanzig Schritte auswertet."],
  ["Wer einen Schritt erledigt hat","Steht nur im Versionsverlauf, nicht in einer Spalte. Für Auswertungen nicht nutzbar."],
  ["Keine Durchlaufzeiten je Phase","Liesse sich nachträglich aus den Datumsspalten rechnen, aber nicht in der Liste selbst."],
  ["Vierzig Spalten","Nur über Ansichten beherrschbar. Wer «Alle Elemente» öffnet, sieht wieder eine Tabelle wie im Excel."]
],[2800,6220]));
push(...leer());
push(kasten("Der Weg bleibt offen",[
  "Diese Liste ist kein Sackgassen-Entscheid. Wird später mehr Führung gewünscht, lässt sich eine Power App auf genau dieser Liste aufsetzen – die Daten bleiben, wo sie sind, und die bereits erfassten Fälle gehen nicht verloren.",
  "Der Prototyp bleibt die Zielbeschreibung dafür; die Prozessbeschreibung und die Bedienungsanleitung gelten unverändert."]));

const doc=new Document({
  creator:"Schäppi Grundstücke", title:"Aufbauanleitung SharePoint-Liste",
  description:"Schritt-für-Schritt-Anleitung für die Leerstandsliste auf SharePoint",
  styles:{default:{
    document:{run:{font:"Calibri",size:21,color:"1A1A1A"},paragraph:{spacing:{line:290,after:130}}},
    heading1:{run:{font:"Calibri",size:30,bold:true,color:KOPF},paragraph:{spacing:{before:340,after:150}}},
    heading2:{run:{font:"Calibri",size:24,bold:true,color:"0B4655"},paragraph:{spacing:{before:260,after:110}}}}},
  sections:[{properties:{page:{margin:{top:1200,right:1440,bottom:1200,left:1440}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,
      children:[new TextRun({text:"Aufbauanleitung SharePoint-Liste · Seite ",size:16,color:"85939C"}),
        new TextRun({children:[PageNumber.CURRENT],size:16,color:"85939C"})]})]})},
    children:k}]
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Aufbauanleitung-SharePoint-Liste.docx",b);
  console.log("erstellt:",Math.round(b.length/1024),"KB");});
