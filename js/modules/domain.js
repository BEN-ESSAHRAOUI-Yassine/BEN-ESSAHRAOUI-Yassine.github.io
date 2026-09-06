// Central domain state — portfolio_design.md § DOMAIN STATE ARCHITECTURE
export const DOMAINS = ['development', 'telecom', 'it'];
const LABELS = { development: 'DEVELOPMENT', telecom: 'TELECOM', it: 'IT' };

let current = 'development';
const listeners = new Set();
let timer = null;
const ROTATE_MS = 1800000; // 30min — raised for testing to avoid auto-switch during screenshots

function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getDomain() { return current; }
export function onDomainChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

function readInitial() {
  const url = new URL(location.href);
  const q = url.searchParams.get('domain');
  const h = (location.hash || '').replace('#', '');
  const saved = localStorage.getItem('domain');
  for (const cand of [q, h, saved]) {
    if (cand && DOMAINS.includes(cand)) return cand;
  }
  return 'development';
}

function persist() {
  try {
    localStorage.setItem('domain', current);
    const url = new URL(location.href);
    url.searchParams.set('domain', current);
    history.replaceState(null, '', url);
    location.hash = current === 'development' ? '' : '';
  } catch {}
}

export function setDomain(next, opts = {}) {
  if (!DOMAINS.includes(next) || next === current) {
    if (opts.restart !== false) restartAuto();
    return;
  }
  const stage = document.getElementById('domain-stage');
  const hero = document.getElementById('hero');
  const apply = () => {
    current = next;
    document.documentElement.setAttribute('data-domain', current);
    persist();
    listeners.forEach((fn) => fn(current));
    updateChrome();
  };
  if (reducedMotion() || opts.instant) {
    apply();
  } else if (stage && hero) {
    // Choreographed transition: fade content → swap → fade in
    stage.classList.add('switching');
    hero.classList.add('hero-exit');
    setTimeout(() => {
      apply();
      requestAnimationFrame(() => {
        stage.classList.remove('switching');
        hero.classList.remove('hero-exit');
        hero.classList.add('hero-enter');
        setTimeout(() => hero.classList.remove('hero-enter'), 500);
      });
    }, 380);
  } else {
    apply();
  }
  if (opts.restart !== false) restartAuto();
}

export function step(dir) {
  const i = DOMAINS.indexOf(current);
  const n = (i + dir + DOMAINS.length) % DOMAINS.length;
  setDomain(DOMAINS[n]);
}

function updateChrome() {
  const i = DOMAINS.indexOf(current);
  const prev = DOMAINS[(i + 2) % 3];
  const next = DOMAINS[(i + 1) % 3];
  const top = document.getElementById('domain-top');
  const pn = document.getElementById('side-prev-name');
  const nn = document.getElementById('side-next-name');
  const idx = document.getElementById('domain-index');
  if (top) top.textContent = LABELS[current];
  if (pn) pn.textContent = LABELS[prev];
  if (nn) nn.textContent = LABELS[next];
  if (idx) idx.textContent = String(i + 1).padStart(2, '0');
  document.querySelectorAll('#domain-dots button').forEach((b) => {
    const on = b.dataset.domain === current;
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  const theme = document.querySelector('meta[name="theme-color"]');
  if (theme) {
    theme.content = current === 'telecom' ? '#BBDEFB' : current === 'it' ? '#B2DFDB' : '#E5E5E5';
  }
}

export function buildDots() {
  const box = document.getElementById('domain-dots');
  if (!box) return;
  box.innerHTML = '';
  DOMAINS.forEach((d) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.domain = d;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', LABELS[d]);
    b.addEventListener('click', () => setDomain(d));
    box.appendChild(b);
  });
}

function pauseAuto() {
  if (timer) { clearInterval(timer); timer = null; }
}
function restartAuto() {
  pauseAuto();
  if (reducedMotion()) return;
  timer = setInterval(() => {
    if (document.hidden) return;
    step(1);
  }, ROTATE_MS);
}

export function initDomain() {
  current = readInitial();
  document.documentElement.setAttribute('data-domain', current);
  buildDots();
  updateChrome();
  document.getElementById('domain-prev')?.addEventListener('click', () => step(-1));
  document.getElementById('domain-next')?.addEventListener('click', () => step(1));
  // keyboard on stage
  const stage = document.getElementById('domain-stage');
  stage?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  // pause on hover / focus / interaction
  const hero = document.getElementById('hero');
  hero?.addEventListener('pointerenter', pauseAuto);
  hero?.addEventListener('pointerleave', restartAuto);
  hero?.addEventListener('focusin', pauseAuto);
  hero?.addEventListener('focusout', restartAuto);
  restartAuto();
  return current;
}
