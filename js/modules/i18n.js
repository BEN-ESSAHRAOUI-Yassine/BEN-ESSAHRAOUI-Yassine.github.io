let contentRef=null;

export function initI18n(content){
  contentRef=content;
  const params=new URLSearchParams(location.search);
  const urlLang=params.get('lang');
  const saved=localStorage.getItem('lang');
  const browser=(navigator.language||'fr').slice(0,2).toLowerCase();
  const initial = urlLang && ['fr','en'].includes(urlLang) ? urlLang : (saved && ['fr','en'].includes(saved) ? saved : (['fr','en'].includes(browser)?browser:'fr'));
  setLang(initial, false);

  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> setLang(btn.dataset.lang, true));
  });
}

export function setLang(lang, pushUrl=true){
  if(!['fr','en'].includes(lang)) lang='fr';
  document.documentElement.lang=lang;
  localStorage.setItem('lang', lang);
  if(pushUrl){
    const url=new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null,'',url);
  }
  document.querySelectorAll('.lang-btn').forEach(b=>{
    const active=b.dataset.lang===lang;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', active?'true':'false');
  });
  applyI18n(lang);
  // also update profile-dependent texts
  const profile=document.documentElement.getAttribute('data-profile')||'dev';
  if(contentRef){
    const prof=contentRef.profiles?.[profile];
    const ht=document.getElementById('hero-title');
    const htg=document.getElementById('hero-tagline');
    const bio=document.getElementById('about-bio');
    if(prof){
      if(ht) ht.textContent=prof.title[lang]||prof.title.fr;
      if(htg) htg.textContent=prof.tagline[lang]||prof.tagline.fr;
    }
    if(bio) bio.textContent=contentRef.about?.[profile]?.[lang]||contentRef.about?.[profile]?.fr||'';
    // re-render dynamic sections with new lang
    window.dispatchEvent(new CustomEvent('langchange',{detail:{lang}}));
  }
}

function t(path, lang){
  if(!contentRef?.i18n) return null;
  const parts=path.split('.');
  let cur=contentRef.i18n;
  for(const p of parts){ cur=cur?.[p]; if(cur===undefined) return null; }
  if(cur && typeof cur==='object' && (cur.fr||cur.en)) return cur[lang]||cur.fr||cur.en;
  return null;
}

export function applyI18n(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.getAttribute('data-i18n');
    const val=t(key, lang);
    if(val!==null) el.textContent=val;
  });
  // placeholders
  const map={
    'form-name': 'contact.formNamePh',
    'form-email': 'contact.formEmailPh',
    'form-subject': 'contact.formSubjectPh',
    'form-message': 'contact.formMessagePh'
  };
  Object.entries(map).forEach(([id,key])=>{
    const inp=document.getElementById(id);
    const v=t(key, lang);
    if(inp && v) inp.placeholder=v;
  });
}

export function getLang(){ return document.documentElement.lang||'fr'; }
