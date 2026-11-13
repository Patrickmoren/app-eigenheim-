// Desktop-Start: Oberfläche und automatische Ordnerverarbeitung in einem Prozess.
//
//   node scripts/desktop.js [--ordner=PFAD] [--kein-browser] [--port=3000]
//
// Ohne --ordner liegt der Arbeitsordner «Factsheet-Generator» auf dem Desktop
// (auch bei OneDrive-umgeleitetem Desktop). Alternativ: Umgebungsvariable FACTSHEET_ORDNER.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { startServer, provider } from '../server/server.js';
import { prepareFolders, startHotfolder } from '../server/hotfolder.js';

const arg = (name) => (process.argv.find((a) => a.startsWith(`--${name}=`)) || '').split('=').slice(1).join('=');
const flag = (name) => process.argv.includes(`--${name}`);

function desktopDir() {
  const home = os.homedir();
  const candidates = [
    process.env.OneDrive && path.join(process.env.OneDrive, 'Desktop'),
    process.env.OneDriveCommercial && path.join(process.env.OneDriveCommercial, 'Desktop'),
    path.join(home, 'Desktop'),
    path.join(home, 'Schreibtisch'),
  ].filter(Boolean);
  return candidates.find((d) => fs.existsSync(d)) || home;
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try { spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore' }).unref(); } catch { /* Browser manuell öffnen */ }
}

const base = path.resolve(arg('ordner') || process.env.FACTSHEET_ORDNER || path.join(desktopDir(), 'Factsheet-Generator'));
await prepareFolders(base);

let url;
try {
  ({ url } = await startServer({ port: Number(arg('port')) || Number(process.env.PORT) || 3000, hotfolder: base }));
} catch (e) {
  if (e.code === 'EADDRINUSE') {
    // Läuft bereits (z. B. über Autostart): nur die Oberfläche öffnen.
    const port = Number(arg('port')) || Number(process.env.PORT) || 3000;
    console.log(`Der Factsheet-Generator läuft bereits auf Port ${port}.`);
    if (!flag('kein-browser')) openBrowser(`http://127.0.0.1:${port}`);
    process.exit(0);
  }
  throw e;
}

startHotfolder(base, { provider });
console.log(`Arbeitsordner: ${base}`);
console.log('Dieses Fenster offen lassen. Beenden mit Ctrl+C.');
if (!flag('kein-browser')) openBrowser(url);
