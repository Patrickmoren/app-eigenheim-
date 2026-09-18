/* Setzt die Blockbeschreibung aus lib/blocks.js in ein .docx um. */
const S = require('./stil.js');
const d = S.d;
const {Paragraph, TextRun, BorderStyle, TabStopType, AlignmentType} = d;

function bloeckeZuKindern(bloecke) {
  const out = [];
  const push = (...x) => x.flat().forEach(e => out.push(e));

  bloecke.forEach(b => {
    switch (b.t) {
      case 'titel':
        push(S.titelblatt(b)); break;
      case 'h1':
        push(b.neueSeite ? S.h1neu(b.text) : S.h1(b.text)); break;
      case 'h2': push(S.h2(b.text)); break;
      case 'h3': push(S.h3(b.text)); break;
      case 'h4': push(S.h4(b.text)); break;
      case 'p':
        push(S.abs(b.text, {bold: b.bold, italics: b.italics, after: b.after})); break;
      case 'mix':
        push(S.mix(b.parts)); break;
      case 'ul':
        push(S.punkte(b.items)); break;
      case 'ol':
        push(b.items.map(([nr, t]) => S.nrpunkt(nr, t))); break;
      case 'check':
        push(b.items.map(t => S.kasten_leer(t))); break;
      case 'feld':
        push(b.items.map(t => S.feld(t))); break;
      case 'linien':
        push(Array.from({length: b.n}, () => S.feld('')));
        break;
      case 'tab':
        push(S.tabelle(b.kopf, b.zeilen, b.breiten)); break;
      case 'box':
        push(b.art === 'recht' ? S.recht(b.zeilen)
           : b.art === 'praxis' ? S.praxis(b.titel, b.zeilen)
           : S.info(b.titel, b.zeilen));
        break;
      case 'leer': push(S.leer(b.n)); break;
      case 'seite': push(S.seitenumbruch()); break;
      case 'mono':
        push(b.zeilen.map(z => new Paragraph({
          children: [new TextRun({text: z, font: 'Consolas', size: 18, color: '1A1A1A'})],
          spacing: {after: 40}})));
        break;
      case 'flow':
        b.schritte.forEach(([name, phase], i) => {
          push(new Paragraph({
            children: [new TextRun({text: name, bold: true, size: 22, color: S.DUNKEL}),
                       new TextRun({text: '   ·   ' + phase, size: 19, color: S.GRAU})],
            alignment: AlignmentType.CENTER, spacing: {after: 40}}));
          if (i < b.schritte.length - 1) {
            push(new Paragraph({children: [new TextRun({text: '↓', size: 24, color: S.KOPF})],
              alignment: AlignmentType.CENTER, spacing: {after: 40}}));
          }
        });
        break;
      default:
        throw new Error('Unbekannter Blocktyp: ' + b.t);
    }
  });
  return out;
}

async function schreibeDocx({bloecke, pfad, fusstext}) {
  const doc = S.dokument({kinder: bloeckeZuKindern(bloecke), fusstext});
  return S.schreiben(doc, pfad);
}

module.exports = {bloeckeZuKindern, schreibeDocx};
