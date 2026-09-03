export function initNavbar(){
  const navbar=document.getElementById('navbar');
  const sections=document.querySelectorAll('section[id]');
  const navLinks=document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', ()=>{
    if(window.scrollY>60) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
    let current='';
    sections.forEach(sec=>{ const top=sec.offsetTop-120; const bottom=top+sec.offsetHeight; if(window.scrollY>=top && window.scrollY<bottom) current=sec.id; });
    navLinks.forEach(a=>{ a.classList.remove('active'); if(a.getAttribute('href')==='#'+current) a.classList.add('active'); });
  });

  const btn=document.getElementById('scroll-top');
  window.addEventListener('scroll', ()=>{ if(window.scrollY>300) btn.classList.add('visible'); else btn.classList.remove('visible'); });
  btn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

  const hamburger=document.getElementById('hamburger');
  const menu=document.getElementById('mobile-menu');
  hamburger.addEventListener('click', ()=>{
    const open=hamburger.classList.toggle('open');
    menu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open?'true':'false');
  });
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
    hamburger.classList.remove('open'); menu.classList.remove('open'); hamburger.setAttribute('aria-expanded','false');
  }));
  // coachmark close
  const cm=document.getElementById('coachmark');
  const cmClose=document.getElementById('coachmark-close');
  const seen=localStorage.getItem('coachmarkSeen');
  if(seen) cm?.classList.add('hidden');
  cmClose?.addEventListener('click', ()=>{ cm.classList.add('hidden'); localStorage.setItem('coachmarkSeen','1'); });

  document.getElementById('scroll-arrow')?.addEventListener('click', ()=> document.getElementById('about')?.scrollIntoView({behavior:'smooth'}));
  document.getElementById('mode-toggle')?.addEventListener('click', toggleMode);

  // init mode icon from html
  updateModeIcon(document.documentElement.getAttribute('data-mode')||'dark');
}

function toggleMode(){
  const cur=document.documentElement.getAttribute('data-mode');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-mode', next);
  localStorage.setItem('mode', next);
  updateModeIcon(next);
}
function updateModeIcon(mode){
  const icon=document.querySelector('#mode-toggle i');
  if(icon){ icon.setAttribute('data-lucide', mode==='dark'?'sun':'moon'); if(window.lucide) window.lucide.createIcons(); }
}
