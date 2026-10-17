const EMOJI = ['💸', '🤝', '🟢', '💊', '🎟️', '🤑', '💚'];

/** Emoji confetti bursting from a point (or an element's center). No-op with reduced motion. */
export function confetti(from: Element | { x: number; y: number }, count = 26) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let x: number, y: number;
  if (from instanceof Element) {
    const r = from.getBoundingClientRect();
    x = r.left + r.width / 2;
    y = r.top + r.height / 2;
  } else ({ x, y } = from);

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = EMOJI[Math.floor(Math.random() * EMOJI.length)];
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;z-index:120;pointer-events:none;font-size:${18 + Math.random() * 16}px;will-change:transform,opacity;`;
    document.body.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 170;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 120;
    const spin = (Math.random() - 0.5) * 720;
    el.animate(
      [
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${spin / 2}deg) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 260}px)) rotate(${spin}deg) scale(.9)`, opacity: 0 },
      ],
      { duration: 1100 + Math.random() * 600, easing: 'cubic-bezier(.2,.7,.3,1)' },
    ).onfinish = () => el.remove();
  }
}
