// Schaeppi Design-System für Factsheet und NDA.
//
// Abgeleitet aus der Verkaufsdokumentation Neumattstrasse 15 (InDesign):
//   Navy  #1B3F64  Flächen, Titel, Überschriften
//   Blau  #1A9EDA  Logo auf hellem Grund, sparsame Akzente
//   Crème #F9F9F1  helle Flächen (Rückseite, Kontaktseite)
//   Text  #231F20  Fliesstext,  Grau #585857 Nebentext
//   IBM Plex Sans Regular für Titel/Überschriften, Arial für Fliesstext und Tabellen.
//
// Alle Masse in Punkt (pt). Das DOCX und die HTML-Vorschau lesen ausschliesslich diese Werte,
// deshalb ist das Layout für jedes Objekt identisch – nur die Inhalte ändern sich.

export const COMPANY = {
  name: 'Schaeppi Grundstücke AG',
  street: 'Münchensteinerstrasse 117',
  zipCity: '4053 Basel',
  web: 'www.schaeppi.ch',
  jurisdiction: 'Basel',
};

export const COLORS = {
  navy: '1B3F64',
  blue: '1A9EDA',
  cream: 'F9F9F1',
  text: '231F20',
  muted: '585857',
  line: 'D8D6CB',
  bandLabel: 'A9C4DE',
  white: 'FFFFFF',
};

export const FONTS = {
  heading: 'IBM Plex Sans',
  body: 'Arial',
};

export const MM = 72 / 25.4; // pt pro mm

export const PAGE = {
  width: 595.3,
  height: 841.9,
  marginTop: 62,     // 22 mm
  marginBottom: 51,  // 18 mm
  marginLeft: 51,    // 18 mm
  marginRight: 51,
  headerDistance: 28,
  footerDistance: 25,
};
PAGE.contentWidth = PAGE.width - PAGE.marginLeft - PAGE.marginRight;   // 493.3 pt = 174 mm
PAGE.contentHeight = PAGE.height - PAGE.marginTop - PAGE.marginBottom; // 728.9 pt

// Typografie: size = Schriftgrad, line = exakter Zeilenabstand, before/after = Absatzabstände.
// Untergrenze Fliesstext 9 pt – Kürzungen erfolgen über Inhalt und Abstände, nie über die Schrift.
export const TYPE = {
  bandLabel: { font: 'body', size: 7.5, line: 10, before: 0, after: 4, bold: true, caps: true, spacing: 1.2, color: 'bandLabel' },
  title:     { font: 'heading', size: 20, line: 24, before: 0, after: 2, color: 'white' },
  subtitle:  { font: 'heading', size: 11, line: 14, before: 0, after: 0, color: 'white' },
  kpiValue:  { font: 'heading', size: 12.5, line: 15, before: 0, after: 0, color: 'navy' },
  kpiLabel:  { font: 'body', size: 7, line: 9, before: 0, after: 0, color: 'muted' },
  h1:        { font: 'heading', size: 13, line: 16, before: 12, after: 5, color: 'navy', rule: true },
  h2:        { font: 'body', size: 8.5, line: 11, before: 6, after: 1.5, bold: true, color: 'navy' },
  body:      { font: 'body', size: 9, line: 12.5, before: 0, after: 0, color: 'text' },
  argTitle:  { font: 'body', size: 9, line: 12, before: 7, after: 1, bold: true, color: 'navy' },
  argText:   { font: 'body', size: 9, line: 12.5, before: 0, after: 0, color: 'text' },
  contactH:  { font: 'heading', size: 11, line: 14, before: 14, after: 3, color: 'navy' },
  contact:   { font: 'body', size: 8.5, line: 11.5, before: 0, after: 0, color: 'text' },
  cellLabel: { font: 'body', size: 8.5, line: 11.5, before: 0, after: 0, color: 'muted' },
  cell:      { font: 'body', size: 8.5, line: 11.5, before: 0, after: 0, color: 'text' },
  cellHead:  { font: 'body', size: 8, line: 11, before: 0, after: 0, bold: true, color: 'white' },
  step:      { font: 'body', size: 9, line: 12.5, before: 0, after: 2, color: 'text' },
  caption:   { font: 'body', size: 7.5, line: 10, before: 2, after: 0, color: 'muted' },
  small:     { font: 'body', size: 7, line: 9, before: 10, after: 0, color: 'muted' },
  header:    { font: 'body', size: 7, line: 9, before: 0, after: 0, bold: true, caps: true, spacing: 1.5, color: 'navy' },
  footer:    { font: 'body', size: 7, line: 9, before: 0, after: 0, color: 'muted' },
};

// Tabellen- und Flächenabstände
export const BOX = {
  band: { padTop: 16, padBottom: 14, padX: 16 },
  kpi: { padTop: 7, padBottom: 7, padX: 10, gapAfter: 10 },
  kv: { padY: 3, padX: 4, labelShare: 0.31, labelShareNarrow: 0.44, border: 0.5 },
  table: { padY: 2.5, padX: 4, border: 0.5 },
  columns: { leftShare: 0.6, gutter: 16, rightPad: 12 },
  split: { gutter: 16 },
  image: { gapAfter: 10 },
  imageRow: { gap: 12 },
  ruleGap: 2.5, // Abstand Überschrift–Linie inkl. Linienstärke
};

// Bildhöhen je Verdichtungsstufe (pt)
export const IMAGE_HEIGHT = {
  cover: 204,     // 72 mm
  coverCompact: 164, // 58 mm
  row: 150,       // 53 mm
  rowCompact: 120,
};

// Zeichenbudgets für KI-Texte (Zeichen inkl. Leerzeichen). Werden im Prompt vorgegeben
// und beim Verdichten als Obergrenzen verwendet.
export const BUDGET = {
  title: 60,
  ausgangslage: 330,
  objektLage: 420,
  baujahrInvestitionen: 330,
  einheiten: 300,
  argumentTitle: 45,
  argumentText: 190,
  argumentsMax: 5,
  argumentsMin: 3,
};

export const LOGO = {
  header: { file: 'schaeppi-1zeilig-navy.png', widthPt: 150 },
  nda: { file: 'schaeppi-2zeilig-navy.png', widthPt: 110 },
};
