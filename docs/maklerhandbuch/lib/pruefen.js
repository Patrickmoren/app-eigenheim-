/* Prüft die Querverweise zwischen den Inhaltsmodulen. Wird von build.js vor
   dem Erzeugen der Dateien aufgerufen; ein Fehler bricht den Bau ab. */

const {PHASEN}    = require('../inhalt/phasen.js');
const {posten: dokPosten} = require('../inhalt/dokumente.js');
const {posten: rechtPosten} = require('../inhalt/recht.js');
const {VORLAGEN}  = require('../inhalt/kommunikation.js');
const {posten: abschlussPosten} = require('../inhalt/abschluss.js');
const {AUFNAHME}  = require('../inhalt/objektaufnahme.js');
const B           = require('../inhalt/bausteine.js');
const F           = require('../inhalt/formulare.js');

const STUFEN = ['Pflicht', 'empfehlenswert', 'situationsabhängig'];

function pruefen() {
  const f = [];
  const rechtK   = new Set(rechtPosten().map(r => r.k));
  const vorlageK = new Set(VORLAGEN.map(v => v.k));
  const phasenNr = new Set(PHASEN.map(p => p.nr));

  /* Phasen: Nummern lückenlos, alle Rubriken gefüllt */
  PHASEN.forEach((p, i) => {
    if (p.nr !== i + 1) f.push(`Phase an Position ${i + 1} trägt die Nummer ${p.nr}`);
    ['ziel', 'dauer', 'verantwortung', 'ergebnis'].forEach(k => {
      if (!p[k]) f.push(`Phase ${p.nr}: Feld «${k}» fehlt`);
    });
    ['makler', 'eigentuemer', 'unterlagen', 'pruefungen', 'kommunikation', 'weiter'].forEach(k => {
      if (!Array.isArray(p[k]) || !p[k].length) f.push(`Phase ${p.nr}: Liste «${k}» ist leer`);
    });
    (p.recht || []).forEach(k => {
      if (!rechtK.has(k)) f.push(`Phase ${p.nr}: unbekannter Rechtsverweis ${k}`);
    });
    /* Kommunikationsverweise K… müssen als Vorlage existieren */
    p.kommunikation.forEach(t => {
      const m = String(t).match(/\bK(\d+)\b/);
      if (m && !vorlageK.has('K' + m[1])) {
        f.push(`Phase ${p.nr}: unbekannte Kommunikationsvorlage K${m[1]}`);
      }
    });
  });

  /* Vorlagen: Phase muss existieren, Text und Betreff gefüllt */
  VORLAGEN.forEach(v => {
    if (!phasenNr.has(v.phase)) f.push(`Vorlage ${v.k}: unbekannte Phase ${v.phase}`);
    if (!v.betreff) f.push(`Vorlage ${v.k}: Betreff fehlt`);
    if (!v.text || !v.text.length) f.push(`Vorlage ${v.k}: Text fehlt`);
    if (!v.hinweis) f.push(`Vorlage ${v.k}: Hinweis fehlt`);
  });
  /* Jede Vorlage muss von mindestens einer Phase aufgerufen werden */
  const aufgerufen = new Set();
  PHASEN.forEach(p => p.kommunikation.forEach(t => {
    const m = String(t).match(/\bK(\d+)\b/);
    if (m) aufgerufen.add('K' + m[1]);
  }));
  VORLAGEN.forEach(v => {
    if (!aufgerufen.has(v.k)) f.push(`Vorlage ${v.k} wird von keiner Phase aufgerufen`);
  });

  /* Dokumenten-Checkliste: Nummern eindeutig, Stufe gültig, Verweise bekannt */
  const dnr = new Set();
  dokPosten().forEach(d => {
    if (dnr.has(d.nr)) f.push(`Dokument ${d.nr}: Nummer doppelt`);
    dnr.add(d.nr);
    if (!STUFEN.includes(d.stufe)) f.push(`Dokument ${d.nr}: unbekannte Stufe «${d.stufe}»`);
    if (!d.quelle) f.push(`Dokument ${d.nr}: Bezugsquelle fehlt`);
    if (!d.bemerkung) f.push(`Dokument ${d.nr}: Hinweis fehlt`);
    (d.recht || '').split(' ').filter(Boolean).forEach(k => {
      if (!rechtK.has(k)) f.push(`Dokument ${d.nr}: unbekannter Rechtsverweis ${k}`);
    });
  });

  /* Abschlusscheckliste */
  abschlussPosten().forEach(p => {
    if (!phasenNr.has(p.phase)) f.push(`Abschlussposition «${p.pos}»: unbekannte Phase ${p.phase}`);
    if (!p.nachweis) f.push(`Abschlussposition «${p.pos}»: Nachweis fehlt`);
    (p.recht || '').split(' ').filter(Boolean).forEach(k => {
      if (!rechtK.has(k)) f.push(`Abschlussposition «${p.pos}»: unbekannter Rechtsverweis ${k}`);
    });
  });

  /* Rechtsregister: Nummern eindeutig, Felder gefüllt, Kennzeichen gültig */
  const rnr = new Set();
  rechtPosten().forEach(r => {
    if (rnr.has(r.k)) f.push(`Register ${r.k}: Nummer doppelt`);
    rnr.add(r.k);
    ['thema', 'grundlage', 'kern', 'praxis'].forEach(k => {
      if (!r[k]) f.push(`Register ${r.k}: Feld «${k}» fehlt`);
    });
    (r.flag || '').split(' ').filter(Boolean).forEach(fl => {
      if (!['RP', 'KA', 'GW'].includes(fl)) f.push(`Register ${r.k}: unbekanntes Kennzeichen ${fl}`);
    });
  });

  /* Strukturbausteine: erwartete Anzahl, damit Kürzungen auffallen */
  const soll = [
    ['Dossierabschnitte', B.DOSSIER.length, 23],
    ['Mandatsziffern', B.MANDAT.length, 24],
    ['Ordner', B.ORDNER.length, 17],
    ['Aufnahmeblöcke', AUFNAHME.length, 16],
    ['Formulare: Erstgesprächsblöcke', F.ERSTGESPRAECH.length, 6],
    ['Reservationsziffern', F.RESERVATION.length, 10],
    ['Übergabeblöcke', F.UEBERGABE.length, 11],
  ];
  soll.forEach(([name, ist, erwartet]) => {
    if (ist !== erwartet) f.push(`${name}: ${ist} statt ${erwartet}`);
  });
  /* Dossierabschnitte müssen von 1 bis 23 durchnummeriert sein */
  B.DOSSIER.forEach((d, i) => {
    if (d.nr !== i + 1) f.push(`Dossierabschnitt an Position ${i + 1} trägt die Nummer ${d.nr}`);
  });

  return f;
}

/* Die PDF-Standardschriften kennen nur WinAnsi. Zeichen ausserhalb davon
   muessen in lib/render-pdf.js eine Ersetzung haben, sonst wuerden sie im PDF
   als Platzhalter erscheinen. */
const WINANSI = /[\x20-\x7E\u00A0-\u00FF\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u2039\u203A\u2013\u2014\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u20AC\u2122\n\t]/;
const {ERSATZ} = require('./render-pdf.js');

function zeichenPruefen(bloecke, wo) {
  const f = [], gesehen = new Set();
  const scan = x => {
    if (typeof x === 'string') {
      for (const c of x) {
        if (WINANSI.test(c) || ERSATZ[c] || gesehen.has(c)) continue;
        gesehen.add(c);
        f.push(`${wo}: Zeichen ${JSON.stringify(c)} (U+`
          + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
          + ') hat keine Ersetzung fuer das PDF');
      }
      return;
    }
    if (Array.isArray(x)) { x.forEach(scan); return; }
    if (x && typeof x === 'object') Object.values(x).forEach(scan);
  };
  scan(bloecke);
  return f;
}

module.exports = {pruefen, zeichenPruefen};
