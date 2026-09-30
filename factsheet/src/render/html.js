// HTML-Vorschau des Block-Modells. Verwendet dieselben Designwerte (pt) wie der DOCX-Renderer,
// damit die Vorschau Seite 1/2 und 2/2 dem Word-Dokument entspricht.
import { COLORS, FONTS, TYPE, PAGE, BOX, COMPANY } from '../layout/design.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl = (s) => esc(s).replace(/\n/g, '<br>');
const col = (c) => `#${COLORS[c] || c}`;

function style(name, { first = false, scale = 1, over = {} } = {}) {
  const st = { ...TYPE[name], ...over };
  const font = st.font === 'heading' ? `'${FONTS.heading}', Arial, sans-serif` : `${FONTS.body}, 'Liberation Sans', Helvetica, sans-serif`;
  return [
    `font-family:${font}`,
    `font-size:${st.size}pt`,
    `line-height:${st.line}pt`,
    `margin:${first ? 0 : st.before * scale}pt 0 ${st.after * scale}pt 0`,
    `color:${col(st.color)}`,
    st.bold ? 'font-weight:700' : 'font-weight:400',
    st.caps ? 'text-transform:uppercase' : '',
    st.spacing ? `letter-spacing:${st.spacing}pt` : '',
  ].filter(Boolean).join(';');
}

function p(text, name, opts = {}, attrs = '') {
  const rule = TYPE[name].rule ? `;border-bottom:0.75pt solid ${col('navy')};padding-bottom:1pt` : '';
  return `<p style="${style(name, opts)}${rule}"${attrs}>${nl(text)}</p>`;
}

function editable(b) {
  if (!b.key) return '';
  const cls = ['fs-edit', b.source === 'ai' ? 'fs-ai' : '', b.trimmed ? 'fs-trimmed' : ''].filter(Boolean).join(' ');
  return ` class="${cls}" data-key="${esc(b.key)}" title="Klicken zum Bearbeiten"`;
}

function block(b, width, scale, images) {
  switch (b.type) {
    case 'band':
      return `<div style="background:${col('navy')};padding:${BOX.band.padTop}pt ${BOX.band.padX}pt ${BOX.band.padBottom}pt">`
        + p(b.label, 'bandLabel', { first: true }) + p(b.title, 'title', { first: true }, ' class="fs-edit" data-key="title"') + p(b.subtitle, 'subtitle', { first: true }) + '</div>';
    case 'kpis':
      return `<div style="display:flex;margin-bottom:${BOX.kpi.gapAfter * scale}pt">`
        + b.items.map((k, i) => `<div style="flex:1;background:${col('cream')};padding:${BOX.kpi.padTop}pt ${BOX.kpi.padX}pt ${BOX.kpi.padBottom}pt;${i ? 'border-left:1.5pt solid #fff;' : ''}${i < b.items.length - 1 ? 'border-right:1.5pt solid #fff;' : ''}">`
          + p(k.value, 'kpiValue', { first: true }) + p(k.label, 'kpiLabel', { first: true }) + '</div>').join('')
        + '</div>';
    case 'image':
      return `<div style="height:${b.height}pt;margin-bottom:${3 + BOX.image.gapAfter * scale}pt;background:${col('cream')}">`
        + (images[b.slot] ? `<img src="${images[b.slot]}" alt="" style="width:100%;height:100%;object-fit:cover;display:block">` : '') + '</div>';
    case 'imageRow': {
      const w = (width - BOX.imageRow.gap) / 2;
      return `<div style="display:flex;gap:${BOX.imageRow.gap}pt;margin-bottom:${BOX.image.gapAfter * scale}pt">`
        + b.slots.map((s) => `<div style="width:${w}pt"><div style="height:${b.height + 3}pt"><img src="${images[s.slot]}" alt="" style="width:100%;height:${b.height}pt;object-fit:cover;display:block"></div>${p(s.caption, 'caption')}</div>`).join('')
        + '</div>';
    }
    case 'h1': case 'h2': case 'small':
      return p(b.text, b.type, { first: b.first, scale });
    case 'h3':
      return p(b.text, 'contactH', { first: b.first, scale });
    case 'para':
      return p(b.text, b.style || 'body', { first: b.first, scale }, editable(b));
    case 'spacer':
      return `<div style="height:${b.height * scale}pt"></div>`;
    case 'argument': {
      const attrs = editable({ ...b, source: 'ai' });
      let h = `<div${attrs}>`;
      if (b.title) h += p(b.title, 'argTitle', { first: b.first, scale });
      if (b.text) h += p(b.text, 'argText', { first: !!b.title || b.first, scale, over: b.title || b.first ? {} : { before: TYPE.argTitle.before } });
      return h + '</div>';
    }
    case 'contacts': {
      let h = p(b.heading, 'contactH', { first: b.first, scale });
      b.items.forEach((c, i) => {
        [c.name, c.role, c.phone, c.email].filter(Boolean).forEach((l, j) => {
          h += `<p style="${style('contact', { first: true, over: j === 0 ? { bold: true, color: 'navy' } : {} })};${j === 0 && i ? `margin-top:${6 * scale}pt` : ''}">${esc(l)}</p>`;
        });
      });
      return h;
    }
    case 'kv': {
      const pad = `${BOX.kv.padY * scale}pt ${BOX.kv.padX}pt`;
      return `<table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup><col style="width:${(b.labelShare || BOX.kv.labelShare) * 100}%"><col></colgroup>`
        + b.rows.map((r) => `<tr style="border-bottom:${BOX.kv.border}pt solid ${col('line')}">`
          + `<td style="padding:${pad};vertical-align:top">${p(r.label, 'cellLabel', { first: true })}</td>`
          + `<td style="padding:${pad};vertical-align:top">${p(r.value, 'cell', { first: true }, r.source === 'derived' ? ' title="Berechnet aus erfassten Werten"' : '')}</td></tr>`).join('')
        + '</table>';
    }
    case 'table': {
      const pad = `${BOX.table.padY * scale}pt ${BOX.table.padX}pt`;
      return `<table style="width:100%;border-collapse:collapse;table-layout:fixed"><colgroup>${b.shares.map((s) => `<col style="width:${s * 100}%">`).join('')}</colgroup>`
        + `<tr>${b.header.map((h) => `<td style="background:${col('navy')};padding:${pad};vertical-align:top">${p(h, 'cellHead', { first: true })}</td>`).join('')}</tr>`
        + b.rows.map((r, ri) => `<tr style="border-bottom:${BOX.table.border}pt solid ${col('line')};${ri % 2 ? `background:${col('cream')}` : ''}">${r.map((c) => `<td style="padding:${pad};vertical-align:top">${p(c, 'cell', { first: true })}</td>`).join('')}</tr>`).join('')
        + '</table>';
    }
    case 'steps':
      return b.items.map((s, i) => `<p style="${style('step', { first: true, scale })};padding-left:16pt;text-indent:-16pt"><b style="color:${col('navy')};display:inline-block;width:16pt;text-indent:0">${i + 1}</b><b>${esc(s.title)}</b>${s.detail ? ` – ${esc(s.detail)}` : ''}</p>`).join('');
    case 'split': {
      const cw = (width - BOX.split.gutter) / 2;
      const col2 = (list) => `<div style="width:${cw}pt">${list.map((x) => block(x, cw, scale, images)).join('')}</div>`;
      return `<div style="display:flex;gap:${BOX.split.gutter}pt;padding-bottom:1pt">${col2(b.left)}${col2(b.right)}</div>`;
    }
    case 'columns': {
      const lw = width * BOX.columns.leftShare, rw = width - lw;
      const hasRight = b.right.length > 0;
      return `<div style="display:flex;align-items:stretch">`
        + `<div style="width:${lw}pt;padding:${BOX.columns.rightPad}pt ${BOX.columns.gutter}pt ${BOX.columns.rightPad}pt 0;box-sizing:border-box">${b.left.map((x) => block(x, lw - BOX.columns.gutter, scale, images)).join('')}</div>`
        + `<div style="width:${rw}pt;box-sizing:border-box;padding:${BOX.columns.rightPad}pt;${hasRight ? `background:${col('cream')}` : ''}">${b.right.map((x) => block(x, rw - 2 * BOX.columns.rightPad, scale, images)).join('')}</div>`
        + '</div>';
    }
    default:
      return '';
  }
}

export function renderPreview(model, images = {}, { logoUrl = '/assets/logo/schaeppi-1zeilig-navy.png' } = {}) {
  const total = model.pages.length;
  return model.pages.map((pg, i) => {
    const overflow = pg.height > model.capacity;
    return `<div class="fs-page" style="position:relative;width:${PAGE.width}pt;height:${PAGE.height}pt;background:#fff;box-sizing:border-box;overflow:hidden">`
      + `<div style="position:absolute;left:${PAGE.marginLeft}pt;right:${PAGE.marginRight}pt;top:${PAGE.headerDistance}pt;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:0.5pt solid ${col('line')};padding-bottom:6pt">`
      + `<img src="${logoUrl}" alt="Schaeppi Grundstücke" style="width:150pt;display:block">`
      + (model.confidential ? `<span style="${style('header', { first: true })}">Vertraulich</span>` : '') + '</div>'
      + `<div class="fs-content" style="position:absolute;left:${PAGE.marginLeft}pt;top:${PAGE.marginTop}pt;width:${PAGE.contentWidth}pt;height:${PAGE.contentHeight}pt;${overflow ? 'outline:1.5pt dashed #c0392b' : ''}">`
      + pg.blocks.map((b) => block(b, PAGE.contentWidth, pg.scale, images)).join('') + '</div>'
      + `<div style="position:absolute;left:${PAGE.marginLeft}pt;right:${PAGE.marginRight}pt;bottom:${PAGE.footerDistance}pt;display:flex;justify-content:space-between;border-top:0.5pt solid ${col('line')};padding-top:6pt;${style('footer', { first: true })}">`
      + `<span>${esc(`${COMPANY.name}  ·  ${COMPANY.street}  ·  ${COMPANY.zipCity}  ·  ${COMPANY.web}`)}</span><span>Seite ${i + 1} / ${total}</span></div>`
      + '</div>';
  }).join('');
}
