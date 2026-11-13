// Objektablage im Browser (IndexedDB). Jedes Objekt: { id, updatedAt, property, texts, aiOriginal }.
// Die Daten bleiben auf diesem Gerät; zum Weitergeben dient «Projekt speichern» (JSON-Datei).
const DB = 'schaeppi-verkaufsunterlagen';
const STORE = 'objekte';

let dbPromise = null;
function db() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      let req;
      try { req = indexedDB.open(DB, 1); } catch (e) { reject(e); return; }
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch(() => null); // ohne IndexedDB (z. B. privates Fenster): nur Arbeitsspeicher
  }
  return dbPromise;
}

const memory = new Map();

function tx(mode, fn) {
  return db().then((d) => {
    if (!d) return fn(null);
    return new Promise((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const s = t.objectStore(STORE);
      let result;
      Promise.resolve(fn(s)).then((r) => { result = r; });
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
    });
  });
}

const req = (r) => new Promise((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });

export function newId() {
  return `obj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listObjects() {
  const all = await tx('readonly', (s) => (s ? req(s.getAll()) : [...memory.values()]));
  return (all || []).sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

export async function getObject(id) {
  return tx('readonly', (s) => (s ? req(s.get(id)) : memory.get(id)));
}

export async function saveObject(obj) {
  const rec = { ...obj, updatedAt: new Date().toISOString() };
  memory.set(rec.id, rec);
  await tx('readwrite', (s) => (s ? req(s.put(rec)) : null)).catch(() => {});
  return rec;
}

export async function deleteObject(id) {
  memory.delete(id);
  await tx('readwrite', (s) => (s ? req(s.delete(id)) : null)).catch(() => {});
}
