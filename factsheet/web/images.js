// Bilder beim Hochladen aufbereiten: Ausrichtung korrigieren, auf max. 2000 px verkleinern,
// als JPEG speichern (Grundrisse als PNG, damit Linien scharf bleiben).
export async function prepareImage(file, { maxSize = 2000, keepPng = false } = {}) {
  if (!/^image\/(jpeg|png)$/.test(file.type)) throw new Error(`${file.name}: nur JPEG- oder PNG-Bilder.`);
  if (file.size > 40 * 1024 * 1024) throw new Error(`${file.name}: Bild ist grösser als 40 MB.`);
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const f = Math.min(1, maxSize / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * f);
  c.height = Math.round(bmp.height * f);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return keepPng && file.type === 'image/png' ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.86);
}

// Bildart aus dem Dateinamen erraten (wie im Eingangsordner)
export function guessKind(name) {
  const n = name.toLowerCase();
  if (n.includes('grundriss') || n.includes('plan')) return 'Grundriss';
  if (/innen|wohnen|küche|kueche|bad|zimmer|interior/.test(n)) return 'Innen';
  if (/umgebung|lage|luftbild|situation|region/.test(n)) return 'Umgebung';
  return 'Aussen';
}

export const captionFromName = (name) => name.replace(/\.(jpe?g|png)$/i, '').replace(/^(grundriss|innen|aussen|umgebung)[\s_-]*/i, '').replace(/[_-]+/g, ' ').trim();
