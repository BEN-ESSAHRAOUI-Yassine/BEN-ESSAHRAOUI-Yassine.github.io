// Restrained motion: opacity + transform entrances with stagger
export function initScrollAnimations() {
  const sections = document.querySelectorAll('#competences, #work, #faq, #contact');
  const items = document.querySelectorAll('.cluster, .proj-featured, .proj-card, .showcase, .acc-item, .it-node');

  // Section headings get a simple reveal
  sections.forEach((el) => {
    el.classList.add('rv');
  });

  // Items get staggered reveal
  items.forEach((el, i) => {
    el.classList.add('rv');
    el.style.setProperty('--stagger', (i % 6) * 60 + 'ms');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.rv').forEach((el) => io.observe(el));
}
