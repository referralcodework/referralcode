// Shared drawing helpers for the share-card and meme generators. Everything renders locally in the browser.

export const FONTS = {
  display: '"Space Grotesk Variable", system-ui, sans-serif',
  body: '"Inter Variable", system-ui, sans-serif',
  meme: 'Anton, Impact, "Arial Black", sans-serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
};

export async function ensureFonts() {
  await Promise.allSettled([
    document.fonts.load(`700 64px ${FONTS.display}`),
    document.fonts.load(`500 32px ${FONTS.display}`),
    document.fonts.load(`600 32px ${FONTS.body}`),
    document.fonts.load(`400 64px ${FONTS.meme}`),
  ]);
}

const imgCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  if (!imgCache.has(src)) {
    imgCache.set(src, new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    }));
  }
  return imgCache.get(src)!;
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function grid(ctx: CanvasRenderingContext2D, w: number, h: number, step: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= w; x += step) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
  for (let y = 0; y <= h; y += step) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
  ctx.stroke();
  ctx.restore();
}

/** Logo inside a gradient ring, centred at (cx, cy). */
export async function logoBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const logo = await loadImage('/logo.png');
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.25)';
  ctx.shadowBlur = r * 0.25;
  ctx.shadowOffsetY = r * 0.08;
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, '#22c55e');
  g.addColorStop(1, '#166534');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  const inner = r * 0.88;
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();
  ctx.clip();
  const s = inner * 1.8;
  ctx.drawImage(logo, cx - s / 2, cy - s / 2, s, s);
  ctx.restore();
}

/** Word-wrap into at most `maxLines`, shrinking the font until it fits. Returns the lines and chosen size. */
export function fitText(ctx: CanvasRenderingContext2D, text: string, font: (size: number) => string, maxWidth: number, startSize: number, minSize: number, maxLines: number) {
  for (let size = startSize; size >= minSize; size -= 2) {
    ctx.font = font(size);
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { lines, size };
  }
  ctx.font = font(minSize);
  return { lines: wrap(ctx, text, maxWidth).slice(0, maxLines), size: minSize };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width <= maxWidth || !line) line = test;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'));
}

export async function download(canvas: HTMLCanvasElement, filename: string) {
  const url = URL.createObjectURL(await canvasBlob(canvas));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Native share sheet with the image attached (mobile), so it can go straight into an X post. */
export async function shareImage(canvas: HTMLCanvasElement, filename: string, text: string, url: string): Promise<'shared' | 'unsupported' | 'cancelled'> {
  try {
    const file = new File([await canvasBlob(canvas)], filename, { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) return 'unsupported';
    await navigator.share({ files: [file], text: `${text} ${url}` });
    return 'shared';
  } catch (e) {
    return (e as DOMException)?.name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}
