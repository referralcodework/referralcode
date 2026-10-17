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

const RAIN = ['fartcoin', 'pnut', 'moodeng', 'goat', 'chillguy', 'bert', 'ban', 'neet', 'fwog', 'ufd', 'pippin', 'vine'];

/** Make it rain: memecoin logos, pills and the $REFERRAL logo fall from the sky. */
export function coinRain(count = 60) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    const el = document.createElement(roll < 0.2 ? 'span' : 'img');
    if (el instanceof HTMLImageElement) {
      el.src = roll < 0.3 ? '/logo-72.png' : `/coins/${RAIN[Math.floor(Math.random() * RAIN.length)]}.webp`;
      el.alt = '';
    } else el.textContent = '💊';
    const size = 28 + Math.random() * 30;
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = `position:fixed;top:-70px;left:${Math.random() * 100}vw;width:${size}px;height:${size}px;font-size:${size * 0.8}px;line-height:1;border-radius:9999px;border:2px solid #0b1a10;background:#fff;z-index:130;pointer-events:none;object-fit:cover;`;
    if (!(el instanceof HTMLImageElement)) el.style.border = el.style.background = 'none';
    document.body.appendChild(el);
    const drift = (Math.random() - 0.5) * 200;
    el.animate(
      [{ transform: 'translate(0,0) rotate(0)' }, { transform: `translate(${drift}px, ${innerHeight + 140}px) rotate(${(Math.random() - 0.5) * 900}deg)` }],
      { duration: 1800 + Math.random() * 1800, delay: Math.random() * 1400, easing: 'cubic-bezier(.35,0,.65,1)', fill: 'backwards' },
    ).onfinish = () => el.remove();
  }
}
