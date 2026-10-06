// Lädt den Rechner in Chromium und vergleicht mit dem Ergebnis der Excel-Prüfung (CHF 1'786, 21.12.2026).
import { createRequire } from "module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { fileURLToPath } from "url";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("file://" + fileURLToPath(new URL("./index.html", import.meta.url)));
const neu = await p.textContent("#oNeu"), zu = await p.textContent("#oZu");
console.log(neu, zu);
await b.close();
const ok = neu.replace(/\D/g, "") === "178600" && zu === "21.12.2026";
console.log(ok ? "OK" : "FEHLER"); process.exit(ok ? 0 : 1);
