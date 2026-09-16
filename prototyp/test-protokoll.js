const {chromium}=require('playwright');
let ok=0, fail=0;
const T=(n,b,i="")=>{ if(b){ok++;console.log("  ✓ "+n+(i?"  "+i:""));} else {fail++;console.log("  ✗ "+n+"  "+i);} };
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const url='file://'+process.cwd()+'/preview.html';
  const neu=async(w=1280,h=900)=>{ const p=await b.newPage({viewport:{width:w,height:h},timezoneId:'Europe/Zurich',locale:'de-CH'});
    p.errs=[]; p.on('pageerror',e=>p.errs.push(String(e).split('\n')[0])); return p; };
  let p=await neu(); await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(500);
  const txt=async s=>(await p.textContent(s)).replace(/\s+/g,' ').trim();

  console.log("\n1 · START UND NAVIGATION");
  T("Start ohne Fehler", p.errs.length===0, p.errs[0]||"");
  T("Dashboard geladen", (await txt('h1'))==="Mein Arbeitstag");
  for(const n of ['faelle','auswertung','stammdaten','hilfe','dashboard']){ await p.click(`[data-nav="${n}"]`); await p.waitForTimeout(170); }
  for(const br of ['abnahme','vermietung','abrechnung']){ await p.click(`#rail [data-bereich="${br}"]`); await p.waitForTimeout(170); }
  T("Alle Ansichten fehlerfrei", p.errs.length===0, p.errs[0]||"");

  console.log("\n2 · DATENSATZ ÖFFNEN, BEARBEITEN, SPEICHERN");
  const eigen=await p.evaluate(()=>{const f=FAELLE.find(x=>x.bewirtschafter==="Moren"&&!x.abgeschlossen);ST.nav="fall";ST.fallId=f.id;merkeZuletzt(f.id);render();return f.id;});
  await p.waitForTimeout(300);
  T("Eigener Fall geöffnet", !!eigen, eigen);
  T("Zuletzt-Liste geführt", await p.evaluate(()=>ST.zuletzt.length>0));
  const k=await p.evaluate(()=>{const f=fall(ST.fallId);const n=naechsterSchritt(f);return n&&n.art==="schritt"?n.schritt.k:null;});
  if(k){ await p.click(`[data-do="${k}"]`); await p.waitForTimeout(400);
    T("Schritt erledigt", await p.evaluate(({k,id})=>fall(id)?fall(id).schritte[k].status==="erledigt":true,{k,id:eigen})); }
  else T("Schritt erledigt", false, "kein Schritt als nächstes");
  T("in localStorage geschrieben", await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem("leerstandsmanager.demo.v1"));return d.v===2&&d.faelle.length>0;}));
  await p.evaluate(()=>{const f=FAELLE.find(x=>x.bewirtschafter==="Moren"&&!x.abgeschlossen);ST.nav="fall";ST.fallId=f.id;render();});
  await p.waitForTimeout(250);
  await p.fill('#fl_notiz','Schlüssel beim Hauswart – "Nr. 3" & Ersatz.');
  await p.dispatchEvent('#fl_notiz','change'); await p.waitForTimeout(350);
  T("Notiz gespeichert", await p.evaluate(()=>fall(ST.fallId).notiz.includes("Hauswart")));
  T("Notiz sparsam protokolliert", await p.evaluate(()=>fall(ST.fallId).historie[0].txt==="Notiz geändert"));
  T("Sonderzeichen unverfälscht", await p.evaluate(()=>fall(ST.fallId).notiz.includes('"Nr. 3" &')));
  T("Drucken-Schaltfläche vorhanden", (await p.$$('#btnDrucken')).length===1);

  console.log("\n3 · SUCHE, FILTER, SORTIERUNG");
  await p.click('[data-nav="faelle"]'); await p.waitForTimeout(250);
  const alle=await p.evaluate(()=>gefiltert().length);
  await p.fill('#gq','Seestrasse'); await p.waitForTimeout(450);
  T("Suche filtert", (await p.evaluate(()=>gefiltert().length))<alle);
  await p.fill('#gq','Hauswart'); await p.waitForTimeout(450);
  T("Suche findet Notiz", (await p.evaluate(()=>gefiltert().length))>0);
  await p.fill('#gq',''); await p.waitForTimeout(450);
  await p.selectOption('#fbew','Moren'); await p.waitForTimeout(250);
  T("Bewirtschafter-Filter", await p.evaluate(()=>gefiltert().every(f=>f.bewirtschafter==="Moren")));
  await p.fill('#fvon','2026-09-01'); await p.dispatchEvent('#fvon','change'); await p.waitForTimeout(300);
  T("Datumsfilter ab", await p.evaluate(()=>gefiltert().every(f=>f.haftungsdatum>="2026-09-01")));
  T("Zurücksetzen sichtbar", (await p.$$('#btnFilterReset')).length>0);
  await p.click('#btnFilterReset'); await p.waitForTimeout(300);
  T("Filter zurückgesetzt", (await p.evaluate(()=>gefiltert().length))===alle);
  T("überfällige zuerst sortiert", await p.evaluate(()=>{const l=gefiltert();let s=false;
    for(const f of l){ if(!istUeberfaellig(f)) s=true; else if(s) return false; } return true;}));

  console.log("\n4 · STATUS UND WORKFLOW");
  T("Abschluss bei vollständiger Phase 5", await p.evaluate(()=>{
    ST.rolle="leitung";ST.ich="BS Gesamt";ST.team="gesamt";
    const f=FAELLE.find(x=>abschliessbar(x)); if(!f) return false;
    abschliessen(f.id); return !!f.abgeschlossen;}));
  T("Abschluss blockiert bei offenen Schritten", await p.evaluate(()=>{
    const f=FAELLE.find(x=>!x.abgeschlossen&&!abschliessbar(x));
    abschliessen(f.id); return !f.abgeschlossen;}));
  T("Zurückstellen mit Datum", await p.evaluate(()=>{
    const f=FAELLE.find(x=>!x.abgeschlossen);
    zurueckstellenAuf(f.id, tage(7));
    return f.wiedervorlage && f.wiedervorlage.datum===tage(7);}));
  T("Zurückstellen weist Vergangenheit ab", await p.evaluate(()=>{
    const f=FAELLE.find(x=>!x.abgeschlossen&&!x.wiedervorlage);
    zurueckstellenAuf(f.id, tage(-5)); return !f.wiedervorlage;}));

  console.log("\n5 · LÖSCHEN");
  await p.evaluate(()=>{ST.rolle="leitung";ST.ich="BS Gesamt";ST.team="gesamt";ST.nav="fall";ST.fallId=FAELLE[0].id;render();});
  await p.waitForTimeout(250);
  const vor=await p.evaluate(()=>FAELLE.length);
  await p.click('[data-loeschen]'); await p.waitForTimeout(300);
  T("Bestätigung erscheint", (await txt('.modal h2')).includes("löschen"));
  await p.click('[data-cancel]'); await p.waitForTimeout(250);
  T("Abbrechen löscht nicht", (await p.evaluate(()=>FAELLE.length))===vor);
  await p.evaluate(()=>{ST.nav="fall";ST.fallId=FAELLE[0].id;render();}); await p.waitForTimeout(250);
  await p.click('[data-loeschen]'); await p.waitForTimeout(250);
  await p.click('#btnBestaetigen'); await p.waitForTimeout(400);
  T("Löschen ausgeführt", (await p.evaluate(()=>FAELLE.length))===vor-1);
  await p.evaluate(()=>{ST.rolle="bewirtschafter";ST.ich="Moren";ST.team="bs02";
    ST.nav="fall";ST.fallId=FAELLE.find(f=>f.bewirtschafter==="Moren").id;render();});
  await p.waitForTimeout(250);
  T("Bewirtschafter sieht kein Löschen", (await p.$$('[data-loeschen]')).length===0);

  console.log("\n6 · FORMULARE");
  await p.evaluate(()=>{ST.nav="dashboard";render();}); await p.waitForTimeout(200);
  await p.click('#btnNeu'); await p.waitForTimeout(350);
  const dup=await p.evaluate(()=>{const m={},d=[];document.querySelectorAll('[id]').forEach(e=>{m[e.id]=(m[e.id]||0)+1});for(const x in m) if(m[x]>1) d.push(x); return d;});
  T("keine doppelten DOM-Ids", dup.length===0, dup.join(","));
  T("Fokus im Dialog", await p.evaluate(()=>!!document.activeElement.closest('.modal')));
  await p.click('#nfSave'); await p.waitForTimeout(300);
  const fehler=await txt('#nfErr');
  T("Pflichtfeldmeldung ohne Technikjargon", fehler.includes("Objekt")&&!/undefined|NaN|\bnull\b/.test(fehler));
  await p.selectOption('#nfObj','O01'); await p.waitForTimeout(300);
  T("Dublettenwarnung", (await txt('#nfDup')).includes("bereits ein Fall offen"));
  await p.fill('#nfEx','Müller & Cie'); await p.fill('#nfKue','2026-09-01'); await p.fill('#nfHaft','2026-08-01');
  await p.click('#nfSave'); await p.waitForTimeout(300);
  T("Datumsplausibilität greift", (await txt('#nfErr')).includes("Haftungsdatum liegt vor"));
  await p.fill('#nfHaft','2026-11-30'); await p.click('#nfSave'); await p.waitForTimeout(400);
  T("Fall angelegt, Umlaute erhalten", await p.evaluate(()=>FAELLE.some(f=>f.exMieter==="Müller & Cie")));
  await p.close();

  console.log("\n7 · BESCHÄDIGTE DATEN");
  for(const [name,js] of [
    ["Objekt unbekannt",`d.faelle[0].objektId="WEG"`],
    ["schritte fehlt",`delete d.faelle[0].schritte`],
    ["historie fehlt",`delete d.faelle[0].historie`],
    ["einzelner Schritt fehlt",`delete d.faelle[0].schritte.wa`],
    ["unbekannter Schritt",`d.faelle[0].schritte.xx={status:"erledigt"}`],
    ["Datum ist Unsinn",`d.faelle[0].haftungsdatum="morgen"`],
    ["falsche Typen",`d.faelle[0].schritte.wa="kaputt";d.faelle[0].historie="nix"`],
    ["Bewirtschafter unbekannt",`d.faelle[0].bewirtschafter="Niemand"`],
    ["Datensatz ist null",`d.faelle.unshift(null)`]
  ]){
    const q=await neu(); await q.goto(url,{waitUntil:'domcontentloaded'}); await q.waitForTimeout(350);
    const r=await q.evaluate((js)=>{
      const KEY="leerstandsmanager.demo.v1"; speichern();
      const d=JSON.parse(localStorage.getItem(KEY));
      eval(js); localStorage.setItem(KEY,JSON.stringify(d));
      try{ laden();
        for(const n of ["dashboard","faelle","auswertung","stammdaten"]){ST.nav=n;render();}
        ST.nav="fall";ST.fallId=FAELLE[0].id;render(); return "ok";
      }catch(e){ return "ABSTURZ: "+e.message; }
    },js);
    T(name.padEnd(24), r==="ok", r==="ok"?"":r);
    await q.close();
  }
  { const q=await neu();
    await q.addInitScript(()=>{ try{localStorage.setItem("leerstandsmanager.demo.v1","{kein json");}catch(e){} });
    await q.goto(url,{waitUntil:'domcontentloaded'}); await q.waitForTimeout(400);
    T("Speicher ist Müll".padEnd(24), await q.evaluate(()=>FAELLE.length>0) && q.errs.length===0, q.errs[0]||"");
    await q.close(); }

  console.log("\n8 · SICHERHEIT");
  p=await neu(); await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  const xss=await p.evaluate(()=>{
    window.__xss=false;
    FAELLE[0].exMieter='<img src=x onerror="window.__xss=true">';
    FAELLE[0].id='X" onmouseover="window.__xss=true" data-y="';
    FAELLE[0].notiz='</textarea><script>window.__xss=true<\/script>';
    ST.nav="faelle";render(); ST.nav="dashboard";render();
    const el=document.querySelector('[data-open]');
    return {aus:window.__xss, handler:!!(el&&[...el.attributes].some(a=>a.name.startsWith("on")))};
  });
  T("kein Skript ausgeführt", xss.aus===false);
  T("kein eingeschleuster Event-Handler", xss.handler===false);
  const xss2=await p.evaluate(()=>{ window.__xss2=false;
    const f=FAELLE.find(x=>x.bewirtschafter==="Moren"); f.notiz='</textarea><img src=x onerror="window.__xss2=true">';
    ST.nav="fall";ST.fallId=f.id;render(); return window.__xss2; });
  T("Notiz-Ausbruch aus textarea verhindert", xss2===false);
  T("keine Konsolenfehler", p.errs.length===0, p.errs[0]||"");
  await p.close();

  console.log("\n9 · LEERE UND GROSSE DATENMENGEN");
  p=await neu(); await p.goto(url,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  T("leerer Bestand", (await p.evaluate(()=>{try{FAELLE.length=0;
    for(const n of ["dashboard","faelle","auswertung","stammdaten"]){ST.nav=n;render();}return "ok";}catch(e){return e.message;}}))==="ok");
  const perf=await p.evaluate(()=>{
    const v=JSON.stringify(demodaten()[0]); const g=[];
    for(let i=0;i<500;i++){const f=JSON.parse(v);f.id="P"+i;f.objektId=OBJEKTE[i%OBJEKTE.length].id;f.bewirtschafter=BEWIRTSCHAFTER[i%9];g.push(f);}
    FAELLE=g.map(normalisiereFall);ST.rolle="leitung";ST.ich="BS Gesamt";ST.team="gesamt";
    const m=n=>{ST.nav=n;const t=performance.now();render();return Math.round(performance.now()-t);};
    return {d:m("dashboard"),f:m("faelle"),a:m("auswertung")};
  });
  T("500 Fälle flüssig", perf.d<250&&perf.f<250, `Dashboard ${perf.d}ms · Liste ${perf.f}ms · Auswertung ${perf.a}ms`);
  await p.close();

  console.log("\n10 · RESPONSIVE");
  for(const [w,h,n] of [[1440,900,"Desktop"],[1024,768,"Laptop"],[768,1024,"Tablet"],[390,844,"Smartphone"]]){
    const q=await neu(w,h); await q.goto(url,{waitUntil:'domcontentloaded'}); await q.waitForTimeout(400);
    await q.click('[data-nav="faelle"]'); await q.waitForTimeout(250);
    T(n.padEnd(11)+" ohne Querlauf",
      !(await q.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1)), `${w}×${h}`);
    await q.close();
  }
  await b.close();
  console.log(`\n═══ ${ok} bestanden, ${fail} fehlgeschlagen ═══`);
})();
