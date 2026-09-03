export const PROFILES = ['dev','telecom','it'];

let onProfileChange = null;

export function initProfiles(content, callbacks){
  onProfileChange = callbacks?.onChange || null;

  document.querySelectorAll('.profile-tab').forEach(tab=>{
    tab.addEventListener('click', ()=> setProfile(tab.dataset.profile, content));
  });

  // hero switcher rendered dynamically
  const params = new URLSearchParams(location.search);
  const urlProfile = params.get('profile');
  const saved = localStorage.getItem('profile');
  const prefers = urlProfile && PROFILES.includes(urlProfile) ? urlProfile : (saved && PROFILES.includes(saved) ? saved : 'dev');
  setProfile(prefers, content, false);
}

export function setProfile(name, content, pushUrl=true){
  if(!PROFILES.includes(name)) name='dev';
  document.documentElement.setAttribute('data-profile', name);
  localStorage.setItem('profile', name);
  if(pushUrl){
    const url = new URL(location.href);
    url.searchParams.set('profile', name);
    history.replaceState(null,'',url);
  }
  document.querySelectorAll('.profile-tab').forEach(tab=>{
    const active = tab.dataset.profile===name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  // hero cards active
  document.querySelectorAll('.hero-switcher-card').forEach(card=>{
    const active = card.dataset.profile===name;
    card.classList.toggle('active', active);
    card.setAttribute('aria-selected', active ? 'true':'false');
  });
  // CV switch
  const cvLink = document.getElementById('cv-link');
  if(cvLink && content?.cv) cvLink.href = content.cv[name] || content.cv.dev;
  // breadcrumb
  const bp = document.getElementById('breadcrumb-profile');
  const ba = document.getElementById('breadcrumb-also');
  if(content?.profiles){
    const lang = document.documentElement.lang || 'fr';
    if(bp) bp.textContent = content.profiles[name].title[lang] || name;
    if(ba){
      const others = PROFILES.filter(p=>p!==name).map(p=> content.profiles[p].label[lang] || p).join(' · ');
      ba.textContent = others;
    }
    // also update title/tagline/typewriter roles trigger via callback
  }
  // hero title/tagline
  const lang = document.documentElement.lang || 'fr';
  const prof = content?.profiles?.[name];
  const heroTitle = document.getElementById('hero-title');
  const heroTagline = document.getElementById('hero-tagline');
  const aboutBio = document.getElementById('about-bio');
  if(prof){
    if(heroTitle) heroTitle.textContent = prof.title[lang] || prof.title.fr;
    if(heroTagline) heroTagline.textContent = prof.tagline[lang] || prof.tagline.fr;
  }
  if(aboutBio && content?.about){
    aboutBio.textContent = content.about[name]?.[lang] || content.about[name]?.fr || '';
  }
  // Update projects/about/stats visibility via CSS data-show-in? Instead render via JS
  if(onProfileChange) onProfileChange(name, lang);
  // reset stat counters animation
  resetAndRunCounters(name);
}

function resetAndRunCounters(profile){
  // remove counted so intersection observer re-runs for visible stats
  document.querySelectorAll('#stats-container .stat-number').forEach(el=>{
    el.classList.remove('counted');
    el.textContent='0';
  });
  // trigger observer by re-observing
  setTimeout(()=> initStatCounters(profile), 50);
}

function initStatCounters(profile){
  const container = document.getElementById('stats-container');
  if(!container) return;
  // Only visible cards
  const numbers = container.querySelectorAll(`[data-show-in*="${profile}"] .stat-number, [data-show-in="${profile}"] .stat-number, [data-show-in="all"] .stat-number`);
  // Fallback if no data-show-in wrapping
  const all = numbers.length ? numbers : container.querySelectorAll('.stat-number');
  all.forEach(el=>{
    if(el.classList.contains('counted')) return;
    const target = parseInt(el.getAttribute('data-target'),10);
    if(isNaN(target) || target<=0){ el.textContent='—'; el.classList.add('counted'); return; }
    el.classList.add('counted');
    animateCount(el, target);
  });
  // Also use IntersectionObserver for below-fold
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        if(el.classList.contains('counted-obs')) return;
        el.classList.add('counted-obs');
        const t = parseInt(el.getAttribute('data-target'),10);
        if(t>0 && el.textContent==='0') animateCount(el,t);
      }
    });
  },{threshold:0.3});
  all.forEach(el=>obs.observe(el));
}

function animateCount(el, target){
  const duration=1500; let start=null;
  function easeOut(t){ return 1-Math.pow(1-t,3); }
  function step(ts){
    if(!start) start=ts;
    const progress=Math.min((ts-start)/duration,1);
    const eased=easeOut(progress);
    el.textContent=Math.round(eased*target);
    if(progress<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function getCurrentProfile(){ return document.documentElement.getAttribute('data-profile')||'dev'; }
