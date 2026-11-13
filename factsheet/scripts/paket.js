// Stellt die reine Browser-Fassung zusammen (ohne Server), z. B. für die Veröffentlichung auf claude.ai
// oder einem beliebigen Webserver/SharePoint:  node scripts/paket.js [zielordner]
//
// Inhalt: index.html, web/, src/, assets/, vendor/ (docx, ExcelJS) und beispiel.json (Neumattstrasse 15).
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readImageFolder } from '../server/hotfolder.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(path.join(out, 'vendor'), { recursive: true });
await fs.cp(path.join(ROOT, 'web'), path.join(out, 'web'), { recursive: true });
await fs.cp(path.join(ROOT, 'src'), path.join(out, 'src'), { recursive: true });
await fs.cp(path.join(ROOT, 'assets'), path.join(out, 'assets'), { recursive: true });
await fs.rm(path.join(out, 'web', 'index.html'));
await fs.copyFile(path.join(ROOT, 'node_modules/docx/dist/index.mjs'), path.join(out, 'vendor/docx.mjs'));
await fs.copyFile(path.join(ROOT, 'node_modules/exceljs/dist/exceljs.min.js'), path.join(out, 'vendor/exceljs.min.js'));
await fs.copyFile(path.join(ROOT, 'web/index.html'), path.join(out, 'index.html'));

const ex = path.join(ROOT, 'examples/neumattstrasse-15');
const property = JSON.parse(await fs.readFile(path.join(ex, 'objekt.json'), 'utf8'));
property.images = await readImageFolder(ex);
const texts = JSON.parse(await fs.readFile(path.join(ex, 'texte.json'), 'utf8'));
await fs.writeFile(path.join(out, 'beispiel.json'), JSON.stringify({ property, texts }));

const files = [];
const walk = async (d) => { for (const e of await fs.readdir(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) await walk(f); else files.push(path.relative(out, f)); } };
await walk(out);
console.log(`${files.length} Dateien in ${out}`);
