const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,
       ShadingType,AlignmentType,BorderStyle,PageBreak,ImageRun,Footer,PageNumber}=d;
const fs=require('fs');
const BILD='bilder/';
const TOT=9020, KOPF="0F5C6E", TINT="EDF1F2", ZEBRA="F7F9F9";

const txt=(t,o={})=>new Paragraph({children:[new TextRun({text:t,size:21,...o})],spacing:{after:o.after!==undefined?o.after:130}});
const h1=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_1,spacing:{before:340,after:150}});
const h2=t=>new Paragraph({text:t,heading:HeadingLevel.HEADING_2,spacing:{before:260,after:110}});
const leer=(n=1)=>Array.from({length:n},()=>new Paragraph({children:[new TextRun("")],spacing:{after:0}}));

function pngGroesse(buf){ return {w:buf.readUInt32BE(16), h:buf.readUInt32BE(20)}; }
function bild(datei, maxBreite=598, maxHoehe=640){
  const buf=fs.readFileSync(BILD+datei);
  const g=pngGroesse(buf);
  let w=g.w/2, h=g.h/2;                        // mit Faktor 2 aufgenommen
  if(w>maxBreite){ h=h*maxBreite/w; w=maxBreite; }
  if(h>maxHoehe){ w=w*maxHoehe/h; h=maxHoehe; }
  return new Paragraph({
    children:[new ImageRun({data:buf,type:"png",transformation:{width:Math.round(w),height:Math.round(h)}})],
    spacing:{before:80,after:60}, alignment:AlignmentType.LEFT});
}
function bildtext(t){
  return new Paragraph({children:[new TextRun({text:t,size:17,italics:true,color:"5A6B76"})],
    spacing:{after:200}});
}
function zelle(t,{w,kopf=false,zebra=false,bold=false}={}){
  return new TableCell({ width:{size:w,type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR,fill:kopf?KOPF:zebra?ZEBRA:"FFFFFF",color:"auto"},
    margins:{top:70,bottom:70,left:100,right:100},
    children:[new Paragraph({children:[new TextRun({text:String(t),bold:kopf||bold,size:18,
      color:kopf?"FFFFFF":"1A1A1A"})],spacing:{after:0}})]});
}
function tabelle(kopfzeile,zeilen,breiten){
  const rows=[new TableRow({tableHeader:true,children:kopfzeile.map((t,i)=>zelle(t,{w:breiten[i],kopf:true}))})];
  zeilen.forEach((z,i)=>rows.push(new TableRow({children:z.map((t,j)=>zelle(t,{w:breiten[j],zebra:i%2===1,bold:j===0}))})));
  return new Table({columnWidths:breiten,width:{size:breiten.reduce((a,b)=>a+b,0),type:WidthType.DXA},rows,
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},bottom:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      left:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},right:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"},insideVertical:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"}}});
}
function kasten(titel,zeilen){
  return new Table({columnWidths:[TOT],width:{size:TOT,type:WidthType.DXA},
    borders:{top:{style:BorderStyle.SINGLE,size:4,color:KOPF},bottom:{style:BorderStyle.SINGLE,size:4,color:KOPF},
      left:{style:BorderStyle.SINGLE,size:18,color:KOPF},right:{style:BorderStyle.SINGLE,size:4,color:KOPF},
      insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},
    rows:[new TableRow({children:[new TableCell({width:{size:TOT,type:WidthType.DXA},
      shading:{type:ShadingType.CLEAR,fill:TINT,color:"auto"},margins:{top:140,bottom:140,left:180,right:160},
      children:[new Paragraph({children:[new TextRun({text:titel,bold:true,size:19,color:"0B4655"})],spacing:{after:70}})]
        .concat(zeilen.map(t=>new Paragraph({children:[new TextRun({text:t,size:19})],spacing:{after:50}})))})]})]});
}
function schritte(liste){
  return liste.map((t,i)=>new Paragraph({
    children:[new TextRun({text:(i+1)+".  ",bold:true,size:21,color:"0F5C6E"}),new TextRun({text:t,size:21})],
    spacing:{after:70},indent:{left:280,hanging:280}}));
}

const k=[]; const push=(...x)=>x.forEach(e=>k.push(e));

push(new Paragraph({children:[new TextRun({text:"Leerstandsmanager",bold:true,size:48,color:KOPF})],spacing:{after:60}}));
push(new Paragraph({children:[new TextRun({text:"Bedienungsanleitung",size:30,color:"5A6B76"})],spacing:{after:240}}));
push(new Paragraph({children:[new TextRun({text:"Fassung vom 16. September 2026 · gilt für den Prototyp",size:19,color:"85939C"})],
  spacing:{after:320},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"C6D0D5",space:8}}}));

push(kasten("In einem Satz",[
  "Die Anwendung sagt Ihnen, welcher Mieterwechsel als Nächstes Ihre Aufmerksamkeit braucht – Sie müssen nicht selbst suchen.",
  "Sie führt keine Mieter- oder Objektdaten. Ein Haken bedeutet: im zuständigen System erledigt, nicht: hier gebucht."]));
push(...leer());

/* 1 */
push(h1("1. Anmelden und Aufbau des Bildschirms"));
push(txt("Oben rechts steht, als wer Sie angemeldet sind. Im Prototyp lässt sich der Benutzer dort frei wechseln, um die verschiedenen Sichten zu vergleichen."));
push(bild('02-kopfzeile.png'));
push(bildtext("Kopfzeile: Suche über alle Fälle, angemeldeter Benutzer, neuer Fall."));
push(tabelle(["Bereich","Wozu"],[
  ["Suchfeld","Findet Fälle über Objekt-Nr., Liegenschaft, Mieternamen oder Eigentümer."],
  ["Angemeldet als","Wechselt zwischen den einzelnen Bewirtschaftern und den Teamsichten BS Gesamt, BS 01 und BS 02."],
  ["Neuer Fall","Erfasst eine eingegangene Kündigung von Hand."],
  ["Linke Leiste","Dashboard, die drei Arbeitsbereiche mit Anzahl offener Fälle, Alle Fälle, Auswertung, Stammdaten und Hilfe."]
],[2100,6920]));

/* 2 */
push(h1("2. Ihr Arbeitstag: das Dashboard"));
push(txt("Das Dashboard ist die Startseite. Es beantwortet drei Fragen: Wie steht es insgesamt? Was ist heute zu tun? Wo stimmt etwas nicht?"));
push(bild('01-dashboard.png'));
push(bildtext("Kennzahlen, Arbeitsbereiche, Aufgaben nach Dringlichkeit, darunter die Prüfungen."));
push(h2("Meine Aufgaben"));
push(txt("Die Liste zeigt je Fall die eine Handlung, die jetzt ansteht – sortiert nach Dringlichkeit, nicht nach Eingang."));
push(bild('03-aufgaben.png'));
push(tabelle(["Farbe am linken Rand","Bedeutung"],[
  ["rot","Eine Frist ist verstrichen und der Schritt ist noch offen."],
  ["gelb","Eine Frist wird innert sieben Tagen fällig, oder eine Pflichtangabe fehlt."],
  ["petrol","Kein Termindruck – der Schritt ist der nächste im Ablauf."],
  ["grau","Der Fall ist zurückgestellt und kommt am vermerkten Tag zurück."]
],[2600,6420]));

push(new Paragraph({children:[new PageBreak()]}));

/* 3 */
push(h1("3. Aufgaben durcharbeiten"));
push(txt("Der schnellste Weg durch den Tag. Die Schaltfläche «Aufgaben durcharbeiten» nimmt Ihren Stapel und führt Sie Fall für Fall hindurch, ohne dass Sie zwischendurch zurück navigieren."));
push(bild('04-durcharbeiten.png'));
push(bildtext("Die Leiste erscheint oben in jedem Fall, solange Sie im Stapel sind."));
push(tabelle(["Schaltfläche","Wirkung"],[
  ["Zurück","Einen Fall zurück, ohne etwas zu ändern."],
  ["Später · 3 Tage","Stellt den Fall zurück. Er verschwindet aus dem Stapel und kommt in drei Tagen von selbst wieder."],
  ["Weiter","Überspringt den Fall für heute, ohne ihn zurückzustellen."],
  ["Beenden","Verlässt den Stapel und kehrt dorthin zurück, wo Sie ihn gestartet haben."]
],[2100,6920]));
push(txt("Nach jeder Handlung springt die Anwendung selbst zum nächsten Fall, sobald an diesem nichts Dringendes mehr offen ist. Ist der Stapel leer, landen Sie wieder auf dem Dashboard."));
push(...leer());
push(kasten("Den Stapel gibt es auf drei Ebenen",[
  "Vom Dashboard – alle Ihre Aufgaben.",
  "Aus einem Arbeitsbereich – nur die Aufgaben dieses Bereichs, etwa alle Abnahmen am Stück.",
  "Aus einer Mitarbeiteransicht (Teamleitung) – die Aufgaben dieser Person."]));

/* 4 */
push(h1("4. Einen Fall bearbeiten"));
push(txt("Klicken Sie eine Aufgabe oder einen Fall an. Oben stehen die Kennzahlen des Falls."));
push(bild('06-kennzahlen.png'));
push(tabelle(["Kennzahl","Bedeutung"],[
  ["Leerstandstage","Leere Tage ab dem Tag nach dem Haftungsdatum. «beginnt in …» heisst: Das Objekt ist noch bewohnt."],
  ["Vorlauftage","Zeit zwischen Kündigung und Ende der Mieterhaftung. Zählt nicht als Leerstand."],
  ["Berichtsmonat","Monat des Leerstandsbeginns."],
  ["Tage in Phase","Wie lange der Fall im aktuellen Abschnitt steht."]
],[2100,6920]));

push(h2("Der nächste Schritt"));
push(txt("Darunter steht immer, was jetzt ansteht, warum, und wo es auszuführen ist."));
push(bild('05-naechster-schritt.png'));
push(txt("Die Kennzeichnung rechts des Titels nennt das System: Garaio REM, VMZ, Dossier, vor Ort oder extern. Die Schaltfläche heisst «Erledigen», oder «Termin vereinbaren», wenn das Terminieren selbst die Aufgabe ist."));

push(new Paragraph({children:[new PageBreak()]}));

push(h2("Die Schritte eines Abschnitts"));
push(txt("Der Fall ist in fünf Abschnitte gegliedert. Der aktuelle ist aufgeklappt, die übrigen können Sie bei Bedarf öffnen."));
push(bild('07-schritte.png'));
push(tabelle(["Handlung","So geht es"],[
  ["Schritt erledigen","«Erledigen» anklicken. Datum und Ihr Name werden automatisch festgehalten."],
  ["Schritt entfällt","«nicht nötig» anklicken. Der Schritt gilt als bewusst übersprungen, nicht als vergessen."],
  ["Termin setzen","Im Datumsfeld des Schritts eintragen. Ein eigener Termin geht der Sollfrist immer vor."],
  ["Korrigieren","«rückgängig» setzt einen Schritt zurück auf offen. Der Vorgang steht in der Historie."],
  ["Datum ändern","In der Spalte «Daten» rechts auf «ändern». Die Anwendung öffnet den richtigen Abschnitt und meldet, was sich dadurch verschiebt."]
],[2100,6920]));
push(...leer());
push(kasten("Wenn Sie das Haftungsdatum ändern",[
  "Leerstandsbeginn, Berichtsmonat und die Frist für den Abnahmetermin verschieben sich mit. Die Anwendung nennt Ihnen sofort die neuen Werte und weist darauf hin, wenn eine Frist dadurch bereits überschritten ist.",
  "Die Änderung bleibt mit Datum und Ihrem Namen in der Historie des Falls sichtbar."]));

/* 5 */
push(h1("5. Warnungen verstehen"));
push(txt("Unter dem nächsten Schritt stehen die Prüfungen zu diesem Fall."));
push(bild('08-pruefungen.png'));
push(tabelle(["Meldung","Was zu tun ist"],[
  ["Frist überschritten","Den Schritt erledigen oder, wenn er entfällt, als «nicht nötig» festhalten."],
  ["Sollfrist überschritten","Wie oben. Betrifft Fristen, die sich aus dem Haftungsdatum oder der Abnahme ergeben."],
  ["Zweiter offener Fall zum selben Objekt","Prüfen, welcher der beiden gilt. Der andere Fall lässt sich direkt öffnen."],
  ["Haftungsdatum liegt vor dem Kündigungsdatum","Eines der beiden Daten ist falsch erfasst. Über «ändern» korrigieren."],
  ["Pflichtangaben fehlen","Die genannte Angabe ergänzen; ohne sie lassen sich Fristen nicht berechnen."],
  ["Langläufer","Der Leerstand dauert über 60 Tage. Prüfen, woran die Vermietung hängt."]
],[3000,6020]));

push(new Paragraph({children:[new PageBreak()]}));

/* 6 */
push(h1("6. Einen neuen Fall erfassen"));
push(txt("Über «Neuer Fall» oben rechts. Sechs Angaben genügen; alles Weitere fragt die Anwendung im Verlauf ab."));
push(bild('09-neuer-fall.png'));
push(bildtext("Ist zum gewählten Objekt bereits ein Fall offen, meldet die Anwendung das sofort."));
push(...schritte([
  "Objekt wählen. Objekt-Nr., Zimmerzahl, Stockwerk, Eigentümer und Dossier kommen automatisch mit.",
  "Zuständigen Bewirtschafter prüfen.",
  "ex-Mieter erfassen.",
  "«gekündigt per» erfassen – das Datum der Kündigung.",
  "Haftungsdatum erfassen – der letzte Tag, für den der Vormieter haftet.",
  "«Mieter seit» ergänzen, wenn bekannt.",
  "«Fall anlegen» – Sie landen direkt im neuen Fall beim ersten Schritt."]));
push(txt("Meldet die Anwendung beim Speichern einen Fehler, nennt sie den Grund im Klartext, etwa wenn das Haftungsdatum vor dem Kündigungsdatum liegt.", {after:200}));

/* 7 */
push(h1("7. Fälle finden"));
push(bild('10-fallliste.png'));
push(tabelle(["Mittel","Wofür"],[
  ["Suchfeld oben","Schnellster Weg: Objekt-Nr., Liegenschaft, Mieter- oder Eigentümername."],
  ["Bewirtschafter","Nach Team gruppiert."],
  ["Phase","Zeigt nur Fälle in einem bestimmten Abschnitt."],
  ["Status","Offen, abgeschlossen oder alle."],
  ["nur überfällige","Zeigt ausschliesslich Fälle mit verstrichener Frist."]
],[2100,6920]));
push(txt("Die Liste ist immer nach Dringlichkeit sortiert: überfällige Fälle zuoberst, danach nach Leerstandstagen. Der Balken in der Spalte rechts zeigt, wie weit ein Fall fortgeschritten ist."));

push(h2("Arbeitsbereiche"));
push(txt("In der linken Leiste stehen die drei Bereiche mit der Anzahl offener Fälle. Sie sind der Einstieg, wenn Sie eine Art Arbeit am Stück erledigen wollen."));
push(tabelle(["Bereich","Enthält"],[
  ["Kündigung & Abnahme","Von der eingegangenen Kündigung bis zur beauftragten Instandstellung."],
  ["Wiedervermietung","Vom Nachmieter bis zur Schlüsselübergabe."],
  ["Schlussabrechnung","Rechnungen, Abrechnung und Zahlungseingang."]
],[2600,6420]));

push(new Paragraph({children:[new PageBreak()]}));

/* 8 */
push(h1("8. Für die Teamleitung"));
push(txt("Melden Sie sich als BS Gesamt, BS 01 oder BS 02 an. Die Startseite wird zur Teamübersicht."));
push(bild('11-team.png'));
push(tabelle(["Spalte","Bedeutung"],[
  ["Offene Fälle","Laufende Mieterwechsel dieser Person."],
  ["Aufgaben","Offene Handlungen insgesamt."],
  ["Dringend","Davon mit verstrichener Frist."],
  ["Längste Überschreitung","Wie lange die älteste verstrichene Frist zurückliegt – der schnellste Hinweis auf einen Engpass."],
  ["Ø Leerstand","Mittlere Leerstandsdauer der abgeschlossenen Fälle."]
],[2400,6620]));
push(txt("Eine Zeile anklicken öffnet den Arbeitsvorrat dieser Person. Von dort lässt sich jeder Fall öffnen oder der ganze Stapel durcharbeiten."));
push(h2("Zuständigkeit übergeben"));
push(txt("In der Fallakte oben rechts steht bei angemeldeter Teamleitung ein Auswahlfeld «Zuständig». Die Übergabe wird mit Datum und Ihrem Namen in der Historie festgehalten. Angeboten werden die Mitglieder des jeweiligen Teams."));
push(...leer());
push(kasten("Was die Teamsicht begrenzt",[
  "BS 01 und BS 02 sehen und bearbeiten die Fälle ihres Teams. BS Gesamt umfasst beide.",
  "Fälle eines anderen Teams lassen sich ansehen, aber nicht ändern – die Anwendung weist darauf hin."]));

/* 9 */
push(h1("9. Auswertung und Export"));
push(bild('12-auswertung.png'));
push(txt("Die Kennzahlen sind nach Team gruppiert, mit Zwischentotal je Team. Die Spalte «Ø nach Excel» zeigt zum Vergleich, was die bisherige Formel ergeben hätte."));
push(txt("«Export» erzeugt die aktuell gefilterte Fallliste. Im Prototyp erscheint sie als kopierbarer Text; in der fertigen Anwendung ist es eine Excel- oder PDF-Datei."));

/* 10 */
push(h1("10. Zeichen und Farben"));
push(tabelle(["Zeichen","Bedeutung"],[
  ["grünes Häkchen","Schritt erledigt."],
  ["grauer Strich","Schritt als nicht erforderlich festgehalten."],
  ["rotes Ausrufezeichen","Frist verstrichen, Schritt noch offen."],
  ["leeres Kästchen","Schritt offen, keine Frist verstrichen."],
  ["Balken aus fünf Segmenten","Fortschritt über die fünf Abschnitte; dunkler bedeutet weiter fortgeschritten."],
  ["Kennzeichnung Garaio REM, VMZ, Dossier, vor Ort, extern","Wo der Schritt auszuführen ist."],
  ["grauer Hinweis mit Spaltenkürzel","Die entsprechende Spalte in der bisherigen Excel-Liste."]
],[3000,6020]));

/* 11 */
push(h1("11. Was tun, wenn …"));
push(tabelle(["Frage","Antwort"],[
  ["… ich einen Schritt versehentlich erledigt habe","«rückgängig» im Schritt. Der Vorgang bleibt in der Historie sichtbar."],
  ["… ein Schritt bei diesem Fall gar nicht vorkommt","«nicht nötig». So bleibt der Fall vollständig, ohne dass der Schritt als Pendenz stehen bleibt."],
  ["… ich einen Fall heute nicht bearbeiten kann","«Später · 3 Tage» im Durcharbeiten-Modus. Er kommt von selbst zurück."],
  ["… ich einen fremden Fall nicht bearbeiten kann","Zuständig ist eine andere Person. Die Teamleitung kann die Zuständigkeit übergeben."],
  ["… ein Fall doppelt erfasst wurde","Beide Fälle öffnen, den überzähligen abschliessen oder der zuständigen Person melden."],
  ["… sich das Mietende verschiebt","Haftungsdatum über «ändern» anpassen. Fristen und Berichtsmonat rechnen sich mit."],
  ["… ich einen Fall nicht abschliessen kann","Die Schlussabrechnung ist noch nicht vollständig. Die Anwendung nennt den fehlenden Schritt."],
  ["… ich Objekt- oder Mieterdaten korrigieren muss","Das geschieht in Garaio REM, nicht hier."]
],[3200,5820]));
push(...leer());
push(kasten("Hinweis zum Prototyp",[
  "Diese Anleitung beschreibt den Prototyp. Die Daten liegen nur im Browser des jeweiligen Rechners und werden nicht geteilt; «Demodaten zurücksetzen» stellt den Ausgangszustand her.",
  "Anmeldung, gemeinsame Datenhaltung und die Übernahme aus Garaio REM folgen mit der produktiven Umsetzung."]));

const doc=new Document({
  creator:"Schäppi Grundstücke", title:"Leerstandsmanager – Bedienungsanleitung",
  description:"Bedienungsanleitung zum Prototyp des Leerstandsmanagers",
  styles:{default:{
    document:{run:{font:"Calibri",size:21,color:"1A1A1A"},paragraph:{spacing:{line:290,after:130}}},
    heading1:{run:{font:"Calibri",size:30,bold:true,color:KOPF},paragraph:{spacing:{before:340,after:150}}},
    heading2:{run:{font:"Calibri",size:24,bold:true,color:"0B4655"},paragraph:{spacing:{before:260,after:110}}}}},
  sections:[{properties:{page:{margin:{top:1200,right:1440,bottom:1200,left:1440}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,
      children:[new TextRun({text:"Leerstandsmanager · Bedienungsanleitung · Seite ",size:16,color:"85939C"}),
        new TextRun({children:[PageNumber.CURRENT],size:16,color:"85939C"})]})]})},
    children:k}]
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync("Bedienungsanleitung-Leerstandsmanager.docx",b);
  console.log("erstellt:",Math.round(b.length/1024),"KB");});
