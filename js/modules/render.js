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
  const clusters = groups.map((g) => ({
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
      <div class="proj-featured-img">
        <img src="${feat.image || ''}" alt="${escapeHtml(feat.title)}" loading="lazy" onerror="this.parentElement.classList.add('no-img')">
      </div>
      <div>
        <span class="proj-badge">Featured</span>
        <h3 class="proj-name">${escapeHtml(feat.title)}</h3>
        <p class="proj-desc">${escapeHtml(t(feat.desc, lang))}</p>
        ${tags(feat)}${links(feat)}
      </div>
    </article>
    <div class="proj-grid">
      ${shown.map((p) => `
        <article class="proj-card">
          <div class="proj-card-icon">
            <img src="${p.image || ''}" alt="" loading="lazy" onerror="this.style.display='none'">
          </div>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(t(p.desc, lang))}</p>
          ${tags(p)}${links(p)}
        </article>`).join('')}
    </div>`;
}

function telecomShowcaseHtml(lang) {
  return `
  <div class="showcase telecom-showcase" role="img" aria-label="FTTH network topology: fiber to SRO to PB to homes">
    <svg viewBox="0 0 700 340" aria-hidden="true" class="telecom-svg">
      <!-- Fiber backbone -->
      <path class="fiber-line fiber-backbone" d="M350 40 L350 100" stroke="var(--accent)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- SRO to PB split -->
      <path class="fiber-line fiber-split-l" d="M350 140 L350 170 L220 170 L220 210" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path class="fiber-line fiber-split-r" d="M350 170 L480 170 L480 210" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- PB to Home -->
      <path class="fiber-line fiber-home-l" d="M220 250 L220 280" stroke="var(--accent)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="4 4"/>
      <path class="fiber-line fiber-home-r" d="M480 250 L480 280" stroke="var(--accent)" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="4 4"/>

      <!-- Signal pulse -->
      <circle class="signal-pulse" cx="350" cy="40" r="4" fill="var(--accent)" opacity="0.6">
        <animate attributeName="cy" values="40;280" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="3s" repeatCount="indefinite"/>
      </circle>

      <!-- Nodes -->
      <g class="node" data-label="FIBER">
        <rect x="300" y="18" width="100" height="34" rx="4" fill="var(--card)" stroke="var(--accent)" stroke-width="1.5"/>
        <text x="350" y="40" text-anchor="middle" class="show-label">FIBER</text>
      </g>
      <g class="node" data-label="SRO">
        <rect x="300" y="104" width="100" height="34" rx="4" fill="var(--card)" stroke="var(--border)"/>
        <text x="350" y="126" text-anchor="middle" class="show-label">SRO</text>
      </g>
      <g class="node" data-label="PB">
        <rect x="170" y="214" width="100" height="34" rx="4" fill="var(--card)" stroke="var(--border)"/>
        <text x="220" y="236" text-anchor="middle" class="show-label">PB</text>
      </g>
      <g class="node" data-label="PB">
        <rect x="430" y="214" width="100" height="34" rx="4" fill="var(--card)" stroke="var(--border)"/>
        <text x="480" y="236" text-anchor="middle" class="show-label">PB</text>
      </g>
      <g class="node" data-label="HOME">
        <rect x="175" y="284" width="90" height="28" rx="4" fill="var(--env-soft)" stroke="var(--border)"/>
        <text x="220" y="303" text-anchor="middle" class="show-label show-label-sm">HOME</text>
      </g>
      <g class="node" data-label="HOME">
        <rect x="435" y="284" width="90" height="28" rx="4" fill="var(--env-soft)" stroke="var(--border)"/>
        <text x="480" y="303" text-anchor="middle" class="show-label show-label-sm">HOME</text>
      </g>

      <!-- Labels -->
      <text x="350" y="165" text-anchor="middle" class="show-label-soft">GIS · AUDIT · DESIGN</text>
    </svg>
    <div class="telecom-tags">
      <span>FTTH</span><span>Network Design</span><span>GIS</span><span>Fiber</span><span>Analysis</span><span>Audit</span>
    </div>
  </div>`;
}

function itShowcaseHtml(content, lang) {
  const flow = [
    { label: 'SYSTEMS', desc: 'Windows · Linux · Deployment' },
    { label: 'INFRASTRUCTURE', desc: 'Servers · Storage · Cloud' },
    { label: 'NETWORK', desc: 'LAN · WAN · Wi-Fi · Switches' },
    { label: 'SERVICES', desc: 'Helpdesk · Ticketing · Support' },
    { label: 'AUTOMATION', desc: 'PLC · Scripts · Supervision' },
    { label: 'DATA', desc: 'Databases · Reporting · Analytics' },
  ];
  return `
  <div class="showcase it-showcase" role="img" aria-label="IT infrastructure architecture">
    <div class="it-arch">
      ${flow.map((f, i) => `
        <div class="it-node" style="--i:${i}">
          <div class="it-node-dot"></div>
          ${i < flow.length - 1 ? '<div class="it-node-line"></div>' : ''}
          <div class="it-node-content">
            <span class="it-node-label">${f.label}</span>
            <span class="it-node-desc">${f.desc}</span>
          </div>
        </div>`).join('')}
    </div>
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
