// Views — competences clusters, work (projects / showcases), FAQ
import { getLang } from './i18n.js';

function t(obj, lang) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || obj.fr || '';
}

const PROFILE_OF = { development: 'dev', telecom: 'telecom', it: 'it' };

export function renderAll(content, domain, lang) {
  renderHero(content, domain, lang);
  renderClusters(content, domain, lang);
  renderWork(content, domain, lang);
  renderFaq(content, domain, lang);
  if (window.lucide) window.lucide.createIcons();
}

export function renderHero(content, domain, lang) {
  const d = content.domains?.[domain];
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('hero-domain', t(d.heroTitle, lang));
  set('hero-statement', t(d.statement, lang));
  set('hero-stack', d.stack || '');
  const pos = document.getElementById('foot-pos');
  if (pos) pos.textContent = t(d.heroTitle, lang) + ' — Agadir';
}

export function renderClusters(content, domain, lang) {
  const box = document.getElementById('clusters');
  const sub = document.getElementById('competences-sub');
  if (!box) return;
  const key = PROFILE_OF[domain] || 'dev';
  const groups = content.skills?.[key] || [];
  const d = content.domains?.[domain];
  if (sub && d) sub.textContent = t(d.competencesSub, lang);
  // Visual grouping: max 3 clusters, max ~12 items, no giant lists
  const clusters = groups.slice(0, 3).map((g) => ({
    title: t(g.group, lang),
    items: (g.items || []).slice(0, 8),
  }));
  box.innerHTML = clusters.map((c) => `
    <div class="cluster">
      <h3>${escapeHtml(c.title)}</h3>
      <ul>${c.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>`).join('');
}

export function renderWork(content, domain, lang) {
  const title = document.getElementById('work-title');
  const sub = document.getElementById('work-sub');
  const body = document.getElementById('work-body');
  if (!body) return;
  const S = content.i18n?.sections || {};
  if (domain === 'development') {
    title.textContent = t(S.workProjects, lang) || 'PROJECTS';
    sub.textContent = t(S.workProjectsSub, lang) || '';
    body.innerHTML = projectsHtml(content, lang);
  } else if (domain === 'telecom') {
    title.textContent = t(S.workTelecom, lang) || 'FTTH NETWORK';
    sub.textContent = t(S.workTelecomSub, lang) || '';
    body.innerHTML = telecomShowcaseHtml(lang);
  } else {
    title.textContent = t(S.workIt, lang) || 'SYSTEMS';
    sub.textContent = t(S.workItSub, lang) || '';
    body.innerHTML = itShowcaseHtml(content, lang);
  }
  if (window.lucide) window.lucide.createIcons();
}

function projectsHtml(content, lang) {
  const all = (content.projects || []).filter((p) => (p.profiles || []).includes('dev') && !p.legacy);
  if (!all.length) return '';
  const [feat, ...rest] = all;
  const shown = rest.slice(0, 5);
  const tags = (p) => `<div class="proj-tags">${(p.tags || []).slice(0, 5).map((x) => `<span>${escapeHtml(x)}</span>`).join('')}</div>`;
  const links = (p) => {
    const g = p.links?.github, dm = p.links?.demo;
    const gh = g && g !== '#' ? `<a href="${g}" target="_blank" rel="noopener">GitHub</a>` : '';
    const demo = dm && dm !== '#' ? `<a href="${dm}" target="_blank" rel="noopener">Demo</a>` : '';
    return (gh || demo) ? `<div class="proj-links">${gh}${demo}</div>` : '';
  };
  return `
    <article class="proj-featured">
      <img src="${feat.image || ''}" alt="${escapeHtml(feat.title)}" loading="lazy" onerror="this.style.display='none'">
      <div>
        <h3 class="proj-name">${escapeHtml(feat.title)}</h3>
        <p class="proj-desc">${escapeHtml(t(feat.desc, lang))}</p>
        ${tags(feat)}${links(feat)}
      </div>
    </article>
    <div class="proj-grid">
      ${shown.map((p) => `
        <article class="proj-card">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(t(p.desc, lang))}</p>
          ${tags(p)}${links(p)}
        </article>`).join('')}
    </div>`;
}

function telecomShowcaseHtml(lang) {
  const ink = 'var(--text-soft)';
  const acc = 'var(--accent)';
  return `
  <div class="showcase" role="img" aria-label="FTTH network: fiber to SRO to PB to homes">
    <svg viewBox="0 0 640 300" aria-hidden="true">
      <path class="fiber-flow" d="M320 30 V70" stroke="${acc}" stroke-width="2" fill="none"/>
      <path class="fiber-flow" d="M320 110 V150 M240 150 H400 M240 150 V190 M400 150 V190 M240 230 V260 M400 230 V260" stroke="${acc}" stroke-width="2" fill="none"/>
      <g class="node"><rect x="270" y="8" width="100" height="30" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="320" y="27" text-anchor="middle" class="show-label">FIBER</text></g>
      <g class="node"><rect x="270" y="70" width="100" height="34" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="320" y="91" text-anchor="middle" class="show-label">SRO</text></g>
      <g class="node"><rect x="190" y="190" width="100" height="34" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="240" y="211" text-anchor="middle" class="show-label">PB</text></g>
      <g class="node"><rect x="350" y="190" width="100" height="34" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="400" y="211" text-anchor="middle" class="show-label">PB</text></g>
      <g class="node"><rect x="190" y="260" width="100" height="30" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="240" y="279" text-anchor="middle" class="show-label">HOME</text></g>
      <g class="node"><rect x="350" y="260" width="100" height="30" rx="6" fill="var(--card)" stroke="var(--border)"/><text x="400" y="279" text-anchor="middle" class="show-label">HOME</text></g>
      <text x="320" y="135" text-anchor="middle" class="show-label">GIS · AUDIT</text>
    </svg>
  </div>`;
}

function itShowcaseHtml(content, lang) {
  const key = 'it';
  const groups = (content.skills?.[key] || []).slice(0, 6);
  const flow = ['SYSTEMS', 'INFRASTRUCTURE', 'NETWORK', 'SERVICES', 'AUTOMATION', 'DATA'];
  return `
  <div class="showcase" role="img" aria-label="IT systems architecture">
    <svg viewBox="0 0 640 ${90 + flow.length * 0}" aria-hidden="true" style="display:none"></svg>
    <div class="clusters" style="margin-top:0">
      ${groups.map((g) => `
        <div class="cluster">
          <h3>${escapeHtml(t(g.group, lang))}</h3>
          <ul>${(g.items || []).slice(0, 6).map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
        </div>`).join('')}
    </div>
    <p class="section-sub" style="margin-top:18px">${flow.join('  ↓  ')}</p>
  </div>`;
}

export function renderFaq(content, domain, lang) {
  const box = document.getElementById('faq-list');
  if (!box) return;
  const items = content.faq?.[domain] || [];
  box.innerHTML = items.map((f, i) => `
    <div class="acc-item${i === 0 ? ' open' : ''}">
      <button class="acc-q" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span>${escapeHtml(t(f.q, lang))}</span><span class="plus" aria-hidden="true">+</span>
      </button>
      <div class="acc-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}">
        <p>${escapeHtml(t(f.a, lang))}</p>
      </div>
    </div>`).join('');
  box.querySelectorAll('.acc-item').forEach((item) => {
    const btn = item.querySelector('.acc-q');
    const panel = item.querySelector('.acc-a');
    const sync = () => {
      const open = item.classList.contains('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    };
    sync();
    btn.addEventListener('click', () => {
      const was = item.classList.contains('open');
      box.querySelectorAll('.acc-item.open').forEach((o) => o.classList.remove('open'));
      if (!was) item.classList.add('open');
      box.querySelectorAll('.acc-item').forEach((o) => {
        const b = o.querySelector('.acc-q');
        const p = o.querySelector('.acc-a');
        const on = o.classList.contains('open');
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        p.style.maxHeight = on ? p.scrollHeight + 'px' : '0px';
      });
    });
  });
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
