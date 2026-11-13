// PDF-Erzeugung aus HTML mit einem Chromium-Browser (Chrome, Edge oder Chromium).
// Optional: Ist kein Browser vorhanden oder playwright-core nicht installiert, gibt es kein
// Server-PDF; die Oberfläche bietet dann «Drucken als PDF» im Browser an.
import fs from 'node:fs';
import path from 'node:path';

function candidates() {
  const list = [process.env.CHROMIUM_PATH];
  if (process.platform === 'win32') {
    for (const base of [process.env['PROGRAMFILES(X86)'], process.env.PROGRAMFILES, process.env.LOCALAPPDATA].filter(Boolean)) {
      list.push(path.join(base, 'Microsoft', 'Edge', 'Application', 'msedge.exe'), path.join(base, 'Google', 'Chrome', 'Application', 'chrome.exe'));
    }
  } else if (process.platform === 'darwin') {
    list.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Chromium.app/Contents/MacOS/Chromium');
  } else {
    list.push('/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/microsoft-edge');
    const pw = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    try {
      for (const d of fs.readdirSync(pw).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
        list.push(path.join(pw, d, 'chrome-linux64', 'chrome'), path.join(pw, d, 'chrome-linux', 'chrome'));
      }
    } catch { /* kein Playwright-Verzeichnis */ }
  }
  return list.filter(Boolean);
}

let browserPromise = null;
let idleTimer = null;
const IDLE_MS = 30000; // Browser nach 30 s ohne Auftrag schliessen (gibt Speicher frei, Prozess kann enden)

function scheduleClose() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { closePdf().catch(() => {}); }, IDLE_MS);
  idleTimer.unref();
}

async function browser() {
  if (!browserPromise) {
    browserPromise = (async () => {
      let pw;
      try { pw = await import('playwright-core'); } catch { return null; }
      const exe = candidates().find((p) => { try { return fs.statSync(p).isFile(); } catch { return false; } });
      if (!exe) return null;
      return pw.chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
    })().catch(() => null);
  }
  return browserPromise;
}

// Prüft nur, ob ein Browser vorhanden ist – ohne ihn zu starten
export async function pdfAvailable() {
  try { await import('playwright-core'); } catch { return false; }
  return candidates().some((p) => { try { return fs.statSync(p).isFile(); } catch { return false; } });
}

// HTML-Dokument -> PDF-Bytes (oder null ohne Browser)
export async function htmlToPdf(html) {
  const b = await browser();
  if (!b) return null;
  clearTimeout(idleTimer);
  const page = await b.newPage();
  try {
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    return await page.pdf({ preferCSSPageSize: true, printBackground: true });
  } finally {
    await page.close();
    scheduleClose();
  }
}

export async function closePdf() {
  clearTimeout(idleTimer);
  if (!browserPromise) return;
  const b = await browserPromise;
  browserPromise = null;
  if (b) await b.close();
}
