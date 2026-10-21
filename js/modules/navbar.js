// Header: scroll border, mobile menu, light/dark, nav scrollspy
export function initNavbar() {
  const header = document.getElementById('site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Light / dark
  const modeBtn = document.getElementById('mode-toggle');
  const paint = () => {
    const mode = document.documentElement.getAttribute('data-mode') || 'light';
    modeBtn?.setAttribute('aria-label', mode === 'light' ? 'Dark mode' : 'Light mode');
    if (window.lucide && modeBtn) {
      modeBtn.innerHTML = `<i data-lucide="${mode === 'light' ? 'moon' : 'sun'}"></i>`;
      window.lucide.createIcons();
    }
  };
  modeBtn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-mode') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-mode', next);
    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = next === 'light' ? '#F7F8FA' : '#0B1220';
    try { localStorage.setItem('mode', next); } catch {}
    paint();
  });
  paint();

  initSpy();
  if (window.lucide) window.lucide.createIcons();
}

// Active nav state follows the section in view
function initSpy() {
  const links = [...document.querySelectorAll('[data-navlink]')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const bySection = new Map();
  links.forEach((a) => {
    const id = (a.getAttribute('href') || '').slice(1);
    if (!bySection.has(id)) bySection.set(id, []);
    bySection.get(id).push(a);
  });
  const sections = [...bySection.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const mine = bySection.get(e.target.id) || [];
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.remove('active'));
        mine.forEach((a) => a.classList.add('active'));
      } else {
        // section left the tracking band (e.g. back at the hero) → clear it
        mine.forEach((a) => a.classList.remove('active'));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => io.observe(s));
}
