// Contact form — Name / Email / Message only (spec)
const CONFIG = {
  publicKey: 'WsWwZmb8pEWjK7GYb',
  serviceId: 'service_ehwo8z2',
  templateId: 'template_szc7qu6',
  toEmail: 'ybenessahraoui@gmail.com',
};
if (window.EMAILJS_CONFIG) Object.assign(CONFIG, window.EMAILJS_CONFIG);

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  if (window.emailjs && CONFIG.publicKey && CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    try { window.emailjs.init(CONFIG.publicKey); } catch {}
  }
  let t0 = Date.now();
  form.addEventListener('focusin', () => { t0 = Date.now(); }, { once: true });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = document.documentElement.lang || 'fr';
    const note = document.getElementById('form-note');
    const btn = document.getElementById('send-btn');
    const hp = document.getElementById('hp');
    if (hp && hp.value.trim()) return;
    if (Date.now() - t0 < 1200) { note.textContent = lang === 'fr' ? 'Veuillez patienter…' : 'Please wait…'; return; }

    const checks = [
      { id: 'f-name', ok: (v) => v.trim().length >= 2 },
      { id: 'f-email', ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      { id: 'f-msg', ok: (v) => v.trim().length >= 10 },
    ];
    let valid = true;
    checks.forEach(({ id, ok }) => {
      const input = document.getElementById(id);
      const field = input.closest('.field');
      field.classList.remove('invalid');
      if (!ok(input.value)) { field.classList.add('invalid'); valid = false; }
    });
    if (!valid) return;

    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const message = document.getElementById('f-msg').value.trim();
    btn.disabled = true;
    const label = btn.querySelector('span');
    const prev = label.textContent;
    label.textContent = lang === 'fr' ? 'Envoi…' : 'Sending…';
    note.textContent = '';
    try {
      if (window.emailjs && CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && CONFIG.serviceId !== 'YOUR_SERVICE_ID') {
        await window.emailjs.send(CONFIG.serviceId, CONFIG.templateId, { from_name: name, from_email: email, message });
        note.textContent = lang === 'fr' ? 'Message envoyé. Merci.' : 'Message sent. Thank you.';
        form.reset();
      } else {
        window.location.href = `mailto:${CONFIG.toEmail}?body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        note.textContent = lang === 'fr' ? 'Client mail ouvert.' : 'Mail client opened.';
      }
    } catch {
      note.textContent = lang === 'fr' ? "Échec d'envoi. Réessayez ou écrivez-moi directement." : 'Send failed. Try again or email me directly.';
    }
    label.textContent = prev;
    btn.disabled = false;
  });

  ['f-name', 'f-email', 'f-msg'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', (e) => e.target.closest('.field')?.classList.remove('invalid'));
  });
}
