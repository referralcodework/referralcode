/** Accessible toast (one at a time, announced via a live region). */
let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(message: string, tone: 'ok' | 'error' = 'ok') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.className = 'pointer-events-none fixed inset-x-0 bottom-6 z-[100] mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full px-6 py-3 text-center font-semibold text-white shadow-2xl transition duration-300 opacity-0 translate-y-4';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.toggle('bg-brand-700', tone === 'ok');
  el.classList.toggle('bg-red-600', tone === 'error');
  requestAnimationFrame(() => el!.classList.remove('opacity-0', 'translate-y-4'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el!.classList.add('opacity-0', 'translate-y-4'), 2200);
}

/** Clipboard with a fallback for in-app wallet/Telegram browsers that block the async API. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function xIntent(text: string, url?: string) {
  const p = new URLSearchParams({ text });
  if (url) p.set('url', url);
  return `https://x.com/intent/post?${p}`;
}
