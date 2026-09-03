import { initProfiles, setProfile, getCurrentProfile } from './modules/profiles.js';
import { initI18n, setLang } from './modules/i18n.js';
import { initTypewriter, initScrollAnimations } from './modules/animations.js';
import { initNavbar } from './modules/navbar.js';
import { initContactForm } from './modules/email.js';
import { renderHeroSwitcher, renderStats, renderSkills, renderTimeline, renderProjects, renderContact } from './modules/render.js';

let content=null;

async function loadContent(){
  const res=await fetch('data/content.json', {cache:'no-store'});
  if(!res.ok) throw new Error('Failed to load content.json');
  return res.json();
}

function applyProfileRender(profile){
  const lang=document.documentElement.lang||'fr';
  renderStats(content, profile, lang);
  renderSkills(content, profile, lang);
  renderTimeline(content, profile, lang);
  renderProjects(content, profile, lang);
  // re-trigger animations for new elements
  setTimeout(()=> initScrollAnimations(), 50);
  if(window.lucide) window.lucide.createIcons();
}

function init(){
  // mode from storage or system
  const savedMode=localStorage.getItem('mode');
  if(savedMode) document.documentElement.setAttribute('data-mode', savedMode);
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-mode','light');

  // set mode icon later via navbar

  loadContent().then(c=>{
    content=c;

    // schema
    const schemaEl=document.getElementById('person-schema');
    if(schemaEl){
      schemaEl.textContent=JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Person",
        "name": content.meta.name,
        "url": location.origin+location.pathname,
        "sameAs":[content.meta.links.linkedin, content.meta.links.github],
        "jobTitle": content.profiles.dev.title.en
      });
    }

    // i18n first
    initI18n(content);
    // hero switcher
    renderHeroSwitcher(content);
    // contact static
    const lang=document.documentElement.lang||'fr';
    renderContact(content, lang);

    // profiles with callback to re-render
    initProfiles(content, { onChange: (profile, lang)=> {
      applyProfileRender(profile);
      // dispatch for typewriter
      window.dispatchEvent(new CustomEvent('profilechange', {detail:{profile}}));
    }});

    // initial render for default profile
    const initialProfile=getCurrentProfile();
    applyProfileRender(initialProfile);

    // listen to switcher requests (hero cards)
    window.addEventListener('requestProfileChange', (e)=> setProfile(e.detail.profile, content));
    // lang change re-renders
    window.addEventListener('langchange', (e)=>{
      const lang=e.detail.lang;
      const profile=getCurrentProfile();
      renderHeroSwitcher(content);
      // need to re-mark active hero card
      document.querySelectorAll('.hero-switcher-card').forEach(card=>{
        card.classList.toggle('active', card.dataset.profile===profile);
      });
      applyProfileRender(profile);
      renderContact(content, lang);
      if(window.lucide) window.lucide.createIcons();
    });

    initTypewriter(content);
    initScrollAnimations();
    initNavbar();
    initContactForm();

    if(window.lucide) window.lucide.createIcons();
  }).catch(err=>{
    console.error(err);
    document.body.insertAdjacentHTML('afterbegin', `<div style="background:#ef4444;color:white;padding:12px;text-align:center">Failed to load data/content.json — check JSON validity.</div>`);
  });
}

init();
