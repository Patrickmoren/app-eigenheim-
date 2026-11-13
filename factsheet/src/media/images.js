// Bildverarbeitung ohne native Abhängigkeiten (Browser und Node): Data-URL prüfen, Format per
// Signatur bestimmen, Pixelmasse lesen und den Zuschnitt für einen festen Bildrahmen berechnen.
// Der Browser verkleinert Bilder bereits beim Hochladen (max. 2000 px, JPEG).

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function base64ToBytes(b64) {
  if (typeof globalThis.Buffer !== 'undefined') return new Uint8Array(globalThis.Buffer.from(b64, 'base64'));
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function decodeDataUrl(dataUrl) {
  const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Bildformat nicht unterstützt (nur JPEG oder PNG).');
  if (m[2].length * 0.75 > MAX_IMAGE_BYTES) throw new Error('Bild ist grösser als 8 MB.');
  const bytes = base64ToBytes(m[2]);
  const info = imageInfo(bytes);
  if (!info) throw new Error('Bilddatei ist beschädigt oder kein gültiges JPEG/PNG.');
  return { buffer: bytes, ...info };
}

export function imageInfo(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length > 24 && v.getUint32(0) === 0x89504e47) {
    return { type: 'png', width: v.getUint32(16), height: v.getUint32(20) };
  }
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i + 9 < bytes.length) {
      if (bytes[i] !== 0xff) { i++; continue; }
      const marker = bytes[i + 1];
      const len = v.getUint16(i + 2);
      // SOF0..SOF15 ausser DHT(C4), JPG(C8), DAC(CC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { type: 'jpg', height: v.getUint16(i + 5), width: v.getUint16(i + 7) };
      }
      i += 2 + len;
    }
  }
  return null;
}

// Zuschnitt (in Prozent je Kante), damit ein Bild den Rahmen vollständig und mittig füllt –
// entspricht «object-fit: cover» in der Vorschau.
export function coverCrop(imgW, imgH, frameW, frameH) {
  const img = imgW / imgH, frame = frameW / frameH;
  if (Math.abs(img - frame) < 0.005) return undefined;
  if (img > frame) {
    const side = ((1 - frame / img) / 2) * 100;
    return { left: side, right: side, top: 0, bottom: 0 };
  }
  const side = ((1 - img / frame) / 2) * 100;
  return { top: side, bottom: side, left: 0, right: 0 };
}

// Dekodiert alle Bilder eines Objekts. Einzelbilder (cover, object, …) und Bildlisten (gallery).
export function decodeImages(images = {}) {
  const out = {};
  const errors = [];
  for (const [slot, val] of Object.entries(images || {})) {
    if (!val) continue;
    if (Array.isArray(val)) {
      out[slot] = [];
      val.forEach((it, i) => {
        try { out[slot].push({ ...decodeDataUrl(it.src), caption: it.caption || '', kind: it.kind || '' }); } catch (e) { errors.push(`${slot} ${i + 1}: ${e.message}`); }
      });
      continue;
    }
    try { out[slot] = decodeDataUrl(val); } catch (e) { errors.push(`${slot}: ${e.message}`); }
  }
  return { images: out, errors };
}
