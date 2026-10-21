// Views — domain sections, skills, case studies, about, FAQ
import { t, getLang } from './i18n.js';
import { revealNew } from './animations.js';

export const DOMAINS = ['spec', 'field', 'flow'];

const INK = { spec: '#2563EB', field: '#3F7355', flow: '#6D46C4' };

let contentRef = null;
let filter = 'all';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const chip = (d, label) =>
  `<span class="chip acc-${d}"><span class="chip-dot" aria-hidden="true"></span>${esc(label)}</span>`;

/* ══════════════════════════════════════════════════════════════
   DOMAINS — SPEC / FIELD / FLOW sections + hero markers
   ══════════════════════════════════════════════════════════════ */
export function renderDomains(content, lang) {
  DOMAINS.forEach((d) => {
    const dom = content.domains?.[d];
    if (!dom) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set(`${d}-kicker`, t(dom.kicker, lang));
    set(`${d}-heading`, t(dom.heading, lang));
    set(`${d}-intro`, t(dom.intro, lang));
    set(`${d}-stack`, dom.stack || '');
    set(`${d}-caption`, t(dom.panelCaption, lang));
    const link = document.getElementById(`${d}-link`);
    if (link) link.innerHTML = `<span>${esc(t(dom.link, lang))}</span>`;

    const steps = document.getElementById(`${d}-steps`);
    if (steps) {
      steps.innerHTML = (dom.steps || []).map((s, i) => `
        <li style="--stagger:${i * 60}ms">
          <span class="step-n">${esc(s.n)}</span>
          <span>
            <span class="step-label">${esc(t(s.label, lang))}</span>
            <span class="step-desc">${esc(t(s.desc, lang))}</span>
          </span>
        </li>`).join('');
    }

    const sub = document.querySelector(`[data-marker-sub="${d}"]`);
    if (sub) sub.textContent = t(dom.markerSub, lang);
  });
}

/* ══════════════════════════════════════════════════════════════
   SKILLS — three blocks, grouped rows (no badge walls)
   ══════════════════════════════════════════════════════════════ */
export function renderSkills(content, lang) {
  const box = document.getElementById('skills-grid');
  if (!box) return;
  const itemsLabel = t(content.i18n?.skills?.items, lang);
  box.innerHTML = DOMAINS.map((d, bi) => {
    const groups = content.skills?.[d] || [];
    const total = groups.reduce((n, g) => n + (g.items || []).length, 0);
    return `
      <div class="skill-block skill-block-${d} rv" style="--stagger:${bi * 90}ms">
        <div class="skill-block-head">
          <span class="skill-block-name">${d.toUpperCase()} — ${esc(t(content.domains?.[d]?.markerSub, lang))}</span>
        </div>
        <div class="skill-block-count">${total} ${esc(itemsLabel)}</div>
        <dl>
          ${groups.map((g) => `
            <div class="skill-row">
              <dt>${esc(t(g.group, lang))}</dt>
              <dd>${(g.items || []).map((i) => esc(t(i, lang))).join(' · ')}</dd>
            </div>`).join('')}
        </dl>
      </div>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════════
   WORK — technical case studies, filterable by domain
   ══════════════════════════════════════════════════════════════ */
export function initWork(content) {
  contentRef = content;
  document.querySelectorAll('#work-filters .filter').forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
  document.querySelectorAll('[data-filter-link]').forEach((a) => {
    a.addEventListener('click', () => setFilter(a.dataset.filterLink, { scroll: true }));
  });
}

export function setFilter(next, opts = {}) {
  if (!['all', ...DOMAINS].includes(next)) next = 'all';
  filter = next;
  document.querySelectorAll('#work-filters .filter').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset.filter === filter ? 'true' : 'false');
  });
  renderWork(contentRef, getLang());
  if (opts.scroll) {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function projectLinks(p, lang) {
  const I = contentRef.i18n?.work || {};
  const g = p.links?.github, dm = p.links?.demo;
  const gh = g && g !== '#'
    ? `<a href="${esc(g)}" target="_blank" rel="noopener"><span aria-hidden="true">↗</span> ${esc(t(I.github, lang))}</a>` : '';
  const demo = dm && dm !== '#'
    ? `<a href="${esc(dm)}" target="_blank" rel="noopener"><span aria-hidden="true">↗</span> ${esc(t(I.demo, lang))}</a>` : '';
  return (gh || demo) ? `<div class="case-links">${gh}${demo}</div>` : '';
}

function caseBody(p, idx, d, lang) {
  const I = contentRef.i18n?.work || {};
  const badges = [
    p.featured ? `<span class="case-badge">${esc(t(I.featured, lang))}</span>` : '',
    p.legacy ? `<span class="case-badge">${esc(t(I.early, lang))}</span>` : '',
  ].join('');
  return `
    <div class="case-body">
      <p class="case-meta">
        <span class="case-index">P-${String(idx).padStart(2, '0')}</span>
        ${chip(d, d.toUpperCase())}
        ${badges}
      </p>
      <h3 class="case-title">${esc(p.title)}</h3>
      <p class="case-desc">${esc(t(p.desc, lang))}</p>
      <p class="case-tools"><span class="tools-label">${esc(t(I.tools, lang))}</span> ${(p.tags || []).map(esc).join(' · ')}</p>
      ${projectLinks(p, lang)}
    </div>`;
}

export function renderWork(content, lang) {
  contentRef = content || contentRef;
  const body = document.getElementById('work-body');
  const countEl = document.getElementById('work-count');
  if (!body) return;
  const I = contentRef.i18n?.work || {};
  const all = contentRef.projects || [];
  const indexed = all.map((p, i) => ({ p, idx: i + 1 }));
  const visible = indexed.filter(({ p }) => filter === 'all' || (p.domains || []).includes(filter));

  if (countEl) {
    const n = visible.length;
    const tpl = n === 1 ? (I.countOne || I.count) : I.count;
    countEl.textContent = t(tpl, lang).replace('{n}', String(n));
  }

  if (!visible.length) { body.innerHTML = ''; return; }

  // Composition: one featured case → gallery → compact rows
  let feat = visible.find(({ p }) => p.featured) || visible[0];
  let rest = visible.filter((v) => v !== feat);
  const legacy = rest.filter(({ p }) => p.legacy);
  const live = rest.filter(({ p }) => !p.legacy);
  const gallery = live.slice(0, 6);
  const compact = [...live.slice(6), ...legacy];

  const featHtml = `
    <article class="case case-feat case--${feat.p.domains?.[0] || 'spec'} rv">
      <div class="case-media" data-ref="${(feat.p.domains?.[0] || 'spec').toUpperCase()} · P-${String(feat.idx).padStart(2, '0')}">
        <img src="${esc(feat.p.image || '')}" alt="" loading="lazy">
      </div>
      ${caseBody(feat.p, feat.idx, feat.p.domains?.[0] || 'spec', lang)}
    </article>`;

  const galleryHtml = gallery.length ? `
    <div class="cases-gallery">
      ${gallery.map(({ p, idx }, i) => {
        const d = p.domains?.[0] || 'spec';
        return `
        <article class="case case--${d} rv" style="--stagger:${(i % 4) * 70}ms">
          <div class="case-media" data-ref="${d.toUpperCase()} · P-${String(idx).padStart(2, '0')}">
            <img src="${esc(p.image || '')}" alt="" loading="lazy">
          </div>
          ${caseBody(p, idx, d, lang)}
        </article>`;
      }).join('')}
    </div>` : '';

  const compactHtml = compact.length ? `
    <div class="cases-compact rv">
      <p class="cases-compact-head">${esc(t(I.more, lang))}</p>
      ${compact.map(({ p, idx }) => {
        const d = p.domains?.[0] || 'spec';
        const g = p.links?.github;
        return `
        <div class="case-compact case--${d}">
          <span class="cc-index">P-${String(idx).padStart(2, '0')}</span>
          <div>
            <h4>${esc(p.title)}${p.legacy ? ` <span class="case-badge">${esc(t(I.early, lang))}</span>` : ''}</h4>
            <p>${esc(t(p.desc, lang))}</p>
          </div>
          <div class="cc-side">
            <span class="cc-tags">${(p.tags || []).slice(0, 3).map(esc).join(' · ')}</span>
            ${g && g !== '#' ? `<a class="cc-link" href="${esc(g)}" target="_blank" rel="noopener">${esc(t(I.github, lang))}</a>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>` : '';

  body.innerHTML = `<div class="cases">${featHtml}${galleryHtml}${compactHtml}</div>`;
  // freshly-rendered cards start at opacity 0 — hand them to the reveal observer
  revealNew(body);
}

/* ══════════════════════════════════════════════════════════════
   ABOUT — roles, experience timeline, education, certifications, CV
   ══════════════════════════════════════════════════════════════ */
export function renderAbout(content, lang) {
  const roles = document.getElementById('about-roles');
  if (roles) {
    roles.innerHTML = DOMAINS.map((d, i) => {
      const prof = content.profiles?.[d];
      const bio = content.about?.[d];
      if (!prof) return '';
      return `
        <div class="role-card role-card-${d} rv" style="--stagger:${i * 80}ms">
          <span class="role-tag">${String(i + 1).padStart(2, '0')} · ${d.toUpperCase()}</span>
          <h4 class="role-title">${esc(t(prof.title, lang))}</h4>
          <p class="role-bio">${esc(t(bio, lang))}</p>
        </div>`;
    }).join('');
  }

  const exp = document.getElementById('about-experience');
  if (exp) {
    exp.innerHTML = (content.experience || []).map((e, i) => {
      const ds = e.domains || [];
      const bullets = ds.flatMap((d) => (e.bullets?.[d] || []).map((b) => `<li>${esc(t(b, lang))}</li>`)).join('');
      return `
        <li class="rv tl-${ds[0] || 'spec'}" style="--stagger:${(i % 4) * 60}ms">
          <p class="tl-date">${esc(t(e.date, lang))}</p>
          <h4 class="tl-title">${esc(t(e.title, lang))}</h4>
          <p class="tl-company">${esc(e.company)}</p>
          <div class="tl-tags">${ds.map((d) => chip(d, d.toUpperCase())).join('')}</div>
          ${bullets ? `<ul class="tl-bullets">${bullets}</ul>` : ''}
        </li>`;
    }).join('');
  }

  const edu = document.getElementById('about-education');
  if (edu) {
    edu.innerHTML = (content.education || []).map((e) => `
      <li>
        <div>
          <p class="edu-diploma">${esc(t(e.diploma, lang))}</p>
          <span class="edu-school">${esc(e.school)}</span>
        </div>
        <span class="edu-year">${esc(e.year)}</span>
      </li>`).join('');
  }

  const certs = document.getElementById('about-certs');
  if (certs && content.certifications) {
    certs.innerHTML = `<strong>${esc(content.certifications.provider)}</strong>
      <ul>${(content.certifications.items || []).map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`;
  }

  const cv = document.getElementById('about-cv');
  if (cv && content.cv) {
    const I = content.i18n?.sections?.about || {};
    const rows = [
      ['spec', t(I.cvSpec, lang)],
      ['field', t(I.cvField, lang)],
      ['flow', t(I.cvFlow, lang)],
      ['automation', t(I.cvAutomation, lang)],
    ].filter(([k]) => content.cv[k]);
    cv.innerHTML = rows.map(([k, label]) =>
      `<a href="${esc(content.cv[k])}" target="_blank" rel="noopener">${esc(label)} (PDF)</a>`).join('');
  }
}

/* ══════════════════════════════════════════════════════════════
   FAQ — merged list, domain-tagged, accessible accordion
   ══════════════════════════════════════════════════════════════ */
export function renderFaq(content, lang) {
  const box = document.getElementById('faq-list');
  if (!box) return;
  const items = content.faq || [];
  box.innerHTML = items.map((f, i) => {
    const d = f.domain;
    return `
    <div class="acc-item${i === 0 ? ' open' : ''}${d ? ` acc-${d}` : ''}">
      <button class="acc-q" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span class="acc-q-text">${d ? `<span class="acc-tag acc-${d}">${d.toUpperCase()}</span>` : ''}<span>${esc(t(f.q, lang))}</span></span>
        <span class="acc-plus" aria-hidden="true">+</span>
      </button>
      <div class="acc-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <p>${esc(t(f.a, lang))}</p>
      </div>
    </div>`;
  }).join('');

  const sync = (item) => {
    const open = item.classList.contains('open');
    const btn = item.querySelector('.acc-q');
    const panel = item.querySelector('.acc-a');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
  };
  const all = [...box.querySelectorAll('.acc-item')];
  all.forEach(sync);

  box.querySelectorAll('.acc-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const was = item.classList.contains('open');
      all.forEach((o) => o.classList.remove('open'));
      if (!was) item.classList.add('open');
      all.forEach(sync);
    });
  });
  window.addEventListener('resize', () => all.forEach(sync), { passive: true });
}

/* ══════════════════════════════════════════════════════════════ */
export function renderAll(content, lang) {
  renderDomains(content, lang);
  renderSkills(content, lang);
  renderWork(content, lang);
  renderAbout(content, lang);
  renderFaq(content, lang);
  if (window.lucide) window.lucide.createIcons();
  return { INK };
}
