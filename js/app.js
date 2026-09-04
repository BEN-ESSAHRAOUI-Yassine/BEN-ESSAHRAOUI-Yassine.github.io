import { initDomain, getDomain, onDomainChange } from './modules/domain.js';
import { initI18n, getLang } from './modules/i18n.js';
import { initScrollAnimations } from './modules/animations.js';
import { initNavbar } from './modules/navbar.js';
import { initContactForm } from './modules/email.js';
import { renderAll } from './modules/render.js';

let content = null;

async function load() {
  const res = await fetch('data/content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('content.json failed');
  return res.json();
}

function paintLinks() {
  const m = content.meta?.links || {};
  const set = (id, href) => { const a = document.getElementById(id); if (a && href) a.href = href; };
  set('c-linkedin', m.linkedin); set('c-github', m.github);
  set('f-linkedin', m.linkedin); set('f-github', m.github);
  const em = content.meta?.email;
  if (em) {
    const ce = document.getElementById('c-email');
    if (ce) { ce.href = `mailto:${em}`; ce.textContent = em; }
    set('f-email', `mailto:${em}`);
  }
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  const schema = document.getElementById('person-schema');
  if (schema) {
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: content.meta?.name,
      url: location.origin + location.pathname,
      sameAs: [m.linkedin, m.github].filter(Boolean),
    });
  }
}

function render() {
  renderAll(content, getDomain(), getLang());
}

function init() {
  const savedMode = localStorage.getItem('mode');
  if (savedMode) document.documentElement.setAttribute('data-mode', savedMode);
  else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-mode', 'dark');
  }

  load().then((c) => {
    content = c;
    initI18n(content);
    initDomain();
    paintLinks();
    render();
    onDomainChange(() => render());
    window.addEventListener('langchange', render);
    initScrollAnimations();
    initNavbar();
    initContactForm();
    if (window.lucide) window.lucide.createIcons();
  }).catch((err) => {
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin', '<p style="padding:12px;text-align:center">Failed to load content.</p>');
  });
}

init();
