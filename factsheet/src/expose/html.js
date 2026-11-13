// Verkaufsdokumentation als HTML: Vorschau im Programm und Druckvorlage für das PDF (A4 quer).
// Alle Masse in pt; Farben und Schriften aus dem Design-System.
import { COLORS, FONTS, EXPOSE, COMPANY } from '../layout/design.js';
import { DISCLAIMER } from '../layout/factsheet.js';
import { fitFontSize as fittingSize } from '../layout/measure.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const para = (s) => String(s || '').split(/\n{2,}/).map((x) => `<p>${esc(x).replace(/\n/g, '<br>')}</p>`).join('');
const C = (k) => `#${COLORS[k]}`;
const { page: PG, pad: PAD } = EXPOSE;
const T = EXPOSE.type;

function font(st) {
  const fam = st.font === 'heading' ? `'${FONTS.heading}', Arial, sans-serif` : `${FONTS.body}, 'Liberation Sans', Helvetica, sans-serif`;
  return `font-family:${fam};font-size:${st.size}pt;line-height:${st.line}pt;${st.bold ? 'font-weight:700;' : 'font-weight:400;'}${st.caps ? `text-transform:uppercase;letter-spacing:${st.spacing || 1}pt;` : ''}`;
}

export function exposeCss({ fontUrl = '/assets/fonts/IBMPlexSans-Regular.ttf' } = {}) {
  return `
@font-face { font-family: '${FONTS.heading}'; src: url('${fontUrl}') format('truetype'); font-weight: 400; }
@page { size: ${PG.width}pt ${PG.height}pt; margin: 0; }
.xp * { box-sizing: border-box; }
.xp { -webkit-print-color-adjust: exact; print-color-adjust: exact; color: ${C('text')}; }
.xp-page { position: relative; width: ${PG.width}pt; height: ${PG.height}pt; overflow: hidden; background: #fff; page-break-after: always; break-after: page; }
.xp-page:last-child { page-break-after: auto; break-after: auto; }
.xp-half { position: absolute; top: 0; bottom: 0; width: ${PG.width / 2}pt; overflow: hidden; }
.xp-half.l { left: 0; } .xp-half.r { right: 0; }
.xp-full { position: absolute; inset: 0; }
.xp-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.xp-navy { background: ${C('navy')}; color: #fff; }
.xp-cream { background: ${C('cream')}; }
.xp-white { background: #fff; }
.xp-pad { position: absolute; left: ${PAD}pt; right: ${PAD}pt; }
.xp-title { ${font(T.title)} margin: 0; color: ${C('navy')}; }
.xp-navy .xp-title { color: #fff; }
.xp-kicker { ${font({ font: 'body', size: 8, line: 11, bold: true, caps: true, spacing: 1.6 })} color: ${C('blue')}; margin: 0 0 6pt; }
.xp-navy .xp-kicker { color: ${C('bandLabel')}; }
.xp-sub { ${font(T.sub)} color: ${C('muted')}; margin: 4pt 0 0; }
.xp-navy .xp-sub { color: ${C('bandLabel')}; }
.xp-body { ${font(T.body)} }
.xp-body p { margin: 0 0 ${T.body.line * 0.6}pt; }
.xp-navy .xp-body { color: #fff; }
.xp-tagline { ${font(T.tagline)} color: ${C('navy')}; }
.xp-num { position: absolute; bottom: 22pt; ${font(T.small)} color: ${C('muted')}; }
.xp-num.l { left: 24pt; } .xp-num.r { right: 24pt; }
.xp-navy .xp-num, .xp-num.on-navy { color: ${C('bandLabel')}; }
.xp-conf { position: absolute; top: 20pt; right: 24pt; ${font({ font: 'body', size: 6.5, line: 9, bold: true, caps: true, spacing: 1.6 })} color: ${C('muted')}; }
.xp-conf.on-navy, .xp-conf.on-img { color: #fff; }
.xp-kv { width: 100%; border-collapse: collapse; }
.xp-kv td { ${font(T.value)} padding: 3.5pt 0; vertical-align: top; }
.xp-kv td:first-child { width: 40%; padding-right: 8pt; }
.xp-navy .xp-kv td:first-child { color: ${C('bandLabel')}; }
.xp-white .xp-kv td, .xp-cream .xp-kv td { border-bottom: 0.5pt solid ${C('line')}; }
.xp-white .xp-kv td:first-child, .xp-cream .xp-kv td:first-child { color: ${C('muted')}; }
.xp-price { border-top: 0.5pt solid rgba(255,255,255,.35); padding-top: 10pt; }
.xp-price .lbl { ${font({ font: 'body', size: 8, line: 11, bold: true, caps: true, spacing: 1.6 })} color: ${C('bandLabel')}; }
.xp-price .val { ${font(T.price)} color: #fff; }
.xp-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 1pt; background: ${C('line')}; }
.xp-kpis div { background: ${C('cream')}; padding: 18pt 14pt; }
.xp-kpis b { display: block; ${font({ font: 'heading', size: 19, line: 24 })} color: ${C('navy')}; white-space: nowrap; }
.xp-kpis div:last-child:nth-child(odd) { grid-column: span 2; }
.xp-kpis span { ${font(T.caption)} color: ${C('muted')}; }
.xp-tbl { width: 100%; border-collapse: collapse; margin-bottom: 14pt; }
.xp-tbl th { ${font(T.tableHead)} background: ${C('navy')}; color: #fff; text-align: left; padding: 3pt 5pt; }
.xp-tbl td { ${font(T.table)} padding: 3pt 5pt; border-bottom: 0.5pt solid ${C('line')}; vertical-align: top; }
.xp-tbl tr:nth-child(even) td { background: ${C('cream')}; }
.xp-h3 { ${font({ font: 'heading', size: 13, line: 17 })} color: ${C('navy')}; margin: 0 0 6pt; padding-bottom: 3pt; border-bottom: 0.75pt solid ${C('navy')}; }
.xp-cap { ${font(T.caption)} color: ${C('muted')}; }
.xp-small { ${font(T.small)} color: ${C('muted')}; }
`;
}

const img = (im, extra = '') => (im ? `<img class="xp-img" src="${esc(im.src)}" alt="${esc(im.caption || '')}" style="${extra}">` : '');
const num = (pg, side, onNavy) => `<div class="xp-num ${side}${onNavy ? ' on-navy' : ''}">${pg.number}</div>`;
const conf = (m, cls = '') => (m.confidential ? `<div class="xp-conf ${cls}">Vertraulich</div>` : '');

function kpiGrid(kpis) {
  if (!kpis || !kpis.length) return '';
  return `<div class="xp-kpis">${kpis.slice(0, 4).map((k) => `<div><b>${esc(k.value)}</b><span>${esc(k.label)}</span></div>`).join('')}</div>`;
}

function kv(rows) {
  return `<table class="xp-kv">${rows.map((r) => `<tr><td>${esc(r.label)}</td><td>${esc(r.value).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;
}

function table(t) {
  if (!t) return '';
  return `<table class="xp-tbl"><tr>${t.header.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
}

const RENDER = {
  cover(pg, m, a) {
    if (!pg.image) {
      return `<div class="xp-full xp-navy">
        <div style="position:absolute;left:0;right:0;top:${PG.height * 0.38}pt;text-align:center">
          ${pg.label ? `<div class="xp-kicker">${esc(pg.label)}</div>` : ''}
          <div style="${font(T.coverTitle)}color:#fff">${esc(pg.title)}</div>
          <div style="${font(T.coverSub)}color:#fff;opacity:.9;margin-top:10pt">${esc(pg.subtitle)}</div>
        </div>
        <img src="${a('logo/schaeppi-1zeilig-weiss.png')}" alt="Schaeppi Grundstücke" style="position:absolute;left:${PAD}pt;bottom:${PAD}pt;width:190pt"></div>`;
    }
    const panel = PG.width * 0.4;
    const titleStyle = fittingSize(pg.title, T.coverTitle, panel - 2 * PAD);
    return `<div style="position:absolute;top:0;bottom:0;right:0;left:${panel}pt">${img(pg.image)}</div>
      <div class="xp-navy" style="position:absolute;left:0;top:0;bottom:0;width:${panel}pt">
        <img src="${a('logo/schaeppi-1zeilig-weiss.png')}" alt="Schaeppi Grundstücke" style="position:absolute;left:${PAD}pt;top:${PAD}pt;width:160pt">
        <div class="xp-pad" style="bottom:${PAD}pt">
          ${pg.label ? `<div class="xp-kicker">${esc(pg.label)}</div>` : ''}
          <div style="${font(titleStyle)}color:#fff">${esc(pg.title)}</div>
          <div style="${font(T.coverSub)}color:#fff;margin-top:12pt">${esc(pg.designation)}</div>
          <div style="${font(T.sub)}color:${C('bandLabel')};margin-top:4pt">${esc(pg.subtitle)}</div>
        </div></div>${conf(m, 'on-img')}`;
  },

  facts(pg, m) {
    const right = pg.image ? `<div class="xp-half r">${img(pg.image)}</div>`
      : `<div class="xp-half r xp-cream"><div class="xp-pad" style="top:${EXPOSE.textTop}pt">${kpiGrid(pg.kpis)}</div></div>`;
    return `<div class="xp-half l xp-navy">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt"><h1 class="xp-title">Facts &amp; Figures</h1></div>
        <div class="xp-pad" style="top:150pt">${kv(pg.rows)}</div>
        ${pg.price ? `<div class="xp-pad xp-price" style="bottom:${EXPOSE.bottom}pt"><div class="lbl">${esc(pg.price.label)}</div><div class="val">${esc(pg.price.value)}</div></div>` : ''}
        ${num(pg, 'l', true)}
      </div>${right}${conf(m, pg.image ? 'on-img' : '')}`;
  },

  text(pg, m, a) {
    const side = pg.imageSide === 'left' ? 'r' : 'l';
    const other = side === 'l' ? 'r' : 'l';
    const tone = pg.tone === 'cream' ? 'xp-cream' : 'xp-white';
    const imageHalf = pg.image ? `<div class="xp-half ${other}">${img(pg.image)}</div>`
      : `<div class="xp-half ${other} xp-navy">${pg.kpis ? `<div class="xp-pad" style="top:${EXPOSE.textTop}pt">${kpiGrid(pg.kpis)}</div>`
        : `<img src="${a('logo/schaeppi-2zeilig-weiss.png')}" alt="" style="position:absolute;left:${PAD}pt;bottom:${PAD}pt;width:120pt;opacity:.9">`}</div>`;
    return `<div class="xp-half ${side} ${tone}" data-key="${esc(pg.key)}">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt">
          ${pg.kicker ? `<div class="xp-kicker">${esc(pg.kicker)}</div>` : ''}
          <h1 class="xp-title">${esc(pg.title)}</h1>
          ${pg.subtitle ? `<div class="xp-sub">${esc(pg.subtitle)}</div>` : ''}
        </div>
        <div class="xp-pad xp-body" style="top:${EXPOSE.textTop}pt">${para(pg.text)}</div>
        ${pg.tagline ? `<div class="xp-pad xp-tagline" style="bottom:${EXPOSE.bottom}pt">${esc(pg.tagline)}</div>` : ''}
        ${num(pg, side, false)}
      </div>${imageHalf}${conf(m, other === 'r' && pg.image ? 'on-img' : other === 'r' ? 'on-navy' : '')}`;
  },

  unit(pg, m) {
    const facts = pg.facts.length && pg.image ? `<div class="xp-pad" style="bottom:${EXPOSE.bottom}pt">${kv(pg.facts.map(([label, value]) => ({ label, value })))}</div>` : '';
    return `<div class="xp-half l xp-navy" data-key="${esc(pg.key)}">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt"><div class="xp-kicker">Einheit ${pg.index + 1}</div><h1 class="xp-title">${esc(pg.title)}</h1><div class="xp-sub">${esc(pg.heading)}</div></div>
        <div class="xp-pad xp-body" style="top:${EXPOSE.textTop}pt">${para(pg.text)}</div>
        ${facts}${num(pg, 'l', true)}
      </div>
      <div class="xp-half r ${pg.image ? '' : 'xp-cream'}">${pg.image ? img(pg.image)
        : `<div class="xp-pad" style="top:${EXPOSE.textTop}pt">${kpiGrid(pg.facts.map(([label, value]) => ({ label, value })))}</div>`}</div>${conf(m, pg.image ? 'on-img' : '')}`;
  },

  unitTable(pg, m) {
    return `<div class="xp-full xp-white"><div class="xp-pad" style="top:${EXPOSE.titleTop}pt;right:${pg.image ? PG.width * 0.42 + PAD : PAD}pt">
        <h1 class="xp-title">${esc(pg.title)}</h1><div style="height:24pt"></div>${table(pg.table)}</div></div>
      ${pg.image ? `<div style="position:absolute;right:0;top:0;bottom:0;width:${PG.width * 0.42}pt">${img(pg.image)}</div>` : ''}
      ${num(pg, 'l')}${conf(m, pg.image ? 'on-img' : '')}`;
  },

  gallery(pg, m) {
    const ims = pg.images;
    const g = 4;
    let h;
    if (ims.length === 1) h = `<div class="xp-full">${img(ims[0])}</div>`;
    else if (ims.length === 2) h = `<div class="xp-half l" style="width:${PG.width / 2 - g / 2}pt">${img(ims[0])}</div><div class="xp-half r" style="width:${PG.width / 2 - g / 2}pt">${img(ims[1])}</div>`;
    else {
      h = `<div class="xp-half l" style="width:${PG.width * 0.6 - g / 2}pt">${img(ims[0])}</div>
        <div style="position:absolute;right:0;top:0;width:${PG.width * 0.4 - g / 2}pt;height:${PG.height / 2 - g / 2}pt">${img(ims[1])}</div>
        <div style="position:absolute;right:0;bottom:0;width:${PG.width * 0.4 - g / 2}pt;height:${PG.height / 2 - g / 2}pt">${img(ims[2])}</div>`;
    }
    return h + conf(m, 'on-img');
  },

  floorplan(pg, m) {
    return `<div class="xp-full xp-white">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt"><h1 class="xp-title">${esc(pg.title)}</h1>${pg.caption ? `<div class="xp-sub">${esc(pg.caption)}</div>` : ''}</div>
        <div style="position:absolute;left:${PAD}pt;right:${PAD}pt;top:120pt;bottom:${EXPOSE.bottom}pt">
          <img src="${esc(pg.image.src)}" alt="${esc(pg.caption || 'Grundriss')}" style="width:100%;height:100%;object-fit:contain;display:block"></div>
        ${num(pg, 'r')}</div>${conf(m)}`;
  },

  numbers(pg, m) {
    const colW = (PG.width - 3 * PAD) / 2;
    const left = [
      pg.finance.length ? `<h3 class="xp-h3">Erträge &amp; Kennzahlen</h3>${kv(pg.finance)}<div style="height:16pt"></div>` : '',
      pg.investments.length ? `<h3 class="xp-h3">Investitionen</h3>${table({ header: ['Jahr', 'Massnahme'], rows: pg.investments.map((i) => [String(i.year), String(i.measure)]) })}` : '',
    ].join('');
    const right = [
      pg.land.length || pg.parcels ? `<h3 class="xp-h3">Grundstück &amp; Rechtliches</h3>${table(pg.parcels)}${pg.land.length ? kv(pg.land) : ''}<div style="height:16pt"></div>` : '',
      pg.units ? `<h3 class="xp-h3">Einheiten</h3>${table(pg.units)}` : '',
    ].join('');
    return `<div class="xp-full xp-white">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt"><h1 class="xp-title">${esc(pg.title)}</h1></div>
        <div style="position:absolute;top:118pt;left:${PAD}pt;width:${colW}pt">${left || right}</div>
        ${left ? `<div style="position:absolute;top:118pt;left:${2 * PAD + colW}pt;width:${colW}pt">${right}</div>` : ''}
        ${num(pg, 'l')}</div>${conf(m)}`;
  },

  steps(pg, m) {
    const n = pg.steps.length;
    const w = (PG.width - 2 * PAD) / n;
    return `<div class="xp-full xp-cream">
        <div class="xp-pad" style="top:${EXPOSE.titleTop}pt"><h1 class="xp-title">${esc(pg.title)}</h1>${pg.intro ? `<div class="xp-sub">${esc(pg.intro)}</div>` : ''}</div>
        <div style="position:absolute;left:${PAD}pt;right:${PAD}pt;top:${PG.height * 0.42}pt;border-top:0.75pt solid ${C('navy')}"></div>
        ${pg.steps.map((s, i) => `<div style="position:absolute;top:${PG.height * 0.42 - 15}pt;left:${PAD + i * w}pt;width:${w - 14}pt">
          <div style="width:30pt;height:30pt;border-radius:50%;background:${C('navy')};color:#fff;text-align:center;${font({ font: 'heading', size: 13, line: 30 })}">${i + 1}</div>
          <div style="${font(T.stepTitle)}color:${C('navy')};margin-top:12pt">${esc(s.title)}</div>
          <div style="${font(T.stepText)}margin-top:4pt">${esc(s.detail)}</div></div>`).join('')}
        ${num(pg, 'r')}</div>${conf(m)}`;
  },

  contact(pg, m) {
    const people = pg.contacts.map((c) => `<div style="text-align:right;margin-bottom:10pt">
        <div style="${font(T.contactName)}color:${C('navy')}">${esc(c.name)}</div>
        ${[c.role, c.phone, c.email].filter(Boolean).map((x) => `<div style="${font(T.contact)}color:${C('muted')}">${esc(x)}</div>`).join('')}</div>`).join('');
    return `<div class="xp-half l">${img(pg.image)}</div>
      <div class="xp-half r xp-cream">
        <div style="position:absolute;left:0;right:0;top:${EXPOSE.titleTop + 20}pt;text-align:center"><div style="${font({ font: 'heading', size: 22, line: 28 })}color:${C('navy')}">${esc(pg.title)}</div></div>
        ${pg.portrait ? `<div style="position:absolute;left:${(PG.width / 2 - 130) / 2}pt;top:${EXPOSE.titleTop + 70}pt;width:130pt;height:173pt">${img(pg.portrait)}</div>` : ''}
        <div class="xp-pad" style="bottom:${EXPOSE.bottom + 30}pt;display:flex;justify-content:space-between;align-items:flex-end;gap:20pt">
          <div><div style="${font(T.contactName)}color:${C('navy')}">${esc(COMPANY.name)}</div>
            ${[COMPANY.street, COMPANY.zipCity, COMPANY.web].map((x) => `<div style="${font(T.contact)}color:${C('muted')}">${esc(x)}</div>`).join('')}</div>
          <div>${people}</div></div>
        <div class="xp-pad xp-small" style="bottom:22pt">${esc(DISCLAIMER.short)}</div>
      </div>${conf(m)}`;
  },

  back(pg, m, a) {
    return `<div class="xp-full xp-cream"><img src="${a('logo/schaeppi-2zeilig-blau.png')}" alt="Schaeppi Grundstücke" style="position:absolute;left:${PAD}pt;bottom:${PAD}pt;width:150pt"></div>`;
  },
};

// Seiten als HTML-Fragment (für die Vorschau im Programm)
export function renderExposePages(model, { assetUrl = (rel) => `/assets/${rel}` } = {}) {
  return `<div class="xp">${model.pages.map((pg) => `<section class="xp-page" data-type="${pg.type}">${RENDER[pg.type](pg, model, assetUrl)}</section>`).join('')}</div>`;
}

// Vollständiges Dokument (für PDF bzw. Drucken)
export function renderExposeDocument(model, { assetUrl, fontUrl } = {}) {
  return `<!doctype html><html lang="de-CH"><head><meta charset="utf-8"><title>${esc(`Verkaufsdokumentation – ${model.address}`)}</title>
<style>html,body{margin:0;padding:0;background:#fff}${exposeCss({ fontUrl })}</style></head>
<body>${renderExposePages(model, { assetUrl })}</body></html>`;
}
