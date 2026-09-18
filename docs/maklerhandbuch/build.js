#!/usr/bin/env node
/* Erzeugt alle Dateien des Makler-Handbuchs aus den Inhaltsmodulen.
   Aufruf: node build.js
   Die Dateien werden aus den Quellen erzeugt und nicht von Hand bearbeitet –
   Rückmeldungen fliessen in inhalt/ zurück, damit die Nummerierung stabil bleibt. */

const fs = require('fs');
const path = require('path');

const {schreibeDocx} = require('./lib/render-docx.js');
const {schreibePdf}  = require('./lib/render-pdf.js');

const handbuch      = require('./inhalt/handbuch.js');
const dokFormulare  = require('./inhalt/dok-formulare.js');
const dokDossier    = require('./inhalt/dok-dossier.js');
const dokKommunik   = require('./inhalt/dok-kommunikation.js');
const mappen        = require('./inhalt/mappen.js');
const {auswahlfelder} = require('./lib/tabellen.js');
const {pruefen, zeichenPruefen} = require('./lib/pruefen.js');

const FUSS = `Makler-Handbuch Hausverkauf Schweiz · Fassung vom ${handbuch.STAND}`;
const hier = f => path.join(__dirname, f);

async function main() {
  /* Querverweise prüfen, bevor etwas erzeugt wird */
  const fehler = pruefen();
  if (fehler.length) {
    console.error('Querverweisprüfung fehlgeschlagen:');
    fehler.forEach(f => console.error('  - ' + f));
    process.exit(1);
  }
  const erzeugt = [];

  /* 01 – Handbuch: PDF ist das Liefer-, docx das Bearbeitungsformat */
  const hb = handbuch.kinder();

  /* Zeichenvorrat prüfen, damit im PDF keine Platzhalter erscheinen */
  const zf = [
    ...zeichenPruefen(hb, '01 Handbuch'),
    ...zeichenPruefen(dokFormulare.bloecke(), '03 Formulare'),
    ...zeichenPruefen(dokDossier.bloecke(), '04 Verkaufsdossier'),
    ...zeichenPruefen(dokKommunik.bloecke(), '05 Kommunikationsvorlagen'),
  ];
  if (zf.length) {
    console.error('Zeichenprüfung fehlgeschlagen:');
    zf.forEach(x => console.error('  - ' + x));
    process.exit(1);
  }
  console.log('Querverweise und Zeichenvorrat geprüft: in Ordnung');
  erzeugt.push(await schreibePdf({bloecke: hb,
    pfad: hier('01_Maklerhandbuch_Hausverkauf.pdf'), fusstext: FUSS}));
  erzeugt.push(await schreibeDocx({bloecke: hb,
    pfad: hier('01_Maklerhandbuch_Hausverkauf.docx'), fusstext: FUSS}));

  /* 03 bis 05 – Word-Dokumente */
  erzeugt.push(await schreibeDocx({bloecke: dokFormulare.bloecke(),
    pfad: hier('03_Makler_Formulare.docx'),
    fusstext: `Makler-Formulare F1–F9 · Fassung vom ${handbuch.STAND}`}));
  erzeugt.push(await schreibeDocx({bloecke: dokDossier.bloecke(),
    pfad: hier('04_Verkaufsdossier_Vorlage.docx'),
    fusstext: `Verkaufsdossier, Vorlage · Fassung vom ${handbuch.STAND}`}));
  erzeugt.push(await schreibeDocx({bloecke: dokKommunik.bloecke(),
    pfad: hier('05_Kommunikationsvorlagen.docx'),
    fusstext: `Kommunikationsvorlagen K1–K20 · Fassung vom ${handbuch.STAND}`}));

  /* 02, 06 bis 09 – Arbeitsmappen */
  const arbeitsmappen = [
    ['02_Makler_Checklisten.xlsx',            mappen.checklisten],
    ['06_Interessentenmanagement.xlsx',       mappen.interessenten],
    ['07_Objektaufnahme.xlsx',                mappen.objektaufnahme],
    ['08_Bewertung_Vorlage.xlsx',             mappen.bewertung],
    ['09_Verkaeufer_Abschlusscheckliste.xlsx', mappen.abschlusscheckliste],
  ];
  for (const [name, bauen] of arbeitsmappen) {
    const wb = auswahlfelder(bauen());
    await wb.xlsx.writeFile(hier(name));
    erzeugt.push(hier(name));
  }

  /* Übersicht ausgeben */
  console.log('Erzeugt:');
  erzeugt.sort().forEach(p => {
    const kb = (fs.statSync(p).size / 1024).toFixed(0);
    console.log('  ' + path.basename(p).padEnd(42) + kb.padStart(6) + ' kB');
  });
}

main().catch(e => { console.error(e); process.exit(1); });
