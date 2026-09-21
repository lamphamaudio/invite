/* ============================================================
   Nhạc nền — bật/tắt bằng một nút, chạy tiếp khi sang trang 2.
   ============================================================ */

(function () {
  'use strict';

  const KEY_ON = 'invite.music.on';
  const KEY_AT = 'invite.music.at';

  window.setupMusic = function (button) {
    const src = (window.INVITE && window.INVITE.musicSrc) || '';

    if (!src) { if (button) button.hidden = true; return; }
    if (!button) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;

    // Không mở được file thì giấu nút đi cho gọn, nhưng phải báo ra console —
    // nếu im lặng thì lúc gõ sai tên file sẽ ngồi đoán mãi không ra.
    audio.addEventListener('error', function () {
      button.hidden = true;
      console.warn(
        '[thiệp] Không mở được file nhạc: "' + src + '".\n' +
        'Kiểm tra: file đã nằm trong assets/music/ chưa, tên file trong ' +
        'config.js (musicSrc) có khớp từng chữ không (phân biệt hoa thường), ' +
        'và định dạng có phải mp3 / m4a / ogg / wav không.'
      );
    });

    /* Trạng thái theo Ý NGƯỜI DÙNG, không theo audio.paused.
       Lúc đang vuốt nhỏ tiếng thì audio.paused vẫn là false; nếu lấy nó
       làm mốc thì bấm tắt rồi bấm lại ngay sẽ hoá ra bật nhạc lần nữa —
       càng bấm càng kêu. */
    let wantOn = false;
    let fadeTimer = null;

    function fadeTo(target, ms, done) {
      clearInterval(fadeTimer);
      const from = audio.volume;
      const t0 = performance.now();

      fadeTimer = setInterval(function () {
        const k = Math.min((performance.now() - t0) / ms, 1);
        audio.volume = Math.max(0, Math.min(1, from + (target - from) * k));
        if (k >= 1) {
          clearInterval(fadeTimer);
          if (done) done();
        }
      }, 25);
    }

    function paint() {
      button.classList.toggle('is-on', wantOn);
      button.setAttribute('aria-label', wantOn ? 'Tắt nhạc' : 'Bật nhạc');
    }

    function start() {
      const at = parseFloat(sessionStorage.getItem(KEY_AT) || '0');
      if (at > 0 && at < 1e5) { try { audio.currentTime = at; } catch (e) {} }

      audio.play().then(function () {
        // người dùng đã bấm tắt trong lúc chờ thì đừng phát nữa
        if (!wantOn) { audio.pause(); return; }
        sessionStorage.setItem(KEY_ON, '1');
        fadeTo(0.55, 1400);
      }).catch(function () {
        // trình duyệt chặn phát tự động — chờ người dùng bấm
        wantOn = false;
        paint();
      });
    }

    function stop() {
      sessionStorage.setItem(KEY_ON, '0');
      fadeTo(0, 260, function () {
        if (!wantOn) audio.pause();
      });
    }

    button.addEventListener('click', function () {
      wantOn = !wantOn;
      paint();                 // đổi mặt nút ngay, đừng bắt chờ hết vuốt tiếng
      if (wantOn) start(); else stop();
    });

    // ghi lại vị trí để trang sau phát tiếp đúng chỗ
    setInterval(function () {
      if (!audio.paused) sessionStorage.setItem(KEY_AT, String(audio.currentTime));
    }, 1000);

    window.addEventListener('pagehide', function () {
      if (!audio.paused) sessionStorage.setItem(KEY_AT, String(audio.currentTime));
    });

    // đã bật ở trang trước thì bật tiếp
    if (sessionStorage.getItem(KEY_ON) === '1') {
      wantOn = true;
      paint();
      start();
    }
  };
})();
