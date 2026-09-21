/* ============================================================
   Lịch tháng — dựng thẳng từ dateISO trong config.

   Vẽ bằng HTML chứ không dùng ảnh: chữ nét ở mọi màn hình, và
   đổi ngày trong config là lịch tự đúng theo, không phải sửa tay.
   ============================================================ */

(function () {
  'use strict';

  const THU = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

  window.renderCalendar = function (root, when) {
    if (!root || isNaN(when)) return;

    const nam = when.getFullYear();
    const thang = when.getMonth();          // 0–11
    const ngayLe = when.getDate();

    root.textContent = '';

    // --- hàng tiêu đề ---
    THU.forEach(function (t) {
      const c = document.createElement('div');
      c.className = 'cal__head';
      c.textContent = t;
      root.appendChild(c);
    });

    // getDay(): 0 = Chủ nhật. Lịch ta bắt đầu từ Thứ hai nên phải dịch lại.
    const dauThang = new Date(nam, thang, 1);
    const lech = (dauThang.getDay() + 6) % 7;
    const soNgay = new Date(nam, thang + 1, 0).getDate();

    for (let i = 0; i < lech; i++) {
      const c = document.createElement('div');
      c.className = 'cal__cell cal__cell--trong';
      root.appendChild(c);
    }

    for (let d = 1; d <= soNgay; d++) {
      const c = document.createElement('div');
      c.className = 'cal__cell';

      // cột cuối là chủ nhật — tô đỏ như trong bản gốc
      if ((lech + d - 1) % 7 === 6) c.classList.add('cal__cell--cn');

      const s = document.createElement('span');
      s.className = 'cal__so';
      s.textContent = String(d);
      c.appendChild(s);

      if (d === ngayLe) {
        c.classList.add('cal__cell--le');
        c.setAttribute('aria-current', 'date');
        // vòng khoanh vẽ tay: ellipse hơi lệch tâm cho ra nét bút
        c.insertAdjacentHTML('beforeend',
          '<svg class="cal__khoanh" viewBox="0 0 100 100" aria-hidden="true">' +
          '<path d="M72,26 C88,38 84,64 62,76 C40,88 14,80 10,60 C6,40 26,20 52,18 C64,17 74,20 79,26"' +
          ' fill="none" stroke="currentColor" stroke-width="5"' +
          ' stroke-linecap="round"/></svg>');
      }

      root.appendChild(c);
    }

    // lấp nốt ô trống cuối tháng cho lưới vuông vắn
    const daVe = lech + soNgay;
    const con = (7 - (daVe % 7)) % 7;
    for (let i = 0; i < con; i++) {
      const c = document.createElement('div');
      c.className = 'cal__cell cal__cell--trong';
      root.appendChild(c);
    }
  };
})();
