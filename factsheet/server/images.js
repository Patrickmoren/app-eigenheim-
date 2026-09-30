// Bildverarbeitung ohne native Abhängigkeiten: Data-URL prüfen, Format per Signatur
// bestimmen, Pixelmasse lesen und den Zuschnitt für einen festen Bildrahmen berechnen.
// Der Browser verkleinert Bilder bereits vor dem Hochladen (max. 2000 px, JPEG).

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export function decodeDataUrl(dataUrl) {
  const m = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Bildformat nicht unterstützt (nur JPEG oder PNG).');
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > MAX_IMAGE_BYTES) throw new Error('Bild ist grösser als 8 MB.');
  const info = imageInfo(buf);
  if (!info) throw new Error('Bilddatei ist beschädigt oder kein gültiges JPEG/PNG.');
  return { buffer: buf, ...info };
}

export function imageInfo(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { type: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // SOF0..SOF15 ausser DHT(C4), JPG(C8), DAC(CC)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { type: 'jpg', height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
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
    const keep = frame / img;
    const side = ((1 - keep) / 2) * 100;
    return { left: side, right: side, top: 0, bottom: 0 };
  }
  const keep = img / frame;
  const side = ((1 - keep) / 2) * 100;
  return { top: side, bottom: side, left: 0, right: 0 };
}

export function decodeImages(images = {}) {
  const out = {};
  const errors = [];
  for (const [slot, url] of Object.entries(images || {})) {
    if (!url) continue;
    try { out[slot] = decodeDataUrl(url); } catch (e) { errors.push(`${slot}: ${e.message}`); }
  }
  return { images: out, errors };
}
