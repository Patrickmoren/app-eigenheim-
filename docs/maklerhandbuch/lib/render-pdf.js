/* Setzt die Blockbeschreibung aus lib/blocks.js in ein .pdf um.
   Eigene Satzlogik: Tabellen mit Zeilenumbruch in der Zelle, Seitenumbruch
   mit wiederholter Kopfzeile, Kästen mit farbigem Rand. */
const PDFDocument = require('pdfkit');
const fs = require('fs');

const KOPF = '#0F5C6E', DUNKEL = '#0B4655', TINT = '#EDF1F2', ZEBRA = '#F7F9F9',
      GRAU = '#5A6B76', HELL = '#85939C', LINIE = '#C6D0D5', FEIN = '#DFE5E8',
      ROT = '#8C2F2F', GELB = '#FBF3E2', GOLD = '#8A6A1F',
      GRUEN = '#1F6B4A', GRUENF = '#EAF3EE', TEXT = '#1A1A1A';

const mm = n => n * 2.834645669;
const RAND = mm(20), RAND_U = mm(18);
const A4 = [595.28, 841.89];
const BREITE = A4[0] - 2 * RAND;          // 481.9 pt nutzbar
const SKALA = BREITE / 9600;              // DXA der Blöcke → pt

const REG = 'Helvetica', BOLD = 'Helvetica-Bold', OBL = 'Helvetica-Oblique',
      MONO = 'Courier';

/* Die PDF-Standardschriften kennen nur den WinAnsi-Zeichenvorrat. Zeichen
   ausserhalb davon werden hier ersetzt; lib/pruefen.js bricht den Bau ab,
   wenn ein unbekanntes Zeichen auftritt. */
const ERSATZ = {'\u2192': '>', '\u2193': 'v', '\u2610': '[ ]', '\u2611': '[x]'};
const ANKREUZ = '\u2610';
const wa = t => String(t).replace(/[\u2190-\u21FF\u2600-\u26FF]/g, c => ERSATZ[c] || '?');

class Satz {
  constructor(fusstext) {
    this.doc = new PDFDocument({size: 'A4', margins:
      {top: RAND, right: RAND, bottom: RAND_U, left: RAND}, autoFirstPage: false,
      bufferPages: true});
    this.fusstext = fusstext;
    this.gesetzteSeiten = 0;   // vom Satz angeforderte Seiten
    this.neueSeite();
  }
  get u() { return A4[1] - RAND_U - 16; }     // untere Grenze des Satzspiegels

  neueSeite() {
    this.doc.addPage();
    this.gesetzteSeiten++;
    this.y = RAND;
  }
  platz(h) {
    if (this.y + h > this.u) this.neueSeite();
  }

  /* --------------------------------------------------------------- Text */
  txt(text, {font = REG, size = 9, color = TEXT, x = RAND, breite = BREITE,
             after = 4, align = 'left', indent = 0} = {}) {
    const d = this.doc;
    d.font(font).fontSize(size).fillColor(color);
    const w = breite - indent;
    const s = wa(text);
    const h = d.heightOfString(s, {width: w, align});
    /* Absatz notfalls umbrechen: passt er nicht, neue Seite */
    if (this.y + h > this.u) this.neueSeite();
    d.text(s, x + indent, this.y, {width: w, align});
    this.y += h + after;
  }

  /* Mehrere Läufe in einer Zeile (fett + normal gemischt) */
  laeufe(parts, {size = 9, after = 4} = {}) {
    const d = this.doc;
    const norm = parts.map(p => typeof p === 'string' ? {text: wa(p)} : {...p, text: wa(p.text)});
    /* Höhe schätzen: gesamten Text als einen Block messen */
    const ganz = norm.map(p => p.text).join('');
    d.font(REG).fontSize(size);
    const h = d.heightOfString(ganz, {width: BREITE});
    if (this.y + h > this.u) this.neueSeite();
    let erster = true;
    norm.forEach(p => {
      d.font(p.bold ? BOLD : p.italics ? OBL : REG).fontSize(size)
       .fillColor(p.color || TEXT);
      if (erster) { d.text(p.text, RAND, this.y, {width: BREITE, continued: true}); erster = false; }
      else d.text(p.text, {continued: true});
    });
    d.text('', {continued: false});
    this.y = Math.max(this.y + h, this.doc.y) + after;
  }

  ueber(text, stufe) {
    const spez = {1: {size: 16, font: BOLD, color: KOPF, vor: 0,  nach: 9},
                  2: {size: 13, font: BOLD, color: DUNKEL, vor: 12, nach: 6},
                  3: {size: 11, font: BOLD, color: DUNKEL, vor: 10, nach: 4},
                  4: {size: 10, font: BOLD, color: GRAU,   vor: 8,  nach: 3}}[stufe];
    if (stufe === 1) this.neueSeite();
    else {
      this.doc.font(spez.font).fontSize(spez.size);
      const h = this.doc.heightOfString(text, {width: BREITE});
      /* Überschrift nie als letzte Zeile einer Seite */
      if (this.y + spez.vor + h + 28 > this.u) this.neueSeite();
      this.y += spez.vor;
    }
    this.txt(text, {font: spez.font, size: spez.size, color: spez.color, after: spez.nach});
    if (stufe === 1) {
      this.doc.moveTo(RAND, this.y - 4).lineTo(RAND + BREITE, this.y - 4)
        .lineWidth(1).strokeColor(LINIE).stroke();
      this.y += 6;
    }
  }

  liste(items, {marke = '–', nr = null, feld = false} = {}) {
    const d = this.doc;
    const einzug = feld ? 0 : 14;
    items.forEach((it, i) => {
      const text = wa(nr ? it[1] : it);
      const zeichen = wa(nr ? it[0] : marke);
      const mb = nr ? 20 : 14;
      d.font(REG).fontSize(9);
      const h = d.heightOfString(String(text), {width: BREITE - mb});
      if (this.y + h > this.u) this.neueSeite();
      d.font(nr ? BOLD : REG).fontSize(feld ? 11 : 9)
       .fillColor(feld ? KOPF : KOPF)
       .text(zeichen, RAND, this.y, {width: mb});
      d.font(REG).fontSize(9).fillColor(TEXT)
       .text(String(text), RAND + mb, this.y, {width: BREITE - mb});
      this.y += h + 3;
    });
    this.y += 3;
  }

  /* Ankreuzfelder */
  ankreuzen(items) {
    const d = this.doc;
    items.forEach(t0 => {
      const t = wa(t0);
      d.font(REG).fontSize(9);
      const h = Math.max(d.heightOfString(t, {width: BREITE - 16}), 10);
      if (this.y + h > this.u) this.neueSeite();
      d.rect(RAND + 1, this.y + 1, 7.5, 7.5).lineWidth(0.7).strokeColor(KOPF).stroke();
      d.fillColor(TEXT).text(t, RAND + 16, this.y, {width: BREITE - 16});
      this.y += h + 4;
    });
    this.y += 3;
  }

  /* Ausfüllzeile: Bezeichnung, danach Punktlinie bis zum Rand */
  feldzeile(items) {
    const d = this.doc;
    items.forEach(t0 => {
      const t = wa(t0);
      if (this.y + 20 > this.u) this.neueSeite();
      d.font(REG).fontSize(9).fillColor(DUNKEL);
      const tw = t ? Math.min(d.widthOfString(t) + 6, BREITE - 60) : 0;
      if (t) d.text(t, RAND, this.y, {width: tw, lineBreak: false});
      d.save().dash(1, {space: 2})
        .moveTo(RAND + tw, this.y + 10).lineTo(RAND + BREITE, this.y + 10)
        .lineWidth(0.5).strokeColor(LINIE).stroke().restore();
      this.y += 19;
    });
    this.y += 3;
  }

  monospace(zeilen) {
    zeilen.forEach(z => {
      if (this.y + 12 > this.u) this.neueSeite();
      this.doc.font(MONO).fontSize(8.5).fillColor(TEXT)
        .text(wa(z), RAND, this.y, {width: BREITE});
      this.y += 11;
    });
    this.y += 4;
  }

  /* --------------------------------------------------------------- Kasten */
  kasten(art, titel, zeilen) {
    const d = this.doc;
    const f = {info: {fill: TINT, rand: KOPF, tf: DUNKEL},
               recht: {fill: GELB, rand: GOLD, tf: ROT},
               praxis: {fill: GRUENF, rand: GRUEN, tf: GRUEN}}[art];
    const pad = 8, iw = BREITE - 2 * pad - 4;
    /* Höhe vorab messen */
    let h = pad * 2;
    const tt = titel ? wa(titel) : '';
    const zz = zeilen.map(wa);
    if (tt) { d.font(BOLD).fontSize(9); h += d.heightOfString(tt, {width: iw}) + 4; }
    d.font(REG).fontSize(8.8);
    const hs = zz.map(z => d.heightOfString(z, {width: iw}));
    h += hs.reduce((a, b) => a + b + 3, 0);
    if (this.y + h > this.u) this.neueSeite();
    const y0 = this.y;
    d.rect(RAND, y0, BREITE, h).fill(f.fill);
    d.rect(RAND, y0, 3.2, h).fill(f.rand);
    let yy = y0 + pad;
    if (tt) {
      d.font(BOLD).fontSize(9).fillColor(f.tf).text(tt, RAND + pad + 4, yy, {width: iw});
      yy += d.heightOfString(tt, {width: iw}) + 4;
    }
    zz.forEach((z, i) => {
      d.font(REG).fontSize(8.8).fillColor(TEXT).text(z, RAND + pad + 4, yy, {width: iw});
      yy += hs[i] + 3;
    });
    this.y = y0 + h + 8;
  }

  /* -------------------------------------------------------------- Tabelle */
  tabelle(kopf, zeilen, breitenDxa) {
    const d = this.doc;
    const w = breitenDxa.map(b => b * SKALA);
    const sum = w.reduce((a, b) => a + b, 0);
    /* Rundungsdifferenz auf die letzte Spalte legen */
    w[w.length - 1] += BREITE - sum;
    const padX = 3.2, padY = 3.4;

    const zellHoehe = (texte, font, size) => {
      d.font(font).fontSize(size);
      return Math.max(...texte.map((t, i) =>
        d.heightOfString(wa(t).replace(/^\*\*/, ''), {width: w[i] - 2 * padX}))) + 2 * padY;
    };

    const kopfZeichnen = () => {
      const h = zellHoehe(kopf, BOLD, 7.6);
      d.rect(RAND, this.y, BREITE, h).fill(KOPF);
      let x = RAND;
      kopf.forEach((t, i) => {
        if (String(t) === ANKREUZ) {
          d.rect(x + padX, this.y + padY + 0.6, 6, 6).lineWidth(0.6).strokeColor('#FFFFFF').stroke();
        } else {
          d.font(BOLD).fontSize(7.6).fillColor('#FFFFFF')
           .text(wa(t), x + padX, this.y + padY, {width: w[i] - 2 * padX});
        }
        x += w[i];
      });
      this.y += h;
      return h;
    };

    if (this.y + 40 > this.u) this.neueSeite();
    kopfZeichnen();

    let zebra = false;
    zeilen.forEach(z => {
      /* Gruppenzeile über die ganze Breite */
      if (z && z.__gruppe !== undefined) {
        d.font(BOLD).fontSize(7.8);
        const gt = wa(z.__gruppe);
        const h = d.heightOfString(gt, {width: BREITE - 2 * padX}) + 2 * padY;
        if (this.y + h > this.u) { this.neueSeite(); kopfZeichnen(); }
        d.rect(RAND, this.y, BREITE, h).fill(TINT);
        d.font(BOLD).fontSize(7.8).fillColor(DUNKEL)
         .text(gt, RAND + padX, this.y + padY, {width: BREITE - 2 * padX});
        d.rect(RAND, this.y, BREITE, h).lineWidth(0.4).strokeColor(FEIN).stroke();
        this.y += h;
        zebra = false;
        return;
      }
      const texte = z.map(t => String(t === undefined || t === null ? '' : t));
      const h = zellHoehe(texte, REG, 7.8);
      if (this.y + h > this.u) { this.neueSeite(); kopfZeichnen(); zebra = false; }
      const y0 = this.y;
      if (zebra) d.rect(RAND, y0, BREITE, h).fill(ZEBRA);
      let x = RAND;
      texte.forEach((t, i) => {
        if (t === ANKREUZ) {
          d.rect(x + padX + 1, y0 + padY + 0.6, 7, 7)
           .lineWidth(0.6).strokeColor(KOPF).stroke();
        } else {
          const fett = t.startsWith('**');
          d.font(fett ? BOLD : REG).fontSize(7.8).fillColor(TEXT)
           .text(wa(t).replace(/^\*\*/, ''), x + padX, y0 + padY, {width: w[i] - 2 * padX});
        }
        x += w[i];
      });
      /* Gitter */
      d.lineWidth(0.4).strokeColor(FEIN);
      x = RAND;
      w.forEach(cw => { d.moveTo(x, y0).lineTo(x, y0 + h).stroke(); x += cw; });
      d.moveTo(RAND + BREITE, y0).lineTo(RAND + BREITE, y0 + h).stroke();
      d.moveTo(RAND, y0 + h).lineTo(RAND + BREITE, y0 + h).stroke();
      this.y = y0 + h;
      zebra = !zebra;
    });
    this.y += 8;
  }

  /* ----------------------------------------------------------------- Flow */
  flow(schritte) {
    const d = this.doc;
    schritte.forEach(([name, phase], i) => {
      if (this.y + 34 > this.u) this.neueSeite();
      const bw = 170, x = RAND + (BREITE - bw) / 2;
      d.roundedRect(x, this.y, bw, 19, 3).fill(TINT);
      d.roundedRect(x, this.y, bw, 19, 3).lineWidth(0.6).strokeColor(KOPF).stroke();
      d.font(BOLD).fontSize(9).fillColor(DUNKEL)
       .text(wa(name), x, this.y + 5.5, {width: bw, align: 'center'});
      d.font(REG).fontSize(7.5).fillColor(GRAU)
       .text(wa(phase), x + bw + 8, this.y + 6.5, {width: 80});
      this.y += 19;
      if (i < schritte.length - 1) {
        /* Pfeil zeichnen – die PDF-Standardschriften kennen kein U+2193 */
        const mx = RAND + BREITE / 2, y1 = this.y + 2, y2 = this.y + 12;
        d.moveTo(mx, y1).lineTo(mx, y2 - 3).lineWidth(1).strokeColor(KOPF).stroke();
        d.moveTo(mx - 3.2, y2 - 4).lineTo(mx, y2).lineTo(mx + 3.2, y2 - 4)
         .fillColor(KOPF).fill();
        this.y += 16;
      }
    });
    this.y += 8;
  }

  /* ----------------------------------------------------------- Titelblatt */
  titelblatt({marke, titel, untertitel, stand}) {
    const d = this.doc;
    this.y = RAND + 40;
    d.font(BOLD).fontSize(30).fillColor(KOPF).text(wa(marke), RAND, this.y, {width: BREITE});
    this.y = d.y + 4;
    d.font(REG).fontSize(19).fillColor(GRAU).text(wa(titel), RAND, this.y, {width: BREITE});
    this.y = d.y + 4;
    if (untertitel) {
      d.font(REG).fontSize(13).fillColor(GRAU).text(wa(untertitel), RAND, this.y, {width: BREITE});
      this.y = d.y + 4;
    }
    this.y += 10;
    d.font(REG).fontSize(9).fillColor(HELL).text(wa(stand), RAND, this.y, {width: BREITE});
    this.y = d.y + 8;
    d.moveTo(RAND, this.y).lineTo(RAND + BREITE, this.y).lineWidth(1).strokeColor(LINIE).stroke();
    this.y += 16;
  }

  /* -------------------------------------------------------------- Fusszeile */
  /* pdfkit fügt für Text ausserhalb des Satzspiegels automatisch Seiten an.
     Weicht die Zahl der Seiten im Dokument von der Zahl der vom Satz
     angeforderten Seiten ab, ist genau das passiert. */
  seitenPruefen() {
    const ist = this.doc.bufferedPageRange().count;
    if (ist !== this.gesetzteSeiten) {
      throw new Error(`Seitenzahl weicht ab: gesetzt ${this.gesetzteSeiten}, `
        + `im Dokument ${ist}. Ursache ist in der Regel Text ausserhalb des `
        + `Satzspiegels, für den pdfkit eine Seite anfügt.`);
    }
  }

  fusszeilen() {
    const d = this.doc;
    const anz = d.bufferedPageRange();
    for (let i = anz.start; i < anz.start + anz.count; i++) {
      d.switchToPage(i);
      /* Die Fusszeile liegt unterhalb des Satzspiegels. pdfkit fügt für Text
         ausserhalb des Textbereichs automatisch eine Seite an – deshalb den
         unteren Rand dieser Seite für den Schreibvorgang aufheben. */
      d.page.margins.bottom = 0;
      const y = A4[1] - RAND_U + 6;
      d.moveTo(RAND, y - 5).lineTo(RAND + BREITE, y - 5)
       .lineWidth(0.5).strokeColor(LINIE).stroke();
      d.font(REG).fontSize(7).fillColor(HELL)
       .text(wa(this.fusstext), RAND, y, {width: BREITE * 0.75, lineBreak: false});
      d.text(`Seite ${i - anz.start + 1} von ${anz.count}`,
        RAND + BREITE * 0.75, y, {width: BREITE * 0.25, align: 'right', lineBreak: false});
    }
  }
}

function schreibePdf({bloecke, pfad, fusstext}) {
  return new Promise((erfuellt, abgelehnt) => {
    const s = new Satz(fusstext);
    bloecke.forEach(b => {
      switch (b.t) {
        case 'titel': s.titelblatt(b); break;
        case 'h1': s.ueber(b.text, 1); break;
        case 'h2': s.ueber(b.text, 2); break;
        case 'h3': s.ueber(b.text, 3); break;
        case 'h4': s.ueber(b.text, 4); break;
        case 'p': s.txt(b.text, {font: b.bold ? BOLD : b.italics ? OBL : REG}); break;
        case 'mix': s.laeufe(b.parts); break;
        case 'ul': s.liste(b.items); break;
        case 'ol': s.liste(b.items, {nr: true}); break;
        case 'check': s.ankreuzen(b.items); break;
        case 'feld': s.feldzeile(b.items); break;
        case 'linien': s.feldzeile(Array.from({length: b.n}, () => '')); break;
        case 'tab': s.tabelle(b.kopf, b.zeilen, b.breiten); break;
        case 'box': s.kasten(b.art, b.titel, b.zeilen); break;
        case 'leer': s.y += 7 * (b.n || 1); break;
        case 'seite': s.neueSeite(); break;
        case 'mono': s.monospace(b.zeilen); break;
        case 'flow': s.flow(b.schritte); break;
        default: return abgelehnt(new Error('Unbekannter Blocktyp: ' + b.t));
      }
    });
    s.fusszeilen();
    try { s.seitenPruefen(); } catch (e) { return abgelehnt(e); }
    const strom = fs.createWriteStream(pfad);
    strom.on('finish', () => erfuellt(pfad));
    strom.on('error', abgelehnt);
    s.doc.pipe(strom);
    s.doc.end();
  });
}

module.exports = {schreibePdf, ERSATZ};
