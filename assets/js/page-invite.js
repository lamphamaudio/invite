/* ============================================================
   Trang 2 — thân mời · lịch · sơ đồ · kỷ niệm · hẹn gặp
   ============================================================ */

(function () {
  'use strict';

  const C = window.INVITE;
  const E = C.event;

  // Trang 2 chỉ vào được qua nút "Mở thiệp". Mở lại link mà trình duyệt
  // còn nhớ trang 2 thì đưa về trang bìa.
  function opened() {
    try { return sessionStorage.getItem('invite.opened') === '1'; } catch (e) { return true; }
  }
  if (!opened()) { location.replace('index.html'); return; }
  window.addEventListener('pagehide', function () {
    try { sessionStorage.removeItem('invite.opened'); } catch (e) {}
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && !opened()) location.replace('index.html');
  });

  const put = function (id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  };

  /* --- khung 1: thân mời --- */

  put('shoutName',  C.shoutName);
  put('shoutTitle', E.title);

  /* --- khung 2: lịch --- */

  const when = new Date(E.dateISO);

  if (!isNaN(when)) {
    put('calThang', 'Tháng ' + (when.getMonth() + 1));
    put('calNam', String(when.getFullYear()));
  }
  const calNote = document.getElementById('calGio').closest('.note');

  const calFig = document.getElementById('calFig');
  const calGrid = document.getElementById('cal');

  if (C.calImage) {
    const calImg = document.getElementById('calImg');
    calImg.addEventListener('load',  function () {
      calFig.hidden = false;
      document.getElementById('calHead').hidden = true;
    });
    calImg.addEventListener('error', function () {
      calFig.remove();
      if (!isNaN(when)) window.renderCalendar(calGrid, when);
      put('calGio', E.timeText);
      if (calNote) calNote.hidden = false;
    });
    calImg.src = C.calImage;
    calGrid.remove();
    if (calNote) calNote.hidden = true;
  } else {
    calFig.remove();
    if (!isNaN(when)) window.renderCalendar(calGrid, when);
    put('calGio', E.timeText);
  }

  /* --- khung 3: sơ đồ --- */

  put('dressCode', E.dressCode);

  const map = document.getElementById('mapLink');
  if (E.mapUrl) map.href = E.mapUrl; else document.getElementById('mapFact').remove();

  const sodo = document.getElementById('sodo');
  if (C.mapImage) {
    const img = document.getElementById('sodoImg');
    img.addEventListener('load',  function () { sodo.hidden = false; });
    img.addEventListener('error', function () { sodo.remove(); });
    img.src = C.mapImage;
  } else {
    sodo.remove();
  }

  /* --- khung 4: một chặng đường --- */

  put('storyTitle', C.storyTitle);

  const story = document.getElementById('storyBody');
  (C.storyBody || []).forEach(function (para) {
    const p = document.createElement('p');
    p.textContent = para;
    story.appendChild(p);
  });

  const storyFig = document.getElementById('storyFig');
  if (C.storyImage) {
    const storyImg = document.getElementById('storyImg');
    storyImg.addEventListener('load',  function () { storyFig.hidden = false; });
    storyImg.addEventListener('error', function () { storyFig.remove(); });
    storyImg.src = C.storyImage;
  } else {
    storyFig.remove();
  }

  const snaps = document.getElementById('snaps');
  const kyniem = C.memories || [];

  kyniem.forEach(function (p) {
    const fig = document.createElement('figure');
    fig.className = 'snap';

    const tape = document.createElement('span');
    tape.className = 'snap__tape';
    tape.setAttribute('aria-hidden', 'true');
    fig.appendChild(tape);

    const img = document.createElement('img');
    img.alt = p.caption || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', function () { fig.remove(); });
    img.src = p.src;

    fig.appendChild(img);
    snaps.appendChild(fig);
  });

  if (!kyniem.length) snaps.remove();

  /* --- khung 5: hẹn gặp --- */

  put('closingTitle', C.closingTitle);
  put('closingLine',  C.closingLine);
  put('closingSub',   'tại ' + (E.title || '') + ' của ' + (C.shoutName || ''));

  /* --- đếm ngược --- */

  const cdEl = document.getElementById('countdown');
  const target = when.getTime();

  const UNITS = [
    { key: 'd', label: 'ngày' },
    { key: 'h', label: 'giờ' },
    { key: 'm', label: 'phút' },
    { key: 's', label: 'giây' },
  ];

  let built = false;

  function renderCountdown() {
    if (isNaN(target)) { cdEl.hidden = true; return; }

    const diff = target - Date.now();

    if (diff <= 0) {
      cdEl.innerHTML = '';
      const done = document.createElement('p');
      done.className = 'cd__done';
      done.textContent = 'Hôm nay rồi!';
      cdEl.appendChild(done);
      built = false;
      return;
    }

    const s = Math.floor(diff / 1000);
    const v = {
      d: Math.floor(s / 86400),
      h: Math.floor((s % 86400) / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
    };

    if (!built) {
      cdEl.innerHTML = '';
      UNITS.forEach(function (u) {
        const wrap = document.createElement('span');
        wrap.className = 'cd__unit';

        const num = document.createElement('span');
        num.className = 'cd__num';
        num.dataset.k = u.key;

        const lab = document.createElement('span');
        lab.className = 'cd__label';
        lab.textContent = u.label;

        wrap.append(num, lab);
        cdEl.appendChild(wrap);
      });
      built = true;
    }

    UNITS.forEach(function (u) {
      const el = cdEl.querySelector('[data-k="' + u.key + '"]');
      const next = u.key === 'd' ? String(v.d) : String(v[u.key]).padStart(2, '0');
      if (el && el.textContent !== next) el.textContent = next;
    });
  }

  renderCountdown();
  setInterval(renderCountdown, 1000);

  /* --- nhạc --- */

  const music = document.getElementById('music');
  if (C.musicSrc) music.hidden = false;
  window.setupMusic(music);
})();
