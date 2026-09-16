const d = require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,
       ShadingType,AlignmentType,BorderStyle,PageBreak,LevelFormat,Footer,PageNumber} = d;
const fs = require('fs');

const W = [600,3080,1240,2040,2060];            // Summe 9020 DXA
const TOT = W.reduce((a,b)=>a+b,0);
const TINT = "EDF1F2", KOPF = "0F5C6E", ZEBRA = "F7F9F9";

const P = (t,o={}) => new Paragraph({children:[new TextRun({text:t,...o.run})],...o.par});
const txt = (t,o={}) => new Paragraph({children:[new TextRun({text:t,size:20,...o})],
  spacing:{after:o.after!==undefined?o.after:120}});
const h1 = t => new Paragraph({text:t, heading:HeadingLevel.HEADING_1, spacing:{before:320,after:160}});
const h2 = t => new Paragraph({text:t, heading:HeadingLevel.HEADING_2, spacing:{before:260,after:120}});
const h3 = t => new Paragraph({text:t, heading:HeadingLevel.HEADING_3, spacing:{before:200,after:100}});
const leer = (n=1) => Array.from({length:n},()=>new Paragraph({children:[new TextRun("")],spacing:{after:0}}));

function zelle(text,{w,kopf=false,bold=false,zebra=false,mono=false,leerz=false}={}){
  return new TableCell({
    width:{size:w,type:WidthType.DXA},
    shading:{type:ShadingType.CLEAR, fill: kopf?KOPF : zebra?ZEBRA : "FFFFFF", color:"auto"},
    margins:{top:70,bottom:70,left:100,right:100},
    children:[ new Paragraph({children:[new TextRun({
        text: leerz ? "" : String(text),
        bold: kopf||bold, size:18,
        color: kopf?"FFFFFF":"1A1A1A",
        font: mono?"Consolas":undefined })], spacing:{after:0}}) ]
  });
}
function tabelle(kopfzeile, zeilen, breiten=W, leerspalte=true){
  const rows=[ new TableRow({tableHeader:true, children:kopfzeile.map((t,i)=>zelle(t,{w:breiten[i],kopf:true}))}) ];
  zeilen.forEach((z,i)=>{
    rows.push(new TableRow({children: z.map((t,j)=>zelle(t,{w:breiten[j], zebra:i%2===1,
      bold: typeof t==="string" && t.startsWith("**"),
      leerz: leerspalte && j===breiten.length-1 && t==="" }))}));
  });
  return new Table({columnWidths:breiten, width:{size:breiten.reduce((a,b)=>a+b,0),type:WidthType.DXA}, rows,
    borders:{ top:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      bottom:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      left:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      right:{style:BorderStyle.SINGLE,size:4,color:"C6D0D5"},
      insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"},
      insideVertical:{style:BorderStyle.SINGLE,size:2,color:"DFE5E8"} }});
}
function kasten(titel, zeilenTexte){
  return new Table({columnWidths:[TOT], width:{size:TOT,type:WidthType.DXA},
    borders:{ top:{style:BorderStyle.SINGLE,size:4,color:"0F5C6E"},
      bottom:{style:BorderStyle.SINGLE,size:4,color:"0F5C6E"},
      left:{style:BorderStyle.SINGLE,size:18,color:"0F5C6E"},
      right:{style:BorderStyle.SINGLE,size:4,color:"0F5C6E"},
      insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},
    rows:[ new TableRow({children:[ new TableCell({
      width:{size:TOT,type:WidthType.DXA},
      shading:{type:ShadingType.CLEAR,fill:TINT,color:"auto"},
      margins:{top:140,bottom:140,left:180,right:160},
      children:[ new Paragraph({children:[new TextRun({text:titel,bold:true,size:19,color:"0B4655"})],spacing:{after:70}})
        ].concat(zeilenTexte.map(t=>new Paragraph({children:[new TextRun({text:t,size:19})],spacing:{after:50}})))
    })]})]});
}
const KOPFZEILE = ["Nr.","Schritt","System","Auslöser / Frist","Bemerkung"];

/* ---------------------------------------------------------------- Inhalt */
const kinder = [];
const push = (...x)=>x.forEach(e=>kinder.push(e));

push(new Paragraph({children:[new TextRun({text:"Leerstandsmanager",bold:true,size:48,color:"0F5C6E"})],spacing:{after:60}}));
push(new Paragraph({children:[new TextRun({text:"Prozessbeschreibung Mieterwechsel",size:30,color:"5A6B76"})],spacing:{after:240}}));
push(new Paragraph({children:[new TextRun({text:"Fassung vom 16. September 2026 · Prüfgrundlage · Version 1",size:19,color:"85939C"})],
  spacing:{after:320},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:"C6D0D5",space:8}}}));

push(kasten("Wozu dieses Dokument dient",[
  "Es beschreibt die fachlichen Abläufe rund um einen Mieterwechsel so, wie sie im Werkzeug abgebildet werden – von der eingehenden Kündigung bis zum Zahlungseingang der Schlussabrechnung.",
  "Es ist zur Prüfung gedacht: Jeder Schritt, jede Frist und jede Kontrolle trägt eine Nummer. Ergänzt in der Spalte «Bemerkung», was bei euch anders läuft, und nennt mir die Nummer – dann passe ich den Ablauf an.",
  "Nicht Gegenstand dieses Dokuments ist die Bedienung. Wie ein Schritt im Werkzeug erfasst wird, folgt später."]));
push(...leer());

/* 1 */
push(h1("1. Geltungsbereich und Abgrenzung"));
push(txt("Beschrieben wird der Ablauf eines einzelnen Mieterwechsels an einem Mietobjekt. Ein Fall beginnt mit dem Eingang einer Kündigung und endet mit dem Zahlungseingang der Schlussabrechnung."));
push(txt("Das Werkzeug stellt sicher, dass keine Kündigung, keine Abnahme und keine Schlussabrechnung vergessen geht. Es führt keine Stammdaten:"));
push(tabelle(["Gegenstand","Geführt in"], [
  ["Mieter-, Objekt- und Eigentümerdaten","Garaio REM"],
  ["Mietverträge, Abrechnungen, Buchungen","Garaio REM"],
  ["Dokumente und Protokolle","Objektdossier auf SharePoint"],
  ["Inserate und Vermarktung","VMZ und Portale"],
  ["Pendenzen, Fristen und Nachweis der Erledigung","dieses Werkzeug"]
], [5020,4000], false));
push(txt("Ein erledigter Schritt in diesem Werkzeug bedeutet nie, dass hier etwas gebucht oder abgelegt wurde. Er bedeutet, dass die Handlung im zuständigen System vorgenommen wurde.", {after:200}));

/* 2 */
push(h1("2. Schlüsseldaten und Begriffe"));
push(tabelle(["Begriff","Bedeutung","Herkunft"],[
  ["gekündigt per","Datum, auf das die Kündigung ausgesprochen wurde. Zeitpunkt des Kündigungseingangs, nicht des Auszugs.","Erfassung"],
  ["Haftungsdatum","Letzter Tag, für den der Vormieter haftet; entspricht dem Mietende. Bei vorzeitiger Rückgabe wird ausserordentlich gekündigt und das Mietende angepasst.","Erfassung"],
  ["Leerstandsbeginn","Tag nach dem Haftungsdatum.","berechnet"],
  ["Vermietet per","Datum, ab dem das Objekt wieder vermietet ist.","Erfassung"],
  ["Leerstandstage","Leere Kalendertage vom Leerstandsbeginn bis zum Tag vor der Neuvermietung, beide eingeschlossen. Bei laufenden Fällen bis heute.","berechnet"],
  ["Vorlauftage","Kalendertage von «gekündigt per» bis zum Haftungsdatum. Entspricht der Kündigungsfrist und zählt nicht als Leerstand.","berechnet"],
  ["Berichtsmonat","Monat und Jahr des Leerstandsbeginns.","berechnet"],
  ["Mieter seit","Beginn des Mietverhältnisses des Vormieters. Relevant für die Beurteilung der Abnutzung.","Erfassung"]
],[1700,5320,2000],false));
push(...leer());
push(kasten("Rechenbeispiel",[
  "Haftung bis 31.08., Vermietung ab 01.09.  →  0 Leerstandstage (nahtlos).",
  "Haftung bis 31.08., Vermietung ab 15.09.  →  14 Leerstandstage (01.09. bis 14.09.).",
  "Kündigung am 31.05., Haftung bis 31.08.   →  92 Vorlauftage, die nicht als Leerstand zählen.",
  "Der Berichtsmonat ist in beiden Fällen September, nicht August."]));

/* 3 */
push(h1("3. Organisation und Zuständigkeit"));
push(txt("Jeder Fall hat genau einen zuständigen Bewirtschafter. Er führt alle Schritte des Falls, sofern nachstehend nichts anderes vermerkt ist. Die Bewirtschaftung ist in zwei Teams gegliedert."));
push(tabelle(["Einheit","Bewirtschafter","Verantwortung"],[
  ["BS 01","Brandenburger, Breitmeier, Loa, Sivanesan","Teamleitung überwacht die Fälle des Teams und kann Zuständigkeiten innerhalb des Teams übergeben."],
  ["BS 02","Moren, Ryser, Scherb, Ademi, Fazliu","dito"],
  ["BS Gesamt","alle neun","Gesamtsicht über beide Teams; Zuständigkeiten auch teamübergreifend."]
],[1500,3200,4320],false));
push(txt("Ein Bewirtschafter bearbeitet die eigenen Fälle und sieht die Fälle seines Teams – für Stellvertretung und telefonische Auskunft.", {after:200}));

/* 4 */
push(h1("4. Prozesslandkarte"));
push(txt("Der Mieterwechsel gliedert sich in drei Prozesse. Sie folgen aufeinander, überschneiden sich aber: Die Vermarktung läuft bereits, während die Abnahme noch aussteht."));
push(tabelle(["Prozess","Inhalt","Beginnt mit","Endet mit"],[
  ["1  Kündigung & Abnahme","Kündigung abwickeln, Objekt vermarkten, abnehmen, instand stellen","Eingang der Kündigung","Instandstellung beauftragt"],
  ["2  Wiedervermietung","Nachmieter gewinnen, Vertrag abschliessen, Objekt übergeben","Zusage des Nachmieters","Kaution und Mutation erledigt"],
  ["3  Schlussabrechnung","Mit dem Vormieter abrechnen","Eingang der Handwerkerrechnungen","Zahlungseingang"]
],[2100,3400,1760,1760],false));
push(...leer());
push(kasten("Lesehilfe zu den Ablauftabellen",[
  "System – wo die Handlung tatsächlich stattfindet: Garaio REM · VMZ · Dossier (SharePoint) · vor Ort · extern (Dritte).",
  "Auslöser / Frist – was den Schritt auslöst oder bis wann er erledigt sein soll. «keine feste Frist» heisst: der Schritt ist zu erledigen, wird aber nicht überwacht.",
  "Bemerkung – bleibt leer für eure Anmerkungen."]));

push(new Paragraph({children:[new PageBreak()]}));

/* 5 – Prozess 1 */
push(h1("5. Prozess 1 — Kündigung & Abnahme"));
push(tabelle(["Merkmal","Beschreibung"],[
  ["Auslöser","Eine Kündigung des Mieters geht ein, oder es wird ausserordentlich gekündigt."],
  ["Ergebnis","Das Objekt ist abgenommen, die Instandstellung ist beauftragt, die Vermarktung läuft."],
  ["Zuständig","Der zuständige Bewirtschafter des Objekts."],
  ["Entspricht im Excel","Spalten A bis V"]
],[2000,7020],false));

push(h2("5.1 Falleröffnung"));
push(txt("Der Fall wird eröffnet, sobald die Kündigung vorliegt. Objektbezogene Angaben stammen aus Garaio REM und werden nicht neu erfasst."));
push(tabelle(["Nr.","Angabe","Pflicht","Erläuterung","Bemerkung"],[
  ["1.1","Objekt","ja","Aus Garaio REM: Objekt-Nr., Liegenschaft, Stockwerk, Zimmerzahl, Eigentümer, Dossier.",""],
  ["1.2","Zuständiger Bewirtschafter","ja","Wird mit dem Objekt übernommen, kann übergeben werden.",""],
  ["1.3","ex-Mieter","ja","Name des kündigenden Mieters.",""],
  ["1.4","gekündigt per","ja","Grundlage der Vorlaufzeit.",""],
  ["1.5","Haftungsdatum","ja","Grundlage der Leerstandsberechnung und aller Fristen dieses Prozesses.",""],
  ["1.6","Mieter seit","nein","Für die Beurteilung der Abnutzung bei der Abnahme.",""]
],[600,2000,800,3560,2060]));
push(txt("Ohne Haftungsdatum entsteht keine Frist. Der Fall gilt als unvollständig und wird als solcher gemeldet.", {after:200}));

push(h2("5.2 Ablauf"));
push(tabelle(KOPFZEILE,[
  ["2.1","Kündigung bestätigen und Mutation erfassen","Garaio REM","nach Eingang der Kündigung",""],
  ["2.2","Werke und EGT über den Auszug informieren","extern","nach Eingang der Kündigung; Ablesung erfolgt per Haftungsdatum",""],
  ["2.3","Vorbesichtigung durchführen","vor Ort","Entscheid: erforderlich oder nicht. Ist sie nicht nötig, wird das festgehalten und der Schritt entfällt.",""],
  ["2.4","Vermietungszentrale nachführen","VMZ","sobald der frühestmögliche Bezugstermin feststeht",""],
  ["2.5","Inserat aufschalten","VMZ","so früh wie möglich; verkürzt den späteren Leerstand",""],
  ["2.6","Abnahmetermin vereinbaren","vor Ort","spätestens 30 Tage vor dem Haftungsdatum (Frist F1)",""],
  ["2.7","Wohnungsabnahme durchführen","vor Ort","am vereinbarten Termin",""],
  ["2.8","Handwerker aufbieten","extern","innert 3 Tagen nach der durchgeführten Abnahme (Frist F2)",""],
  ["2.9","Zustimmungserklärung des Vormieters einholen","Dossier","nach der Abnahme; Grundlage der Schlussabrechnung",""],
  ["2.10","Instandstellungen beauftragen","extern","nach Vorliegen der Offerten",""]
]));
push(...leer());
push(kasten("Warum der Abnahmetermin 30 Tage vorher steht",[
  "Bis zur Wohnungsabgabe müssen Termin und Kapazitäten gesichert sein. Die Frist entsteht automatisch aus dem Haftungsdatum, sobald dieses erfasst ist.",
  "Das Handwerkeraufgebot hängt dagegen nicht am Haftungsdatum: Erst die durchgeführte Abnahme zeigt, was zu beauftragen ist. Vorher entsteht für diesen Schritt keine Frist."]));
push(txt("Abschlusskriterium: Die Schritte 2.1 bis 2.10 sind erledigt oder als nicht erforderlich festgehalten.",{bold:true, after:200}));

push(new Paragraph({children:[new PageBreak()]}));

/* 6 – Prozess 2 */
push(h1("6. Prozess 2 — Wiedervermietung"));
push(tabelle(["Merkmal","Beschreibung"],[
  ["Auslöser","Ein Nachmieter hat zugesagt."],
  ["Ergebnis","Das Objekt ist übergeben, der Vertrag liegt unterzeichnet vor, die Kaution ist eingegangen."],
  ["Zuständig","Der zuständige Bewirtschafter des Objekts."],
  ["Entspricht im Excel","Spalten W bis AE"]
],[2000,7020],false));

push(h2("6.1 Vertragsabschluss"));
push(tabelle(KOPFZEILE,[
  ["3.1","Nachmieter festhalten","—","sobald die Zusage vorliegt; Pflichtangabe, ohne die kein Vertrag versendet wird",""],
  ["3.2","Mietvertrag versenden","Garaio REM","nach Erfassung des Nachmieters",""],
  ["3.3","Unterzeichneten Vertrag zurückerhalten","Dossier","eine Rücklauffrist kann im Einzelfall gesetzt werden (Frist F3)",""],
  ["3.4","Vermietungsdatum festhalten","—","Pflichtangabe; beendet die Leerstandszählung",""]
]));

push(h2("6.2 Übergabe"));
push(tabelle(KOPFZEILE,[
  ["4.1","Werke und EGT über den Einzug informieren","extern","nach Vertragsabschluss",""],
  ["4.2","Schlüsselübergabe terminieren","vor Ort","Termin wird im Einzelfall gesetzt und überwacht (Frist F4)",""],
  ["4.3","Endreinigung veranlassen","extern","so, dass das Objekt zur Übergabe bezugsbereit ist",""],
  ["4.4","Namensschilder bestellen und montieren","extern","vor der Übergabe",""],
  ["4.5","Kaution vereinnahmen und Mutation erfassen","Garaio REM","vor der Schlüsselübergabe",""]
]));
push(...leer());
push(kasten("Hinweis zur Reihenfolge",[
  "Schritt 4.5 ist im Ablauf zuletzt aufgeführt, muss aber vor der Schlüsselübergabe (4.2) erledigt sein: Ohne Kaution keine Schlüsselübergabe.",
  "Ist das bei euch als harte Bedingung zu behandeln, halte ich es fest – siehe Annahme A6."]));
push(txt("Abschlusskriterium: Nachmieter und Vermietungsdatum sind erfasst, die Schritte 3.2 bis 4.5 sind erledigt oder als nicht erforderlich festgehalten.",{bold:true, after:200}));

/* 7 – Prozess 3 */
push(h1("7. Prozess 3 — Schlussabrechnung"));
push(tabelle(["Merkmal","Beschreibung"],[
  ["Auslöser","Die Rechnungen der Handwerker für die Instandstellung gehen ein."],
  ["Ergebnis","Der Vormieter hat abgerechnet und den Saldo beglichen; der Fall ist abschliessbar."],
  ["Zuständig","Der zuständige Bewirtschafter des Objekts."],
  ["Entspricht im Excel","Spalten AF bis AH"]
],[2000,7020],false));
push(tabelle(KOPFZEILE,[
  ["5.1","Instandstellungsrechnungen erfassen und den Positionen des Abnahmeprotokolls zuordnen","Garaio REM","nach Rechnungseingang",""],
  ["5.2","Schlussabrechnung erstellen und an den Vormieter versenden","Garaio REM","nach Zuordnung der Rechnungen",""],
  ["5.3","Zahlungseingang kontrollieren","Garaio REM","nach Versand der Schlussabrechnung",""]
]));
push(txt("Abschlusskriterium: Die Schritte 5.1 bis 5.3 sind erledigt. Erst danach kann der Fall abgeschlossen werden.",{bold:true, after:200}));

push(new Paragraph({children:[new PageBreak()]}));

/* 8 – Fristen */
push(h1("8. Fristenregeln"));
push(txt("Fristen entstehen aus Daten, die ohnehin erfasst werden. Eine Frist entsteht erst, wenn ihr Bezugsdatum feststeht; ein im Einzelfall gesetzter Termin geht der Regel immer vor."));
push(tabelle(["Nr.","Frist","Bezugsdatum","Regel","Bemerkung"],[
  ["F1","Abnahmetermin vereinbaren","Haftungsdatum","30 Tage vorher",""],
  ["F2","Handwerker aufbieten","Tag der durchgeführten Abnahme","3 Tage danach",""],
  ["F3","Vertrag retour","—","kein Automatismus; Frist wird im Einzelfall gesetzt",""],
  ["F4","Schlüsselübergabe","—","Termin wird im Einzelfall gesetzt",""],
  ["F5","Langläufer","Leerstandsbeginn","Meldung, wenn der Leerstand 60 Tage überschreitet und noch nicht vermietet ist",""]
],[600,2200,1900,2260,2060]));
push(txt("Verschiebt sich das Haftungsdatum nachträglich – etwa bei ausserordentlicher Kündigung mit Nachmieterstellung – verschieben sich Leerstandsbeginn, Berichtsmonat und die Frist F1 entsprechend. Die Änderung wird mit Datum und Benutzer festgehalten.", {after:200}));

/* 9 – Kontrollen */
push(h1("9. Fachliche Kontrollen"));
push(txt("Diese Prüfungen laufen laufend über alle offenen Fälle."));
push(tabelle(["Nr.","Kontrolle","Stufe","Ausgelöst wenn","Bemerkung"],[
  ["K1","Frist verstrichen","kritisch","Eine Frist ist überschritten und der Schritt ist noch offen.",""],
  ["K2","Frist läuft ab","Hinweis","Eine Frist wird innert sieben Tagen fällig.",""],
  ["K3","Doppelter Fall","kritisch","Zu einem Objekt sind zwei Fälle gleichzeitig offen. Ein Folgefall nach abgeschlossenem Vorfall ist normal und löst keine Meldung aus.",""],
  ["K4","Haftungsdatum vor Kündigung","kritisch","Das Haftungsdatum liegt vor «gekündigt per».",""],
  ["K5","Vermietung vor Leerstandsbeginn","Hinweis","«Vermietet per» liegt vor dem Haftungsdatum.",""],
  ["K6","Abnahmetermin vor Kündigung","Hinweis","Der Abnahmetermin liegt vor «gekündigt per».",""],
  ["K7","Pflichtangabe fehlt","Hinweis","Eine für den aktuellen Prozessschritt erforderliche Angabe fehlt.",""],
  ["K8","Langläufer","Hinweis","Der Leerstand überschreitet 60 Tage (siehe F5).",""],
  ["K9","Abschlussbereit","Information","Alle Schritte sind erledigt; der Fall kann abgeschlossen werden.",""]
],[600,1900,1000,3460,2060]));

/* 10 – Status */
push(h1("10. Zustände und Nachweis"));
push(h3("10.1 Zustand eines Schritts"));
push(tabelle(["Zustand","Bedeutung"],[
  ["offen","Noch nicht erledigt."],
  ["erledigt","Im zuständigen System vorgenommen. Datum und Benutzer werden automatisch festgehalten."],
  ["nicht erforderlich","Bewusster Entscheid, dass der Schritt bei diesem Fall entfällt, mit Begründung. Unterscheidet sich ausdrücklich von «offen»."]
],[2200,6820],false));
push(h3("10.2 Zustand eines Falls"));
push(txt("Der Stand eines Falls wird nicht erfasst, sondern ergibt sich aus den erledigten Schritten. Ein Fall kann erst abgeschlossen werden, wenn die Schlussabrechnung vollständig ist (5.1 bis 5.3). Ein Fall kann mit Datum zurückgestellt werden; er kehrt am festgelegten Tag in den Arbeitsvorrat zurück."));
push(h3("10.3 Nachweis"));
push(txt("Jede Erledigung, jede Datumsänderung, jede Übergabe der Zuständigkeit und jede Zurückstellung wird mit Zeitpunkt und Benutzer festgehalten und bleibt am Fall einsehbar.", {after:200}));

push(new Paragraph({children:[new PageBreak()]}));

/* 11 – Annahmen */
push(h1("11. Annahmen, die zu bestätigen sind"));
push(txt("Die folgenden Punkte sind nicht aus der bestehenden Liste belegt, sondern von mir fachlich geschlossen. Bitte bestätigen oder korrigieren."));
push(tabelle(["Nr.","Annahme","Herkunft","Bemerkung"],[
  ["A1","Das Haftungsdatum entspricht dem Mietende. Bei vorzeitiger Rückgabe wird ausserordentlich gekündigt und das Mietende angepasst; ein eigenes Feld «Mietende» gibt es deshalb nicht.","von euch bestätigt",""],
  ["A2","Der Abnahmetermin muss 30 Tage vor der Wohnungsabgabe vereinbart sein (F1).","von euch gewünscht, Zahl von mir gesetzt",""],
  ["A3","Die Handwerker sind innert 3 Tagen nach der Abnahme aufzubieten (F2).","Zahl von mir gesetzt",""],
  ["A4","Ein Leerstand über 60 Tage gilt als Langläufer (F5).","aus der bestehenden Liste übernommen",""],
  ["A5","Die Zuordnung der Schritte zu den Systemen. Belegt sind nur 2.1 und 4.5 (Garaio REM) sowie 2.4 (VMZ); die übrigen sind von mir geschlossen.","teilweise Annahme",""],
  ["A6","Die Kaution (4.5) muss vor der Schlüsselübergabe (4.2) eingegangen sein. Derzeit als Hinweis, nicht als Sperre umgesetzt.","Annahme",""],
  ["A7","Ein Fall entsteht künftig automatisch, sobald die Kündigung in Garaio REM erfasst ist; die Handerfassung bleibt Rückfallebene.","Annahme",""],
  ["A8","Der Teamzuschnitt BS 01 und BS 02 gemäss Abschnitt 3.","von euch vorgegeben",""],
  ["A9","Eine Zurückstellung erfolgt standardmässig um 3 Tage.","Zahl von mir gesetzt",""],
  ["A10","Die Reihenfolge der Schritte innerhalb von Prozess 1 (2.1 bis 2.10).","aus der Spaltenfolge der bestehenden Liste abgeleitet",""]
],[600,4400,1960,2060]));

/* 12 – Rückmeldung */
push(h1("12. Rückmeldung"));
push(txt("Für jede Änderung genügt die Nummer und der neue Wortlaut, zum Beispiel:"));
push(new Paragraph({children:[new TextRun({text:"«2.8 – Handwerker werden bei uns erst nach Vorliegen der Offerten aufgeboten, Frist 10 Tage.»",italics:true,size:20,color:"0B4655"})],
  spacing:{after:100},indent:{left:280}}));
push(new Paragraph({children:[new TextRun({text:"«F5 – Langläufer bei uns ab 45 Tagen.»",italics:true,size:20,color:"0B4655"})],
  spacing:{after:160},indent:{left:280}}));
push(txt("Ebenso hilfreich: Schritte, die hier fehlen, und Schritte, die bei euch gar nicht vorkommen."));
push(...leer());
push(tabelle(["Nr.","Änderung","Durch","Datum"],
  Array.from({length:12},()=>["","","",""]),[900,5060,1560,1500]));

/* ------------------------------------------------------------- Dokument */
const doc = new Document({
  creator:"Schäppi Grundstücke", title:"Prozessbeschreibung Mieterwechsel",
  description:"Fachliche Prozesse des Leerstandsmanagers zur Prüfung",
  styles:{ default:{
      document:{run:{font:"Calibri",size:21,color:"1A1A1A"},paragraph:{spacing:{line:280,after:120}}},
      heading1:{run:{font:"Calibri",size:30,bold:true,color:"0F5C6E"},paragraph:{spacing:{before:320,after:160}}},
      heading2:{run:{font:"Calibri",size:25,bold:true,color:"0B4655"},paragraph:{spacing:{before:260,after:120}}},
      heading3:{run:{font:"Calibri",size:22,bold:true,color:"5A6B76"},paragraph:{spacing:{before:200,after:100}}}
  }},
  sections:[{
    properties:{ page:{ margin:{top:1200,right:1440,bottom:1200,left:1440} } },
    footers:{ default:new Footer({children:[ new Paragraph({
      alignment:AlignmentType.RIGHT,
      children:[ new TextRun({text:"Prozessbeschreibung Mieterwechsel · Seite ",size:16,color:"85939C"}),
        new TextRun({children:[PageNumber.CURRENT],size:16,color:"85939C"}) ]})]})},
    children:kinder
  }]
});
Packer.toBuffer(doc).then(b=>{ fs.writeFileSync("Prozessbeschreibung-Mieterwechsel.docx",b);
  console.log("erstellt:", b.length, "Bytes"); });
