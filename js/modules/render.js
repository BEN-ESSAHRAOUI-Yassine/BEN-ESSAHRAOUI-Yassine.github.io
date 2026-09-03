export function renderHeroSwitcher(content){
  const container=document.getElementById('hero-switcher');
  if(!container || !content?.profiles) return;
  const lang=document.documentElement.lang||'fr';
  container.innerHTML='';
  ['dev','telecom','it'].forEach(key=>{
    const p=content.profiles[key];
    const btn=document.createElement('button');
    btn.className='hero-switcher-card';
    btn.setAttribute('role','tab');
    btn.dataset.profile=key;
    btn.setAttribute('aria-selected','false');
    btn.innerHTML=`
      <span class="sw-icon"><i data-lucide="${p.lucide||'code-2'}"></i></span>
      <span class="sw-text">
        <span class="sw-label">${p.icon||''} ${p.label[lang]||p.label.fr}</span>
        <span class="sw-desc">${p.heroDesc[lang]||p.heroDesc.fr}</span>
        <span class="sw-desc" style="font-weight:500;color:var(--text-primary);margin-top:1px">${p.title[lang]||p.title.fr}</span>
      </span>
      <span class="sw-check"><i data-lucide="check"></i></span>
    `;
    btn.addEventListener('click', ()=>{
      const ev=new CustomEvent('requestProfileChange',{detail:{profile:key}});
      window.dispatchEvent(ev);
    });
    container.appendChild(btn);
  });
  if(window.lucide) window.lucide.createIcons();
}

export function renderStats(content, profile, lang){
  const container=document.getElementById('stats-container');
  if(!container || !content?.about?.stats) return;
  const stats=content.about.stats[profile]||[];
  container.innerHTML='';
  stats.forEach(s=>{
    const wrap=document.createElement('div');
    wrap.setAttribute('data-show-in', profile);
    wrap.innerHTML=`<div class="stat-badge"><span class="stat-number" data-target="${s.value}">0</span><span class="stat-suffix">${s.suffix||''}</span><span class="stat-label">${s.label[lang]||s.label.fr}</span></div>`;
    container.appendChild(wrap);
  });
}

export function renderSkills(content, profile, lang){
  const container=document.getElementById('skills-container');
  if(!container) return;
  container.innerHTML='';
  const groups = content.skills?.[profile] || [];
  groups.forEach(g=>{
    const div=document.createElement('div');
    div.className='skill-group';
    div.setAttribute('data-show-in', profile);
    div.innerHTML=`<h3 class="skill-group-title">${g.group[lang]||g.group.fr}</h3><div class="skill-cloud">${g.items.map(i=>`<span class="skill-pill">${i}</span>`).join('')}</div>`;
    container.appendChild(div);
  });
}

export function renderMarquee(content){
  const track=document.getElementById('marquee-track');
  if(!track) return;
  const items=['Orange','SFR','Bouygues','Axione','TDF','Kyntus','Laravel 13','PostGIS','Groq AI','Pest','React 19','PhpWord','Sanctum','Docker','Telescope'];
  const doubled=[...items, ...items];
  track.innerHTML=doubled.map(s=>`<span>${s}</span>`).join('');
}

export function renderSignal(content, profile, lang){
  const grid=document.getElementById('signal-grid');
  if(!grid) return;
  const map={
    dev: {icon:'code-2', title: lang==='fr'?'Dev — Il code':'Dev — He ships', desc: lang==='fr'?'Laravel 13, Pest 256+, queues, AI agents. De l’idée au prod.':'Laravel 13, Pest 256+, queues, AI agents. Idea to prod.'},
    telecom:{icon:'antenna', title: lang==='fr'?'Télécom — Il dessine':'Telecom — He maps', desc: lang==='fr'?'FTTH, PostGIS, AutoCAD/QGIS, scoring qualité. Le réseau devient logiciel.':'FTTH, PostGIS, AutoCAD/QGIS, quality scoring. Network as software.'},
    it:{icon:'wrench', title: lang==='fr'?'IT — Il maintient':'IT — He keeps it up', desc: lang==='fr'?'Réseaux, helpdesk, PLC, parc. Quand ça casse, il répare.':'Networks, helpdesk, PLC, fleet. When it breaks, he fixes.'}
  };
  grid.innerHTML=Object.entries(map).map(([key,m])=>`
    <div class="signal-card" data-signal="${key}" style="${key===profile?'border-color:var(--color-accent)':''}">
      <i data-lucide="${m.icon}" style="width:20px;height:20px;color:var(--color-accent)"></i>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
    </div>
  `).join('');
  if(window.lucide) window.lucide.createIcons();
}

export function renderTimeline(content, profile, lang){
  const container=document.getElementById('timeline');
  if(!container) return;
  container.innerHTML='';
  const items=content.experience||[];
  // Experience items
  items.forEach(item=>{
    if(!item.profiles.includes(profile) && !item.profiles.includes('all')) return;
    const bullets = item.bullets?.[profile] || item.bullets?.dev || item.bullets?.it || [];
    const div=document.createElement('div');
    div.className='timeline-item';
    div.setAttribute('data-show-in', item.profiles.join(' '));
    div.innerHTML=`<div class="timeline-dot"></div><div class="timeline-content"><h3>${item.title[lang]||item.title.fr}</h3><span class="timeline-company">${item.company}</span><div class="timeline-date">${item.date}</div><ul>${bullets.map(b=>`<li>${b}</li>`).join('')}</ul></div>`;
    container.appendChild(div);
  });
  // Education & Certs — render OUTSIDE timeline as proper subsections (not grid items)
  const expSection=document.getElementById('experience');
  // cleanup previous atelier blocks
  expSection.querySelectorAll('.edu-block, .cert-block').forEach(el=>el.remove());

  const eduLabel=content.i18n?.sections?.education?.[lang]||'Formation';
  const eduBlock=document.createElement('div');
  eduBlock.className='edu-block';
  eduBlock.setAttribute('data-show-in','all');
  eduBlock.innerHTML=`
    <div class="subsection-header">
      <span class="section-label">🎓 ${eduLabel}</span>
      <h3 class="subsection-title">${eduLabel}</h3>
    </div>
    <div class="edu-grid" id="edu-grid-inner"></div>
  `;
  expSection.appendChild(eduBlock);
  const eduGridEl=eduBlock.querySelector('#edu-grid-inner');
  const eduIcons=['sparkles','cpu','zap','scroll-text'];
  (content.education||[]).forEach((e,i)=>{
    const card=document.createElement('div');
    card.className='edu-card';
    card.innerHTML=`
      <div class="edu-icon"><i data-lucide="${eduIcons[i%eduIcons.length]}" style="width:18px;height:18px"></i></div>
      <div class="edu-main">
        <div class="education-diploma">${e.diploma[lang]||e.diploma.fr}</div>
        <div class="education-school">${e.school}</div>
      </div>
      <div class="education-year">${e.year}</div>
    `;
    eduGridEl.appendChild(card);
  });

  const certLabel=content.i18n?.sections?.certifications?.[lang]||'Certifications';
  const certBlock=document.createElement('div');
  certBlock.className='cert-block';
  certBlock.setAttribute('data-show-in','all');
  const prov=content.certifications?.provider||'';
  const pills=(content.certifications?.items||[]).map(i=>`<span class="cert-pill"><i data-lucide="badge-check" style="width:12px;height:12px"></i>${i}</span>`).join('');
  certBlock.innerHTML=`
    <div class="subsection-header">
      <span class="section-label">📜 ${certLabel}</span>
      <h3 class="subsection-title">${certLabel}</h3>
    </div>
    <div class="cert-card">
      <div class="cert-head">
        <span class="cert-provider-label">Provider</span>
        <strong class="cert-provider">${prov}</strong>
        <span class="cert-count">${(content.certifications?.items||[]).length} certs</span>
      </div>
      <div class="cert-list">${pills}</div>
    </div>
  `;
  expSection.appendChild(certBlock);
  if(window.lucide) window.lucide.createIcons();
}

export function renderProjects(content, profile, lang){
  const container=document.getElementById('projects-container');
  if(!container) return;
  container.innerHTML='';

  // Remove any previous early-works details outside container
  document.getElementById('early-works')?.remove();

  const allForProfile=(content.projects||[]).filter(p=> p.profiles.includes(profile));
  const main=allForProfile.filter(p=> !p.legacy);
  const legacy=allForProfile.filter(p=> p.legacy);

  const projects = main.length ? main : allForProfile.filter(p=> !p.legacy);
  // For profiles with no main (e.g., it), show fallback? Keep legacy separate
  projects.forEach(p=> appendCard(container, p, profile, lang));

  // Legacy collapsible — only for dev (where GameCafe/SurfSchool live)
  if(legacy.length){
    const details=document.createElement('details');
    details.id='early-works';
    details.className='early-works';
    details.style.gridColumn='1 / -1';
    const label = lang==='fr' ? 'Travaux antérieurs (pré-Laravel) — à refaire' : 'Early Works (pre-Laravel) — rebuild planned';
    const hint = lang==='fr' ? 'Projets pédagogiques en PHP natif, conservés pour historique. Non représentatifs du stack actuel (Laravel 13).' : 'Educational core-PHP projects, kept for history. Not representative of current Laravel 13 stack.';
    details.innerHTML=`
      <summary class="early-works-summary">
        <span class="early-works-title"><i data-lucide="archive" style="width:16px;height:16px"></i> ${label} <span class="early-works-count">${legacy.length}</span></span>
        <span class="early-works-hint">${hint}</span>
        <i data-lucide="chevron-down" class="early-works-chevron" style="width:16px;height:16px"></i>
      </summary>
      <div class="early-works-grid"></div>
    `;
    container.insertAdjacentElement('afterend', details);
    const grid=details.querySelector('.early-works-grid');
    legacy.forEach(p=> appendCard(grid, p, profile, lang, true));
    // also add a subtle grid for legacy
    if(window.lucide) window.lucide.createIcons();
    // animate chevron
    details.addEventListener('toggle', ()=>{
      const ch=details.querySelector('.early-works-chevron');
      if(ch) ch.style.transform = details.open ? 'rotate(180deg)' : 'rotate(0deg)';
    });
  }

  function appendCard(parent, p, profile, lang, isLegacy=false){
    const card=document.createElement('div');
    card.className='project-card' + (isLegacy ? ' project-card--legacy' : '');
    if(p.featured) card.classList.add('project-card--featured');
    card.setAttribute('data-show-in', p.profiles.join(' '));
    const hasDemo = p.links?.demo && p.links.demo !== '#';
    const hasGh = p.links?.github && p.links.github !== '#';
    const img = p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<div class="project-cover-placeholder"><span style="font-size:1.5rem">${profile==='dev'?'💻':profile==='telecom'?'📡':'🔧'}</span><span>${p.title}</span></div>`;
    const legacyBadge = isLegacy ? `<span class="tag tag--legacy">${lang==='fr'?'Héritage':'Legacy'}</span>` : '';
    const featuredBadge = p.featured ? `<span class="tag tag--featured">★ Featured</span>` : '';
    card.innerHTML=`
      <div class="project-cover">${img}</div>
      <div class="project-body">
        <div class="project-header"><h3>${p.title}</h3><div class="project-links">${hasGh?`<a href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>`:''}${hasDemo?`<a href="${p.links.demo}" target="_blank" rel="noopener">Demo</a>`:''}</div></div>
        <p>${p.desc[lang]||p.desc.fr}</p>
        <div class="project-tags">${featuredBadge}${legacyBadge}${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>`;
    parent.appendChild(card);
  }
}

export function renderContact(content, lang){
  const info=document.getElementById('contact-info');
  if(!info || !content?.meta) return;
  const m=content.meta;
  const t=content.i18n?.contact||{};
  const tr=(k)=> t[k]?.[lang]||t[k]?.fr||k;
  info.innerHTML=`
    <div class="contact-item"><div class="icon"><i data-lucide="mail"></i></div><div><span class="label">${tr('email')}</span><span class="value">${m.email}</span></div></div>
    <div class="contact-item"><div class="icon"><i data-lucide="phone"></i></div><div><span class="label">${tr('phone')}</span><span class="value">${m.phone}</span></div></div>
    <div class="contact-item"><div class="icon"><i data-lucide="map-pin"></i></div><div><span class="label">${tr('location')}</span><span class="value">${m.location[lang]||m.location.fr}</span></div></div>
    <div class="contact-item"><div class="icon"><i data-lucide="external-link"></i></div><div><span class="label">LinkedIn</span><span class="value"><a href="${m.links.linkedin}" target="_blank" rel="noopener">Yassine BEN ESSAHRAOUI</a></span></div></div>
    <div class="contact-item"><div class="icon"><i data-lucide="external-link"></i></div><div><span class="label">GitHub</span><span class="value"><a href="${m.links.github}" target="_blank" rel="noopener">BEN-ESSAHRAOUI-Yassine</a></span></div></div>
  `;
  document.getElementById('footer-linkedin').href=m.links.linkedin;
  document.getElementById('footer-github').href=m.links.github;
  document.getElementById('footer-email').href=`mailto:${m.email}`;
  document.getElementById('footer-year').textContent=new Date().getFullYear();
  if(window.lucide) window.lucide.createIcons();
}
