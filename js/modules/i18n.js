// Minimal FR/EN — spec: everything visible must be translatable
let contentRef = null;
let lang = 'fr';

export function getLang() { return lang; }

function pick(obj, l) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[l] || obj.en || obj.fr || '';
}

function lookup(path, l) {
  const parts = path.split('.');
  let cur = contentRef?.i18n;
  for (const p of parts) { cur = cur?.[p]; if (cur === undefined) return null; }
  if (cur && typeof cur === 'object' && ('fr' in cur || 'en' in cur)) return pick(cur, l);
  return null;
}

export function initI18n(content) {
  contentRef = content;
  const url = new URL(location.href);
  const q = url.searchParams.get('lang');
  const saved = localStorage.getItem('lang');
  const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
  lang = (q && ['fr', 'en'].includes(q)) ? q
    : (saved && ['fr', 'en'].includes(saved)) ? saved
    : (['fr', 'en'].includes(nav) ? nav : 'fr');
  apply();
  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}

export function setLang(next) {
  if (!['fr', 'en'].includes(next)) next = 'fr';
  lang = next;
  try {
    localStorage.setItem('lang', lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
  } catch {}
  apply();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = lookup(el.getAttribute('data-i18n'), lang);
    if (v !== null) el.textContent = v;
  });
  document.querySelectorAll('.lang button').forEach((b) => {
    const on = b.dataset.lang === lang;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}
