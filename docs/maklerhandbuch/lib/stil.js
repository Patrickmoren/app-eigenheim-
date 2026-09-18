/* Hausstil für alle Dokumente des Makler-Handbuchs.
   Farben und Grundraster übernommen aus docs/prozesse/build.js, damit alle
   Dokumente des Repositoriums gleich aussehen. */
const d = require('docx');
const {Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
       WidthType, ShadingType, AlignmentType, BorderStyle, PageBreak, Footer, Header,
       PageNumber, TabStopType, convertMillimetersToTwip} = d;

/* --------------------------------------------------------------- Konstanten */
const KOPF   = "0F5C6E";   // Primärfarbe Kopfzeilen
const DUNKEL = "0B4655";   // Primärfarbe dunkel
const TINT   = "EDF1F2";   // Flächenfüllung Kästen
const ZEBRA  = "F7F9F9";   // Zebrastreifen Tabellen
const GRAU   = "5A6B76";   // Sekundärtext
const HELL   = "85939C";   // Tertiärtext
const LINIE  = "C6D0D5";   // Rahmen
const FEIN   = "DFE5E8";   // Innenlinien
const ROT    = "8C2F2F";   // Rechtshinweis
const GELB   = "FBF3E2";   // Fläche Rechtshinweis
const GOLD   = "8A6A1F";   // Rand Rechtshinweis
const GRUEN  = "1F6B4A";   // Fläche/Rand Praxistipp
const GRUENF = "EAF3EE";

const RAND   = convertMillimetersToTwip(20);
const TOT    = 9600;       // nutzbare Breite in DXA bei 20 mm Rändern

/* ------------------------------------------------------------- Textbausteine */
const abs = (t, o = {}) => new Paragraph({
  children: [new TextRun({text: t, size: o.size || 20, bold: o.bold, italics: o.italics,
                          color: o.color || "1A1A1A", font: o.font})],
  spacing: {after: o.after !== undefined ? o.after : 120, before: o.before || 0},
  alignment: o.align,
  indent: o.indent,
});

/* Mehrere Läufe in einem Absatz, z. B. fett + normal gemischt. */
const mix = (laeufe, o = {}) => new Paragraph({
  children: laeufe.map(l => typeof l === 'string'
    ? new TextRun({text: l, size: o.size || 20, color: "1A1A1A"})
    : new TextRun({size: o.size || 20, color: l.color || "1A1A1A", ...l})),
  spacing: {after: o.after !== undefined ? o.after : 120, before: o.before || 0},
  indent: o.indent,
});

const h1 = t => new Paragraph({text: t, heading: HeadingLevel.HEADING_1,
  spacing: {before: 360, after: 180}, pageBreakBefore: false});
const h1neu = t => new Paragraph({text: t, heading: HeadingLevel.HEADING_1,
  spacing: {before: 0, after: 180}, pageBreakBefore: true});
const h2 = t => new Paragraph({text: t, heading: HeadingLevel.HEADING_2, spacing: {before: 280, after: 120}});
const h3 = t => new Paragraph({text: t, heading: HeadingLevel.HEADING_3, spacing: {before: 220, after: 100}});
const h4 = t => new Paragraph({text: t, heading: HeadingLevel.HEADING_4, spacing: {before: 180, after: 80}});

const leer = (n = 1) => Array.from({length: n},
  () => new Paragraph({children: [new TextRun("")], spacing: {after: 0}}));
const seitenumbruch = () => new Paragraph({children: [new PageBreak()]});

/* Aufzählung mit Gedankenstrich – bewusst ohne Word-Listenformat, damit die
   Einrückung in allen Zielformaten identisch bleibt. */
const punkt = (t, o = {}) => new Paragraph({
  children: [new TextRun({text: "–\t", size: 20, color: KOPF}),
             new TextRun({text: t, size: 20, color: "1A1A1A"})],
  tabStops: [{type: TabStopType.LEFT, position: 260}],
  indent: {left: 260, hanging: 260},
  spacing: {after: o.after !== undefined ? o.after : 60},
});
const punkte = (liste, o = {}) => liste.map(t => punkt(t, o));

/* Nummerierte Aufzählung mit fixer Nummer (stabil über alle Formate). */
const nrpunkt = (nr, t) => new Paragraph({
  children: [new TextRun({text: `${nr}\t`, size: 20, bold: true, color: KOPF}),
             new TextRun({text: t, size: 20, color: "1A1A1A"})],
  tabStops: [{type: TabStopType.LEFT, position: 420}],
  indent: {left: 420, hanging: 420},
  spacing: {after: 60},
});

/* Ankreuzfeld für Checklisten im Fliesstext. */
const kasten_leer = (t, o = {}) => new Paragraph({
  children: [new TextRun({text: "☐\t", size: 22, color: KOPF}),
             new TextRun({text: t, size: 20, color: "1A1A1A", bold: o.bold})],
  tabStops: [{type: TabStopType.LEFT, position: 300}],
  indent: {left: 300, hanging: 300},
  spacing: {after: o.after !== undefined ? o.after : 70},
});

/* Ausfüllzeile für Formulare: Bezeichnung, danach Punktlinie bis zum Rand. */
const feld = (bezeichnung, o = {}) => new Paragraph({
  children: [new TextRun({text: bezeichnung, size: 20, color: DUNKEL}),
             new TextRun({text: "\t", size: 20})],
  tabStops: [{type: TabStopType.RIGHT, position: o.breite || TOT, leader: "dot"}],
  spacing: {after: o.after !== undefined ? o.after : 170},
});
const felder = (liste, o = {}) => liste.map(t => feld(t, o));

/* ------------------------------------------------------------------ Tabellen */
function zelle(text, {w, kopf = false, bold = false, zebra = false, mono = false,
                      fuellen = false, fill, span, align} = {}) {
  const inhalt = Array.isArray(text) ? text : [String(text)];
  return new TableCell({
    width: {size: w, type: WidthType.DXA},
    columnSpan: span,
    shading: {type: ShadingType.CLEAR,
              fill: fill || (kopf ? KOPF : zebra ? ZEBRA : "FFFFFF"), color: "auto"},
    margins: {top: 70, bottom: 70, left: 100, right: 100},
    children: inhalt.map((t, i) => new Paragraph({
      children: [new TextRun({
        text: fuellen ? "" : String(t).replace(/^\*\*/, ""),
        bold: kopf || bold || String(t).startsWith("**"),
        size: 18,
        color: kopf ? "FFFFFF" : "1A1A1A",
        font: mono ? "Consolas" : undefined})],
      alignment: align,
      spacing: {after: i === inhalt.length - 1 ? 0 : 40}})),
  });
}

/* kopfzeile: Array von Titeln. zeilen: Array von Arrays.
   fuellspalten: Indizes, die als leere Ausfüllspalte gerendert werden. */
function tabelle(kopfzeile, zeilen, breiten, opt = {}) {
  const {fuellspalten = [], zebrastreifen = true} = opt;
  const rows = [new TableRow({
    tableHeader: true,
    children: kopfzeile.map((t, i) => zelle(t, {w: breiten[i], kopf: true})),
  })];
  zeilen.forEach((z, i) => {
    if (z.__gruppe !== undefined) {              // Gruppentitel über ganze Breite
      rows.push(new TableRow({children: [zelle(z.__gruppe, {
        w: breiten.reduce((a, b) => a + b, 0), span: breiten.length,
        bold: true, fill: TINT})]}));
      return;
    }
    rows.push(new TableRow({children: z.map((t, j) => zelle(t, {
      w: breiten[j],
      zebra: zebrastreifen && i % 2 === 1,
      fuellen: fuellspalten.includes(j) || (t === "☐" ? false : false),
    }))}));
  });
  return new Table({
    columnWidths: breiten,
    width: {size: breiten.reduce((a, b) => a + b, 0), type: WidthType.DXA},
    rows,
    borders: {
      top:    {style: BorderStyle.SINGLE, size: 4, color: LINIE},
      bottom: {style: BorderStyle.SINGLE, size: 4, color: LINIE},
      left:   {style: BorderStyle.SINGLE, size: 4, color: LINIE},
      right:  {style: BorderStyle.SINGLE, size: 4, color: LINIE},
      insideHorizontal: {style: BorderStyle.SINGLE, size: 2, color: FEIN},
      insideVertical:   {style: BorderStyle.SINGLE, size: 2, color: FEIN}},
  });
}

/* Gruppentitel-Zeile innerhalb einer Tabelle. */
const gruppe = titel => ({__gruppe: titel});

/* ------------------------------------------------------------------- Kästen */
function kastenBox(titel, zeilenTexte, {fill = TINT, rand = KOPF, titelfarbe = DUNKEL} = {}) {
  return new Table({
    columnWidths: [TOT], width: {size: TOT, type: WidthType.DXA},
    borders: {
      top:    {style: BorderStyle.SINGLE, size: 4,  color: rand},
      bottom: {style: BorderStyle.SINGLE, size: 4,  color: rand},
      left:   {style: BorderStyle.SINGLE, size: 18, color: rand},
      right:  {style: BorderStyle.SINGLE, size: 4,  color: rand},
      insideHorizontal: {style: BorderStyle.NONE}, insideVertical: {style: BorderStyle.NONE}},
    rows: [new TableRow({children: [new TableCell({
      width: {size: TOT, type: WidthType.DXA},
      shading: {type: ShadingType.CLEAR, fill, color: "auto"},
      margins: {top: 140, bottom: 140, left: 180, right: 160},
      children: [
        ...(titel ? [new Paragraph({
          children: [new TextRun({text: titel, bold: true, size: 19, color: titelfarbe})],
          spacing: {after: 70}})] : []),
        ...zeilenTexte.map(t => new Paragraph({
          children: [new TextRun({text: t, size: 19})], spacing: {after: 50}})),
      ]})]})],
  });
}
const info   = (titel, zeilen) => kastenBox(titel, zeilen);
const recht  = zeilen => kastenBox("Rechtliche Prüfung durch Notariat / Rechtsberatung erforderlich",
                 zeilen, {fill: GELB, rand: GOLD, titelfarbe: ROT});
const praxis = (titel, zeilen) => kastenBox(titel, zeilen,
                 {fill: GRUENF, rand: GRUEN, titelfarbe: GRUEN});

/* -------------------------------------------------------------- Titelblatt */
function titelblatt({marke, titel, untertitel, stand}) {
  return [
    new Paragraph({children: [new TextRun({text: marke, bold: true, size: 48, color: KOPF})],
      spacing: {after: 60}}),
    new Paragraph({children: [new TextRun({text: titel, size: 30, color: GRAU})],
      spacing: {after: untertitel ? 60 : 240}}),
    ...(untertitel ? [new Paragraph({children: [new TextRun({text: untertitel, size: 24, color: GRAU})],
      spacing: {after: 240}})] : []),
    new Paragraph({children: [new TextRun({text: stand, size: 19, color: HELL})],
      spacing: {after: 320},
      border: {bottom: {style: BorderStyle.SINGLE, size: 6, color: LINIE, space: 8}}}),
  ];
}

/* ------------------------------------------------------------------ Dokument */
function dokument({kinder, fusstext, querformat = false}) {
  return new Document({
    styles: {default: {
      document:  {run: {font: "Calibri", size: 20, color: "1A1A1A"}},
      heading1:  {run: {font: "Calibri", size: 30, bold: true, color: KOPF},
                  paragraph: {spacing: {before: 360, after: 180}}},
      heading2:  {run: {font: "Calibri", size: 25, bold: true, color: DUNKEL},
                  paragraph: {spacing: {before: 280, after: 120}}},
      heading3:  {run: {font: "Calibri", size: 22, bold: true, color: DUNKEL},
                  paragraph: {spacing: {before: 220, after: 100}}},
      heading4:  {run: {font: "Calibri", size: 20, bold: true, color: GRAU},
                  paragraph: {spacing: {before: 180, after: 80}}},
    }},
    sections: [{
      properties: {page: {
        margin: {top: RAND, right: RAND, bottom: convertMillimetersToTwip(18), left: RAND},
        size: querformat ? {orientation: d.PageOrientation.LANDSCAPE} : undefined}},
      footers: {default: new Footer({children: [new Paragraph({
        tabStops: [{type: TabStopType.RIGHT, position: TOT}],
        border: {top: {style: BorderStyle.SINGLE, size: 4, color: LINIE, space: 6}},
        children: [
          new TextRun({text: fusstext, size: 16, color: HELL}),
          new TextRun({text: "\t", size: 16}),
          new TextRun({children: ["Seite ", PageNumber.CURRENT, " von ", PageNumber.TOTAL_PAGES],
            size: 16, color: HELL})]})]})},
      children: kinder,
    }],
  });
}

async function schreiben(doc, pfad) {
  const fs = require('fs');
  fs.writeFileSync(pfad, await Packer.toBuffer(doc));
  return pfad;
}

module.exports = {
  d, KOPF, DUNKEL, TINT, ZEBRA, GRAU, HELL, LINIE, FEIN, ROT, GELB, GOLD, GRUEN, GRUENF, TOT,
  abs, mix, h1, h1neu, h2, h3, h4, leer, seitenumbruch, punkt, punkte, nrpunkt,
  kasten_leer, feld, felder, zelle, tabelle, gruppe, info, recht, praxis,
  titelblatt, dokument, schreiben, AlignmentType, HeadingLevel,
};
