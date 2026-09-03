let typewriterTimeout=null;

export function initTypewriter(content){
  function getRoles(){
    const profile=document.documentElement.getAttribute('data-profile')||'dev';
    const lang=document.documentElement.lang||'fr';
    const prof=content?.profiles?.[profile];
    if(prof?.roles) return prof.roles[lang]||prof.roles.fr||prof.roles.en||[];
    return ['Full Stack Developer'];
  }

  function start(){
    if(typewriterTimeout) clearTimeout(typewriterTimeout);
    const el=document.getElementById('typewriter-text');
    if(!el) return;
    const roles=getRoles();
    let roleIndex=0, charIndex=0, isDeleting=false;
    const baseSpeed=80;
    el.textContent='';

    function type(){
      const cur=roles[roleIndex]||'';
      if(!isDeleting){
        el.textContent=cur.substring(0, charIndex+1);
        charIndex++;
        if(charIndex===cur.length){ isDeleting=true; typewriterTimeout=setTimeout(type, 2000); return; }
        typewriterTimeout=setTimeout(type, baseSpeed);
      } else {
        el.textContent=cur.substring(0, charIndex-1);
        charIndex--;
        if(charIndex===0){ isDeleting=false; roleIndex=(roleIndex+1)%roles.length; typewriterTimeout=setTimeout(type, 500); return; }
        typewriterTimeout=setTimeout(type, 40);
      }
    }
    typewriterTimeout=setTimeout(type, 300);
  }

  start();
  // re-init on profile/lang change
  window.addEventListener('profilechange', start);
  window.addEventListener('langchange', start);
  // also expose for profiles.js to call after set
  return start;
}

export function initScrollAnimations(){
  const els=document.querySelectorAll('.animate-on-scroll:not(.initialized)');
  if(!els.length) return;
  const obs=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target);} });},{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>{ obs.observe(el); el.classList.add('initialized'); });
  const stags=document.querySelectorAll('.stagger-30:not(.stagger-init)');
  const sobs=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); sobs.unobserve(e.target);} });},{threshold:0.1});
  stags.forEach(el=>{ sobs.observe(el); el.classList.add('stagger-init'); });
}
