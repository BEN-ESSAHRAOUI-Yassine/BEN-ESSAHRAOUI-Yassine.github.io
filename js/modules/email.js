// EmailJS — fill your keys here or via window.EMAILJS_CONFIG in index.html
const CONFIG = {
  publicKey: 'WsWwZmb8pEWjK7GYb',
  serviceId: 'service_ehwo8z2',
  templateId: 'template_szc7qu6',
  toEmail: 'ybenessahraoui@gmail.com'
};
if(window.EMAILJS_CONFIG) Object.assign(CONFIG, window.EMAILJS_CONFIG);

export function initContactForm(i18nGet){
  const form=document.getElementById('contact-form');
  if(!form) return;
  // init emailjs if key present
  if(window.emailjs && CONFIG.publicKey && CONFIG.publicKey!=='YOUR_PUBLIC_KEY'){
    try{ window.emailjs.init(CONFIG.publicKey); }catch{}
  }

  const hp=document.getElementById('hp-company');
  let submitStart=Date.now();
  form.addEventListener('focusin', ()=>{ submitStart=Date.now(); }, {once:true});

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const lang=document.documentElement.lang||'fr';

    // honeypot
    if(hp && hp.value.trim()){ showStatus('error', lang); return; }
    if(Date.now()-submitStart < 1200){ showStatus('error', lang); return; }

    const fields=[
      {id:'form-name', group:'form-group-name', validate: v=> v.trim().length>=2},
      {id:'form-email', group:'form-group-email', validate: v=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())},
      {id:'form-subject', group:'form-group-subject', validate: v=> v.trim().length>=3},
      {id:'form-message', group:'form-group-message', validate: v=> v.trim().length>=10},
    ];
    let valid=true;
    fields.forEach(f=>{
      const input=document.getElementById(f.id);
      const group=document.getElementById(f.group);
      group.classList.remove('error');
      if(!f.validate(input.value)){ group.classList.add('error'); valid=false; }
    });
    if(!valid){
      setTimeout(()=> document.querySelectorAll('.form-group.error').forEach(g=>g.classList.remove('error')), 2200);
      return;
    }

    const btn=document.getElementById('form-submit');
    const status=document.getElementById('form-status');
    const success=document.getElementById('form-success');
    const name=document.getElementById('form-name').value.trim();
    const email=document.getElementById('form-email').value.trim();
    const subject=document.getElementById('form-subject').value.trim();
    const message=document.getElementById('form-message').value.trim();

    btn.disabled=true;
    const prevText=btn.textContent;
    btn.textContent = lang==='fr' ? 'Envoi...' : 'Sending...';
    status.textContent=''; status.className='form-status';

    try{
      if(window.emailjs && CONFIG.publicKey!=='YOUR_PUBLIC_KEY' && CONFIG.serviceId!=='YOUR_SERVICE_ID'){
        await window.emailjs.send(CONFIG.serviceId, CONFIG.templateId, { from_name:name, from_email:email, subject, message });
        success.classList.add('show');
        btn.style.display='none';
        status.textContent = lang==='fr' ? 'Message envoyé ! Merci.' : 'Message sent! Thanks.';
        status.className='form-status success';
        form.reset();
        if(window.lucide) window.lucide.createIcons();
      } else {
        // fallback mailto
        const mailto=`mailto:${CONFIG.toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('De: '+name+' ('+email+')\n\n'+message)}`;
        success.classList.add('show');
        btn.style.display='none';
        if(window.lucide) window.lucide.createIcons();
        window.location.href=mailto;
        status.textContent = lang==='fr' ? 'Client mail ouvert — configure EmailJS pour envoi direct.' : 'Mail client opened — configure EmailJS for direct send.';
        status.className='form-status success';
      }
    }catch(err){
      console.error(err);
      status.textContent = lang==='fr' ? 'Erreur d\'envoi. Réessayez ou contactez-moi directement.' : 'Send failed. Try again or contact directly.';
      status.className='form-status error';
      btn.disabled=false;
      btn.textContent=prevText;
      return;
    }
    btn.disabled=false;
  });

  ['form-name','form-email','form-subject','form-message'].forEach(id=>{
    const input=document.getElementById(id);
    input?.addEventListener('input', ()=>{ const g=input.closest('.form-group'); if(g) g.classList.remove('error'); });
  });
}

function showStatus(type, lang){
  const status=document.getElementById('form-status');
  if(!status) return;
  status.className='form-status '+type;
  status.textContent = type==='error' ? (lang==='fr'?'Erreur, réessayez.':'Error, try again.') : '';
}
