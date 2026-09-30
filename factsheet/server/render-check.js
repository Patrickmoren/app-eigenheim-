// Gegenprüfung der Seitenzahl mit einem echten Layout-Renderer (LibreOffice, headless).
// Ist LibreOffice nicht installiert, gilt die interne Seitenberechnung (measure.js).
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const CANDIDATES = [process.env.SOFFICE_PATH, 'soffice', 'libreoffice', '/usr/bin/soffice',
  '/Applications/LibreOffice.app/Contents/MacOS/soffice', 'C:\\Program Files\\LibreOffice\\program\\soffice.exe'].filter(Boolean);

let resolved;
async function findSoffice() {
  if (resolved !== undefined) return resolved;
  if (process.env.RENDER_CHECK === 'off') return (resolved = null);
  for (const c of CANDIDATES) {
    const ok = await new Promise((res) => execFile(c, ['--version'], { timeout: 15000 }, (e) => res(!e)));
    if (ok) return (resolved = c);
  }
  return (resolved = null);
}

export async function rendererAvailable() {
  return !!(await findSoffice());
}

// Konvertiert ein DOCX nach PDF und liefert { pages, pdf } oder null, wenn kein Renderer vorhanden ist.
export async function renderPdf(docxBuffer) {
  const soffice = await findSoffice();
  if (!soffice) return null;
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'factsheet-'));
  try {
    const input = path.join(dir, 'dokument.docx');
    await fs.writeFile(input, docxBuffer);
    await new Promise((res, rej) => execFile(soffice, [
      `-env:UserInstallation=file://${path.join(dir, 'profil').replace(/\\/g, '/')}`,
      '--headless', '--convert-to', 'pdf', '--outdir', dir, input,
    ], { timeout: 90000 }, (e, _o, stderr) => (e ? rej(new Error(`LibreOffice: ${stderr || e.message}`)) : res())));
    const pdf = await fs.readFile(path.join(dir, 'dokument.pdf'));
    return { pages: countPdfPages(pdf), pdf };
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

export function countPdfPages(pdf) {
  const s = pdf.toString('latin1');
  const m = s.match(/\/Type\s*\/Page(?![s\w])/g);
  if (m && m.length) return m.length;
  const c = /\/Type\s*\/Pages[^>]*?\/Count\s+(\d+)/.exec(s);
  return c ? Number(c[1]) : 0;
}
