// Contact form — EmailJS with honeypot, validation and honest status messages.
// Falls back to opening the mail client when EmailJS is unavailable.
const CONFIG = {
  publicKey: 'WsWwZmb8pEWjK7GYb',
  serviceId: 'service_ehwo8z2',
  templateId: 'template_szc7qu6',
  toEmail: 'ybenessahraoui@gmail.com',
};
if (window.EMAILJS_CONFIG) Object.assign(CONFIG, window.EMAILJS_CONFIG);

export function initContactForm(messages = {}) {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const lang = () => document.documentElement.lang || 'fr';
  const t = (k) => messages[k]?.[lang()] || messages[k]?.en || '';

  if (window.emailjs && CONFIG.publicKey && CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    try { window.emailjs.init(CONFIG.publicKey); } catch {}
  }
  let t0 = Date.now();
  form.addEventListener('focusin', () => { t0 = Date.now(); }, { once: true });

  const note = document.getElementById('form-note');
  const setNote = (text, kind) => {
    if (!note) return;
    note.textContent = text;
    note.classList.toggle('ok', kind === 'ok');
    note.classList.toggle('ko', kind === 'ko');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    const hp = document.getElementById('hp');
    if (hp && hp.value.trim()) return;
    if (Date.now() - t0 < 1200) { setNote(t('wait'), ''); return; }

    const checks = [
      { id: 'f-name', ok: (v) => v.trim().length >= 2 },
      { id: 'f-email', ok: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      { id: 'f-msg', ok: (v) => v.trim().length >= 10 },
    ];
    let valid = true;
    let firstInvalid = null;
    checks.forEach(({ id, ok }) => {
      const input = document.getElementById(id);
      const field = input.closest('.field');
      field.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      if (!ok(input.value)) {
        field.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });
    if (!valid) {
      firstInvalid?.focus();
      setNote('', '');
      return;
    }

    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const message = document.getElementById('f-msg').value.trim();
    btn.disabled = true;
    const label = btn.querySelector('span');
    const prev = label.textContent;
    label.textContent = t('sending');
    setNote('', '');
    try {
      if (window.emailjs && CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && CONFIG.serviceId !== 'YOUR_SERVICE_ID') {
        await window.emailjs.send(CONFIG.serviceId, CONFIG.templateId, { from_name: name, from_email: email, message });
        setNote(t('sent'), 'ok');
        form.reset();
      } else {
        window.location.href = `mailto:${CONFIG.toEmail}?body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        setNote(t('mailOpen'), 'ok');
      }
    } catch {
      setNote(t('failed'), 'ko');
    }
    label.textContent = prev;
    btn.disabled = false;
  });

  ['f-name', 'f-email', 'f-msg'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', (e) => {
      e.target.closest('.field')?.classList.remove('invalid');
      e.target.removeAttribute('aria-invalid');
    });
  });
}
