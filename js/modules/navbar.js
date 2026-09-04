// Quiet sticky header: scroll border, mobile menu, light/dark
export function initNavbar() {
  const header = document.getElementById('site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const modeBtn = document.getElementById('mode-toggle');
  const paint = () => {
    const mode = document.documentElement.getAttribute('data-mode') || 'light';
    const icon = modeBtn?.querySelector('i, svg');
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
    try { localStorage.setItem('mode', next); } catch {}
    paint();
  });
  paint();

  if (window.lucide) window.lucide.createIcons();
}
