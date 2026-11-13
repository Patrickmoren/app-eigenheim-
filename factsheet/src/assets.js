// Feste Gestaltungsdateien (Logos, Schrift) für die Dokumenterzeugung.
//
// Der Kern läuft im Browser und in Node. Deshalb lädt nicht er selbst die Dateien, sondern die
// jeweilige Umgebung: einmal loadAssets(loader) aufrufen, wobei loader(pfad) -> Uint8Array liefert
// (Node: Dateisystem, Browser: fetch). Danach sind alle Dateien synchron verfügbar.

export const ASSET_FILES = [
  'logo/schaeppi-1zeilig-navy.png',
  'logo/schaeppi-1zeilig-weiss.png',
  'logo/schaeppi-2zeilig-navy.png',
  'logo/schaeppi-2zeilig-weiss.png',
  'logo/schaeppi-2zeilig-blau.png',
  'fonts/IBMPlexSans-Regular.ttf',
];

const store = new Map();
let pending = null;

export function loadAssets(loader) {
  if (!pending) {
    pending = Promise.all(ASSET_FILES.map(async (f) => store.set(f, new Uint8Array(await loader(f)))))
      .catch((e) => { pending = null; throw e; });
  }
  return pending;
}

export function asset(rel) {
  const a = store.get(rel);
  if (!a) throw new Error(`Gestaltungsdatei ${rel} ist nicht geladen (loadAssets vergessen?).`);
  return a;
}

// PNG-Abmessungen aus dem Dateikopf
export function pngSize(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: v.getUint32(16), height: v.getUint32(20) };
}
