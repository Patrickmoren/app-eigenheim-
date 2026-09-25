// Simulation der Spielregeln von KIPP. Liest die Regeln direkt aus index.html
// (gleicher Code wie im Spiel), spielt tausende Partien und prüft:
//  1. Invarianten (gültige Züge, kein Stein geht verloren, jede Partie endet)
//  2. Schwierigkeit je Level (Siegquote verschieden starker Testspieler)
//  3. Online-Duell (gleicher Code = gleiche Steine, Punkte streuen)
// Aufruf: node ideen/spiel-kipp/test/simulation.js [Partien pro Level]
const fs = require("fs"), path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const cut = (a, b) => { const i = html.indexOf(a), j = html.indexOf(b); if (i < 0 || j < 0) throw new Error("Abschnitt fehlt: " + a); return html.slice(i, j) };
const src = cut("function hashStr", "const esc =") + cut("const WORLDS", "const label=");
const R = new Function(src + "; return {hashStr,mulberry,LEVELS,KEYS,STEP,MIN_LIM,TURM,makeBag,emptyBoard,torque,safeMoves,limFor,starsFor,applyMove,chooseMove};")();

let fehler = 0;
const pruefe = (ok, text) => { if (!ok) { fehler++; if (fehler <= 20) console.log("FEHLER:", text) } };
const N = +process.argv[2] || 200;

function partie(o, stufen, rnd, start) {
  const G = { opt: o, base: o.lim, placed: 0, bag: R.makeBag(o, rnd), hands: [[], []], board: R.emptyBoard() };
  for (let i = 0; i < 3; i++) { G.hands[0].push(G.bag.pop()); G.hands[1].push(G.bag.pop()) }
  let p = start; const moves = [0, 0];
  for (let z = 0; z < 400; z++) {
    pruefe(G.hands[p].length === 3, "Hand hat nicht 3 Steine");
    const m = R.chooseMove(G, p, stufen[p], rnd);
    pruefe(m && m.i >= 0 && m.i < G.hands[p].length && R.KEYS.includes(m.k), "ungültiger Zug");
    const vorher = Object.values(G.board).reduce((a, s) => a + s.length, 0);
    const kipp = R.applyMove(G, p, m, rnd); moves[p]++;
    pruefe(Object.values(G.board).reduce((a, s) => a + s.length, 0) === vorher + 1, "Stein nicht gelegt");
    const d = Math.abs(R.torque(G.board).diff), lim = R.limFor(G.base, G.placed - 1);
    pruefe(kipp === (d > lim), "Kippen falsch erkannt");
    if (kipp) return { loser: p, moves };
    p = 1 - p;
  }
  pruefe(false, "Partie endet nicht nach 400 Zügen"); return { loser: null, moves };
}

const rnd = R.mulberry(2026);
console.log("Level | Grenze | Computer | Anfänger* | Guter Spieler* | Profi* | Ø Züge | 3★ (Guter Spieler)");
R.LEVELS.forEach((o, i) => {
  const res = { a: 0, g: 0, p: 0, z: 0, s3: 0 }; const NP = Math.max(20, Math.floor(N / 5));
  for (let n = 0; n < N; n++) {
    const start = i < 2 ? 0 : (rnd() < .5 ? 0 : 1);
    const a = partie(o, [1.5, o.cpu], rnd, start); if (a.loser === 1) res.a++;
    const g = partie(o, [3, o.cpu], rnd, start); if (g.loser === 1) { res.g++; if (R.starsFor(g.moves[0], o.lim) === 3) res.s3++ } res.z += g.moves[0];
  }
  for (let n = 0; n < NP; n++) { const pr = partie(o, [4, o.cpu], rnd, n % 2); if (pr.loser === 1) res.p++ }
  const pc = (x, t) => String(Math.round(x / t * 100)).padStart(3) + " %";
  console.log(`${String(i + 1).padStart(5)} | ${String(o.lim).padStart(6)} | ${String(o.cpu).padStart(8)} | ${pc(res.a, N).padStart(9)} | ${pc(res.g, N).padStart(14)} | ${pc(res.p, NP).padStart(6)} | ${(res.z / N).toFixed(1).padStart(6)} | ${pc(res.s3, Math.max(1, res.g))}`);
});
console.log("* Testspieler: Anfänger = zufällig sichere Züge, Guter Spieler = rechnet einen Zug voraus, Profi = probiert jeden Zug in Weiterspielen aus.");

// Online-Duell: gleicher Code = gleiche Steine; Punkteverteilung eines vorsichtigen Spielers
function turm(seed, klug) {
  const rnd2 = R.mulberry(R.hashStr("turm:" + seed));
  const G = { opt: R.TURM, base: R.TURM.lim, placed: 0, bag: R.makeBag(R.TURM, rnd2), hands: [[], []], board: R.emptyBoard() };
  for (let i = 0; i < 3; i++) G.hands[0].push(G.bag.pop());
  const folge = [];
  for (let z = 0; z < 300; z++) {
    const lim = R.limFor(G.base, G.placed), nl = R.limFor(G.base, G.placed + 1);
    const safe = R.safeMoves(G.board, G.hands[0], lim);
    let m = safe.length ? safe[0] : { i: 0, k: "L4" };
    if (klug && safe.length) { let best = 1e9; for (const s of safe) { const b = JSON.parse(JSON.stringify(G.board)); b[s.k].push({ w: s.w }); const d = Math.abs(R.torque(b).diff) + (s.w >= 8 ? 1 : 0) - (s.w < 0 ? 0.5 : 0); if (d < best) { best = d; m = s } } }
    folge.push(G.hands[0][m.i]);
    if (R.applyMove(G, 0, m, rnd2)) return { score: G.placed - 1, folge };
  }
  return { score: 300, folge };
}
const t1 = turm("abc123", true), t2 = turm("abc123", true);
pruefe(JSON.stringify(t1) === JSON.stringify(t2), "gleicher Code ergibt andere Runde");
const scores = []; for (let n = 0; n < 300; n++) scores.push(turm(n.toString(36).padStart(6, "0"), true).score);
scores.sort((a, b) => a - b);
console.log(`\nOnline-Duell (vorsichtiger Spieler, 300 Runden): min ${scores[0]}, Median ${scores[150]}, max ${scores[299]} Steine`);
pruefe(scores[299] < 300, "Online-Runde endet nie");
pruefe(scores[299] - scores[0] >= 5, "Punkte streuen zu wenig");

console.log(fehler ? `\n${fehler} FEHLER gefunden` : `\nKeine Regelfehler (${R.LEVELS.length * (2 * N)} Partien und 300 Online-Runden geprüft)`);
process.exit(fehler ? 1 : 0);
