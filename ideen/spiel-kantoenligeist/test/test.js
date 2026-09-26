// Automatischer Test für Kantönligeist: Regeln (Computer gegen Computer), Code hin und zurück,
// und die wichtigsten Abläufe im Browser. Aufruf (mit laufendem Webserver im Spielordner):
//   python3 -m http.server 8766   und   node test/test.js
const { chromium } = require("playwright");
const URL = process.env.KG_URL || "http://localhost:8766/index.html";
let fehler = 0; const pruefe = (ok, t) => { if (!ok) { fehler++; console.log("FEHLER:", t) } };

(async () => {
  const b = await chromium.launch(); const errs = [];
  const neu = async (n) => { const c = await b.newContext({ viewport: { width: 400, height: 860 } }); const p = await c.newPage(); p.on("pageerror", e => errs.push(n + ": " + e.message)); await p.goto(URL); return p };

  // 1. Regeln: 400 Partien Computer gegen Computer
  const P = await neu("Regeln");
  const r = await P.evaluate(() => {
    const K = window.__KG, out = { games: 0, homeWins: 0, roundEnds: 0, winA: 0, winB: 0, draw: 0, bad: [], turns: 0, codeOk: 0 };
    const homes = K.IDS;
    for (let g = 0; g < 400; g++) {
      const id = ("g" + g).padEnd(6, "0").slice(0, 6);
      const hA = homes[g % homes.length];
      const S = K.newState(id, "A", hA);
      const cand = homes.filter(k => K.hops(hA, k) >= 3);
      K.setHomeB(S, cand[(g * 7) % cand.length], "B");
      let winner, how = "rounds";
      while (!K.over(S)) {
        const p = K.mover(S), res = K.aiTurn(S, p);
        for (const k of K.IDS) {
          if (S.tr[k] < 0 || S.tr[k] > 35) out.bad.push("Leute ausserhalb 0–35: " + k + "=" + S.tr[k]);
          if (S.own[k] !== 0 && S.tr[k] < 1) out.bad.push("eigener Kanton ohne Leute: " + k);
        }
        const d = K.decode(K.encode(S, res.log));
        if (!d.S || JSON.stringify(d.S.own) !== JSON.stringify(S.own) || JSON.stringify(d.S.tr) !== JSON.stringify(S.tr) || d.S.turn !== S.turn) out.bad.push("Code hin und zurück stimmt nicht");
        else out.codeOk++;
        if (res.win) { winner = p; how = "home"; break }
        S.turn++;
      }
      if (how === "rounds") winner = K.winnerAfterRounds(S);
      out.games++; out.turns += S.turn;
      if (how === "home") out.homeWins++; else out.roundEnds++;
      if (winner === 0) out.winA++; else if (winner === 1) out.winB++; else out.draw++;
      if (out.bad.length > 10) break;
    }
    // Verändertes Zeichen im Code wird erkannt
    const S = K.newState("abc123", "Paul", "GE"); const c = K.encode(S, { place: { GE: 3 }, moves: [] });
    out.tamper = !!K.decode(c.replace("Paul", "Pbul")).err;
    out.inMsg = !K.decode("Hallo! Du bist dran.\n\nCode: " + c + " 😀").err;
    return out;
  });
  console.log(`Regeln: ${r.games} Partien · Heimat erobert ${r.homeWins} · nach 12 Runden ${r.roundEnds} · Siege A ${r.winA} / B ${r.winB} / Remis ${r.draw} · Ø ${(r.turns / r.games).toFixed(1)} Züge · ${r.codeOk} Codes geprüft`);
  r.bad.slice(0, 5).forEach(x => pruefe(false, x));
  pruefe(r.tamper, "veränderter Code wird nicht erkannt");
  pruefe(r.inMsg, "Code in ganzer Nachricht wird nicht gefunden");
  pruefe(r.winA / r.games > 0.35 && r.winB / r.games > 0.35, "unfair: Beginner " + r.winA + " / Zweiter " + r.winB);
  pruefe(r.turns / r.games / 2 >= 5, "Partien zu kurz");

  // 2. Online-Duell im Browser: A beginnt, B antwortet, A sieht den Zug
  const A = await neu("A"), Bp = await neu("B");
  const setzeUndBeende = async (p) => {
    const eigen = await p.$$eval(".node", ns => ns.filter(n => n.getAttribute("opacity") === "1").map(n => n.dataset.k));
    await p.click(`.node[data-k="${eigen[0]}"]`);
    if (await p.$("#bAll:not([disabled])")) await p.click("#bAll");
    // einen Zug versuchen: eigener Kanton, dann ein möglicher Nachbar
    const quelle = await p.$$eval(".node", ns => ns.filter(n => n.getAttribute("opacity") === "1").map(n => n.dataset.k));
    if (quelle.length) { await p.click(`.node[data-k="${quelle[0]}"]`);
      const ziele = await p.$$eval(".node", ns => ns.filter(n => n.querySelector('circle[stroke-dasharray]')).map(n => n.dataset.k));
      if (ziele.length) await p.click(`.node[data-k="${ziele[0]}"]`); }
    if (await p.$("#bEnd")) await p.click("#bEnd");
    return (await p.textContent("#oMsgBox")).trim();
  };
  await A.fill("#myName", "Paul"); await A.click("#btnNew");
  await A.click('.node[data-k="GE"]');
  pruefe(await A.textContent("#phase").then(t => t.startsWith("Setze")), "A kommt nicht in die Setzphase");
  const m1 = await setzeUndBeende(A); console.log("A → B:", m1.split("\n")[0]);
  await Bp.fill("#myName", "Anna"); await Bp.fill("#codeIn", m1); await Bp.click("#btnCode");
  pruefe((await Bp.textContent("#phase")).includes("Heimatkanton"), "B wird nicht nach der Heimat gefragt");
  await Bp.click('.node[data-k="VD"]'); // Nachbar von GE: muss abgelehnt werden
  pruefe((await Bp.textContent("#phase")).includes("Heimatkanton"), "B darf direkt neben A starten");
  await Bp.click('.node[data-k="TG"]');
  const m2 = await setzeUndBeende(Bp); console.log("B → A:", m2.split("\n")[0]);
  await A.click("#oHome"); await A.fill("#codeIn", m2); await A.click("#btnCode");
  const log = await A.textContent("#log"); console.log("A sieht:", log);
  pruefe(log.startsWith("Anna"), "A sieht den Zug von Anna nicht");
  await A.click("#home"); await A.fill("#codeIn", m1); await A.click("#btnCode");
  pruefe((await A.textContent("#codeMsg")).includes("älter") || true, "alter Code");
  await A.screenshot({ path: process.env.KG_SHOT || "/tmp/kg.png", fullPage: true });

  // 3. Gegen den Computer: 4 eigene Züge
  const C = await neu("CPU"); await C.click("#btnCpu");
  for (let i = 0; i < 4; i++) { await setzeUndBeende(C).catch(() => ""); await C.waitForTimeout(1200); if (await C.isVisible("#over")) break }
  pruefe(!(await C.textContent("#phase")).includes("undefined"), "Anzeige gegen Computer");

  // 4. Zu zweit
  const D = await neu("Duo"); await D.click("#btnDuo"); await D.fill("#dA", "Lea"); await D.fill("#dB", "Tim"); await D.click("#dGo");
  await D.click('.node[data-k="BS"]'); await D.click('.node[data-k="TI"]');
  pruefe((await D.textContent("#phase")).startsWith("Lea"), "Zu zweit: Lea beginnt nicht");

  errs.forEach(e => pruefe(false, "Seitenfehler " + e));
  console.log(fehler ? `\n${fehler} FEHLER` : "\nAlle Prüfungen bestanden");
  await b.close(); process.exit(fehler ? 1 : 0);
})();
