// Hero diagram — hover/focus a marker to light its connection path
export function initHero() {
  const stage = document.querySelector('.diagram-stage');
  if (!stage) return;
  const markers = [...document.querySelectorAll('.marker')];

  const setActive = (d) => { stage.dataset.active = d || ''; };

  markers.forEach((m) => {
    const d = m.dataset.marker;
    m.addEventListener('mouseenter', () => setActive(d));
    m.addEventListener('mouseleave', () => setActive(''));
    m.addEventListener('focus', () => setActive(d));
    m.addEventListener('blur', () => setActive(''));
  });
}
