// Restrained motion: opacity + transform entrances with stagger.
// Safe to call again after re-renders — already-bound elements are skipped,
// and items inside a section that already revealed appear instantly.
let io = null;

function setupObserver() {
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      const sec = e.target.closest('section');
      if (sec) sec.dataset.revealed = '1';
      io.unobserve(e.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
}

export function revealNew(root = document) {
  if (!io) return;
  root.querySelectorAll('.rv:not([data-rv])').forEach((el) => {
    el.setAttribute('data-rv', '');
    const sec = el.closest('section');
    if (sec?.dataset.revealed === '1') { el.classList.add('in'); return; }
    io.observe(el);
  });
}

export function initScrollAnimations() {
  if (!io) setupObserver();
  revealNew();
}
