/* ============================================================
   Trang 1 — trang bìa
   ============================================================ */

(function () {
  'use strict';

  const C = window.INVITE;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('shoutName').textContent  = C.shoutName || '';
  document.getElementById('shoutTitle').textContent = C.event.title || '';

  /* --- ba tấm ảnh đứng dọc mép dưới --- */

  const cast = document.getElementById('cast');
  const shots = C.photos || [];

  // 'cutout' = ảnh đã tách nền (PNG trong suốt) · 'print' = ảnh chữ nhật có viền
  cast.dataset.style = C.photoStyle === 'cutout' ? 'cutout' : 'print';

  shots.slice(0, 3).forEach(function (p, i) {
    const fig = document.createElement('div');
    fig.className = 'cast__item';
    fig.dataset.slot = String(i);          // giữa cao hơn hai bên

    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.addEventListener('error', function () { fig.remove(); });
    img.src = p.src;

    fig.appendChild(img);
    cast.appendChild(fig);
  });

  if (!shots.length) cast.hidden = true;

  /* --- mở thiệp: cả trang mờ đi rồi sang trang 2 --- */

  const btn = document.getElementById('open');
  let going = false;

  btn.addEventListener('click', function () {
    if (going) return;
    going = true;
    btn.disabled = true;

    if (REDUCED) { location.href = 'invite.html'; return; }

    try { sessionStorage.setItem('invite.opened', '1'); } catch (e) {}
    document.body.classList.add('leaving');
    setTimeout(function () { location.href = 'invite.html'; }, 520);
  });

  // Bấm "Quay lại" từ trang 2, trình duyệt khôi phục nguyên trạng thái cũ
  // (đang mờ trắng, nút đã khóa). Trả về như mới.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    going = false;
    btn.disabled = false;
    document.body.classList.remove('leaving');
  });

  /* --- nhạc --- */

  const music = document.getElementById('music');
  if (C.musicSrc) music.hidden = false;
  window.setupMusic(music);
})();
