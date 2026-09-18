/* Prüft die Querverweise zwischen den Inhaltsmodulen. Wird von build.js vor
   dem Erzeugen der Dateien aufgerufen; ein Fehler bricht den Bau ab. */

const {PHASEN}    = require('../inhalt/phasen.js');
const {posten: dokPosten} = require('../inhalt/dokumente.js');
const {posten: rechtPosten} = require('../inhalt/recht.js');
const {VORLAGEN}  = require('../inhalt/kommunikation.js');
const {posten: abschlussPosten} = require('../inhalt/abschluss.js');
const {AUFNAHME}  = require('../inhalt/objektaufnahme.js');
const {ZUSATZ}    = require('../inhalt/phasen-v2.js');
const {GATES}     = require('../inhalt/gates.js');
const {KONTROLLEN}= require('../inhalt/kontrollen.js');
const SFM         = require('../inhalt/sonderfaelle.js');
const STM         = require('../inhalt/stoerungen.js');
const KFM         = require('../inhalt/kaeufer.js');
const PRM         = require('../inhalt/preis.js');
const FTM         = require('../inhalt/falltests.js');
const AUD         = require('../inhalt/audit.js');
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

  /* --- Version 2: Phasenerweiterung vollständig? --- */
  const V2FELDER = ['ausgangslage', 'beteiligte', 'entscheidungen', 'entscheider',
    'risiken', 'dokumentation', 'dokumente', 'crm', 'gates', 'stop', 'eskalation'];
  PHASEN.forEach(p => {
    const z = ZUSATZ[p.nr];
    if (!z) { f.push(`Phase ${p.nr}: Erweiterung in phasen-v2.js fehlt`); return; }
    V2FELDER.forEach(k2 => {
      if (z[k2] === undefined) f.push(`Phase ${p.nr}: V2-Feld «${k2}» fehlt`);
    });
    ['status', 'aktivitaet', 'aufgabe', 'frist', 'prio'].forEach(k2 => {
      if (!z.crm || !z.crm[k2]) f.push(`Phase ${p.nr}: CRM-Feld «${k2}» fehlt`);
    });
    (z.gates || []).forEach(g => {
      if (!GATES.some(x => x.nr === g)) f.push(`Phase ${p.nr}: unbekanntes Gate ${g}`);
    });
  });

  /* --- Gates: Phasenbezug beidseitig konsistent --- */
  const gateZuPhase = {};
  Object.entries(ZUSATZ).forEach(([n, z]) => (z.gates || []).forEach(g => {
    (gateZuPhase[g] = gateZuPhase[g] || []).push(Number(n));
  }));
  GATES.forEach(g => {
    const ph = gateZuPhase[g.nr] || [];
    if (ph.length !== 1) f.push(`Gate ${g.nr}: von ${ph.length} Phasen belegt, erwartet genau 1`);
    else if (ph[0] !== g.nachPhase) {
      f.push(`Gate ${g.nr}: Modul sagt «nach Phase ${g.nachPhase}», Phase ${ph[0]} beansprucht es`);
    }
    if (!phasenNr.has(g.nachPhase)) f.push(`Gate ${g.nr}: unbekannte Phase ${g.nachPhase}`);
    ['frage', 'pruefer', 'nachweis', 'eskalation'].forEach(k2 => {
      if (!g[k2]) f.push(`Gate ${g.nr}: Feld «${k2}» fehlt`);
    });
    if (!g.kriterien.length) f.push(`Gate ${g.nr}: keine Freigabekriterien`);
    if (!g.stop.length) f.push(`Gate ${g.nr}: keine Stop-Kriterien`);
  });

  /* --- Kontrollpunkte --- */
  KONTROLLEN.forEach(c => {
    if (!phasenNr.has(c.phase)) f.push(`Kontrollpunkt ${c.nr}: unbekannte Phase ${c.phase}`);
    if (c.gate && !GATES.some(g => g.nr === c.gate)) f.push(`Kontrollpunkt ${c.nr}: unbekanntes Gate ${c.gate}`);
    if (c.erstellt === c.kontrolliert) f.push(`Kontrollpunkt ${c.nr}: Erstellender und Kontrollierender identisch`);
    ['gegenstand', 'nachweis', 'folge'].forEach(k2 => {
      if (!c[k2]) f.push(`Kontrollpunkt ${c.nr}: Feld «${k2}» fehlt`);
    });
  });

  /* --- Sonderfälle --- */
  SFM.posten().forEach(x => {
    if (!phasenNr.has(x.phase)) f.push(`Sonderfall ${x.nr}: unbekannte Phase ${x.phase}`);
    ['fall', 'erkennung', 'risiko', 'abklaerung', 'stelle', 'dokumente', 'stop', 'eskalation']
      .forEach(k2 => { if (!x[k2]) f.push(`Sonderfall ${x.nr}: Feld «${k2}» fehlt`); });
    (x.recht || '').split(' ').filter(Boolean).forEach(k2 => {
      if (!rechtK.has(k2)) f.push(`Sonderfall ${x.nr}: unbekannter Rechtsverweis ${k2}`);
    });
  });
  if (SFM.posten().length !== 30) f.push(`Sonderfälle: ${SFM.posten().length} statt 30`);

  /* --- Störfälle --- */
  STM.posten().forEach(x => {
    ['fall', 'sofort', 'wer', 'info', 'doku', 'recht', 'entscheid', 'wieder', 'praevention']
      .forEach(k2 => { if (!x[k2]) f.push(`Störfall ${x.nr}: Feld «${k2}» fehlt`); });
  });
  if (STM.posten().length !== 17) f.push(`Störfälle: ${STM.posten().length} statt 17`);

  /* --- Käuferfunnel --- */
  KFM.FUNNEL.forEach((x, i) => {
    if (x.st !== i + 1) f.push(`Funnelstufe an Position ${i + 1} trägt die Nummer ${x.st}`);
    ['name', 'def', 'kriterium', 'aktion', 'daten', 'abbruch'].forEach(k2 => {
      if (!x[k2]) f.push(`Funnelstufe ${x.st}: Feld «${k2}» fehlt`);
    });
  });
  if (KFM.FUNNEL.length !== 9) f.push(`Funnel: ${KFM.FUNNEL.length} Stufen statt 9`);

  /* --- Preislogiken --- */
  PRM.STEUERUNG.forEach(x => {
    ['situation', 'wenn', 'interpretation', 'dann', 'sonst', 'nie'].forEach(k2 => {
      if (!x[k2]) f.push(`Preislogik ${x.nr}: Feld «${k2}» fehlt`);
    });
  });
  if (PRM.BEGRIFFE.length !== 6) f.push(`Preisbegriffe: ${PRM.BEGRIFFE.length} statt 6`);

  /* --- Falltests: jede gemeldete Lücke muss eine Quelle haben --- */
  const ftNr = new Set(FTM.FALLTESTS.map(t => t.nr));
  FTM.LUECKEN.forEach(l => {
    if (!ftNr.has(l.quelle)) f.push(`Lücke ${l.nr}: unbekannter Falltest ${l.quelle}`);
    if (!l.geschlossen) f.push(`Lücke ${l.nr}: nicht als geschlossen dokumentiert`);
  });
  const gemeldet = FTM.FALLTESTS.filter(t => t.befund.includes('LÜCKE')).length;
  if (gemeldet !== FTM.LUECKEN.length) {
    f.push(`Falltests melden ${gemeldet} Lücken, dokumentiert sind ${FTM.LUECKEN.length}`);
  }
  if (FTM.FALLTESTS.length !== 10) f.push(`Falltests: ${FTM.FALLTESTS.length} statt 10`);

  /* --- Audit: D-Befunde brauchen alle acht Felder --- */
  AUD.D_BEFUNDE.forEach(d => {
    ['titel', 'inhalt', 'problem', 'risiko', 'aenderung', 'loesung', 'phase',
     'dokument', 'verantwortung'].forEach(k2 => {
      if (!d[k2]) f.push(`Audit-Befund ${d.nr}: Feld «${k2}» fehlt`);
    });
  });
  AUD.SCHLUSSAUDIT.forEach(x => {
    if (!['erfüllt', 'teilweise erfüllt', 'nicht erfüllt', 'kritisch'].includes(x.e)) {
      f.push(`Schlussaudit «${x.d}»: unzulässiges Ergebnis «${x.e}»`);
    }
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
