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
  window.addEventListener('profilechange', start);
  window.addEventListener('langchange', start);
  return start;
}

export function initScrollAnimations(){
  // Cursor
  const dot=document.getElementById('cursor-dot');
  const ring=document.getElementById('cursor-ring');
  if(dot && ring && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    let mx=0, my=0, rx=0, ry=0;
    window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dot.style.transform=`translate(${mx-5}px,${my-5}px)`; });
    function ringRaf(){
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.transform=`translate(${rx-14}px,${ry-14}px)`;
      requestAnimationFrame(ringRaf);
    }
    ringRaf();
    document.querySelectorAll('a, button, .project-card, .skill-pill').forEach(el=>{
      el.addEventListener('mouseenter', ()=>{ dot.style.transform+= ' scale(1.8)'; ring.style.transform+= ' scale(1.4)'; ring.style.opacity='0.9'; });
      el.addEventListener('mouseleave', ()=>{ ring.style.opacity='0.5'; });
    });
  }

  // Lenis
  let lenis=null;
  if(window.Lenis){
    lenis=new window.Lenis({ lerp:0.08, wheelMultiplier:0.9 });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // GSAP
  if(window.gsap && window.ScrollTrigger){
    window.gsap.registerPlugin(window.ScrollTrigger);
    // Hero immediate (no ScrollTrigger — above fold)
    const heroCopy=document.querySelector('.hero-copy.reveal');
    if(heroCopy){
      window.gsap.fromTo(heroCopy, { y:18, opacity:0 }, { y:0, opacity:1, duration:0.7, ease:'power3.out', delay:0.15 });
    }
    const heroVisual=document.querySelector('.hero-visual.reveal');
    if(heroVisual){
      window.gsap.fromTo(heroVisual, { y:18, opacity:0 }, { y:0, opacity:1, duration:0.7, ease:'power3.out', delay:0.25 });
    }
    // Other reveals (skip hero)
    const reveals=document.querySelectorAll('.reveal:not(.hero-copy):not(.hero-visual)');
    reveals.forEach(el=>{
      window.gsap.fromTo(el,
        { y:28, opacity:0 },
        { y:0, opacity:1, duration:0.7, ease:'power3.out',
          scrollTrigger:{ trigger:el, start:'top 88%', once:true }
        }
      );
    });
    // Hero tickets stagger — immediate after hero copy
    const cards=document.querySelectorAll('.hero-switcher-card');
    if(cards.length){
      window.gsap.fromTo(cards, { y:16, opacity:0 }, { y:0, opacity:1, duration:0.55, stagger:0.08, ease:'power3.out', delay:0.45 });
    }
    // Parallax on avatar wrap
    const wrap=document.getElementById('hero-avatar-wrap');
    if(wrap){
      window.gsap.to(wrap, { yPercent:-3, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:0.6 } });
    }
    // Projects stagger
    window.gsap.utils.toArray('.project-card').forEach((card,i)=>{
      window.gsap.from(card, { y:22, opacity:0, duration:0.5, delay: (i%2)*0.06, ease:'power2.out', scrollTrigger:{ trigger:card, start:'top 88%', once:true } });
    });
  } else {
    // Fallback IntersectionObserver
    const els=document.querySelectorAll('.reveal:not(.initialized)');
    if(!els.length) return;
    const obs=new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target);} });},{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
    els.forEach(el=>{ obs.observe(el); el.classList.add('initialized'); el.classList.add('reveal'); });
  }
}
