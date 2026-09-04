// Restrained motion: opacity + transform entrances only
export function initScrollAnimations() {
  const els = document.querySelectorAll('#competences .wrap, #work .wrap, #faq .wrap, #contact .wrap, .cluster, .proj-featured, .proj-card, .showcase, .acc-item');
  els.forEach((el) => el.classList.add('rv'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
}
