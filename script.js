const reveals = [
  { date: new Date('2026-05-02T00:00:00'), label: '??? — 2 MAI' },
  { date: new Date('2026-05-09T00:00:00'), label: '??? — 9 MAI' },
  { date: new Date('2026-05-16T00:00:00'), label: '??? — 16 MAI' },
  { date: new Date('2026-05-23T00:00:00'), label: '??? — 23 MAI' },
  { date: new Date('2026-05-30T00:00:00'), label: '??? — 30 MAI' },
];

function pad(n) { return String(n).padStart(2,'0'); }

function timeTo(target) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return { d: Math.floor(s/86400), h: Math.floor((s%86400)/3600), m: Math.floor((s%3600)/60), s: s%60 };
}

function cdHTML(t) {
  return ['d','h','m','s'].map((u,i) => {
    const v = [t.d,t.h,t.m,t.s][i];
    const l = ['j','h','m','s'][i];
    return `<div class="cd-block"><span class="cd-num">${pad(v)}</span><span class="cd-label">${l}</span></div>`;
  }).join('');
}

function revealCard(card) {
  card.classList.remove('mystery');
  const sat = card.dataset.sat ? ' sat' : '';
  card.innerHTML = `
    <div class="artist-img"><img src="${card.dataset.img}" alt="${card.dataset.name}"></div>
    <div class="artist-name">${card.dataset.name}</div>
    <div class="artist-genre">${card.dataset.genre}</div>
    <span class="artist-day${sat}">${card.dataset.day}</span>`;
}

function tick() {
  // Slots programme mystère
  document.querySelectorAll('.prog-slot.mystery-slot').forEach(slot => {
    const t = timeTo(new Date(slot.dataset.reveal));
    if (!t) {
      // Révéler le slot
      slot.classList.remove('mystery-slot');
      slot.innerHTML = `
        <div>
          <div class="prog-artist">${slot.dataset.name}</div>
          <div class="prog-genre">${slot.dataset.genre}</div>
        </div>
        <div class="prog-time">${slot.dataset.time}</div>`;
      return;
    }
    const cd = slot.querySelector('.prog-mini-cd');
    if (cd) cd.innerHTML = ['d','h','m','s'].map((u,i) => {
      const v = [t.d,t.h,t.m,t.s][i];
      return `<div class="prog-mini-block"><span class="prog-mini-num">${pad(v)}</span><span class="prog-mini-lbl">${u}</span></div>`;
    }).join('');
  });

  // Cartes mystère
  document.querySelectorAll('.artist-card.mystery').forEach(card => {
    const t = timeTo(new Date(card.dataset.reveal));
    if (!t) { revealCard(card); return; }
    const el = card.querySelector('.mystery-countdown');
    if (el) el.innerHTML = cdHTML(t);
  });

  // Bandeau
  const next = reveals.filter(r => r.date > Date.now()).sort((a,b) => a.date-b.date)[0];
  const banner = document.getElementById('next-banner');
  if (!next) { if(banner) banner.style.display='none'; return; }
  const t = timeTo(next.date);
  if (t) {
    document.getElementById('nab-title').textContent = next.label;
    document.getElementById('nab-d').textContent = pad(t.d);
    document.getElementById('nab-h').textContent = pad(t.h);
    document.getElementById('nab-m').textContent = pad(t.m);
    document.getElementById('nab-s').textContent = pad(t.s);
  }
}

tick();
setInterval(tick, 1000);

// Burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
// Fermer le menu au clic sur un lien
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});
