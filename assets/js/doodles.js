/* ============================================================
   Doodles — bộ hoạ tiết vẽ tay, chèn một lần vào đầu <body>.
   Dùng: <svg class="..."><use href="#d-spark"></use></svg>

   Để trong JS thay vì file .svg rời để thiệp vẫn chạy khi mở
   thẳng bằng file:// (fetch bị chặn, thẻ script thì không).
   ============================================================ */

(function () {
  'use strict';

  const SPRITE = `<svg width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
  <defs>

    <!-- tia nắng: ba vạch toả ra, dùng kèm hai bên một dòng chữ -->
    <symbol id="d-spark" viewBox="0 0 30 44">
      <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
        <path d="M3,6 L26,15"/>
        <path d="M1,22 L28,22"/>
        <path d="M3,38 L26,29"/>
      </g>
    </symbol>

    <!-- gạch chân nguệch tay, kéo giãn theo bề ngang chữ -->
    <symbol id="d-swoosh" viewBox="0 0 200 16" preserveAspectRatio="none">
      <g fill="none" stroke="currentColor" stroke-linecap="round">
        <path d="M4,10 C48,2 152,2 196,8" stroke-width="5"/>
        <path d="M14,14 C62,8 142,8 186,13" stroke-width="2.4" opacity="0.65"/>
      </g>
    </symbol>

    <!-- ngôi sao vẽ vội -->
    <symbol id="d-star" viewBox="0 0 40 40">
      <path d="M20,3 L24.5,15 L37,16.5 L27.5,25 L30.5,37.5 L20,30.5 L9.5,37.5 L12.5,25 L3,16.5 L15.5,15 Z"
            fill="none" stroke="currentColor" stroke-width="3"
            stroke-linejoin="round" stroke-linecap="round"/>
    </symbol>

    <!-- nét cuộn -->
    <symbol id="d-curl" viewBox="0 0 90 50">
      <path d="M4,12 C20,3 34,15 24,27 C16,37 6,31 12,21 C20,9 44,7 58,19 C70,29 78,39 86,45"
            fill="none" stroke="currentColor" stroke-width="3.4"
            stroke-linecap="round"/>
    </symbol>

    <!-- trái tim có đuôi kéo dài -->
    <symbol id="d-heart" viewBox="0 0 96 60">
      <g fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M30,45 C16,34 11,24 18,17 C24,11 30,17 30,23 C30,17 36,11 42,17 C49,24 44,34 30,45 Z"/>
        <path d="M33,43 C51,53 68,48 92,56"/>
      </g>
    </symbol>

    <!-- nhành hoa nhỏ -->
    <symbol id="d-sprig" viewBox="0 0 90 72">
      <g fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
        <path d="M6,68 C22,52 38,36 56,24"/>
        <path d="M28,50 C35,41 44,35 52,33"/>
        <path d="M40,38 C49,33 58,31 66,31"/>
        <path d="M17,57 C21,49 29,48 32,52 C28,58 20,61 17,57 Z"/>
        <path d="M34,44 C38,37 46,36 49,40 C45,46 37,48 34,44 Z"/>
      </g>
      <g fill="currentColor">
        <!-- ba bông: bốn cánh quanh một nhuỵ -->
        <circle cx="59" cy="17" r="3.2"/><circle cx="66" cy="21" r="3.2"/>
        <circle cx="59" cy="25" r="3.2"/><circle cx="52" cy="21" r="3.2"/>
        <circle cx="59" cy="21" r="1.7"/>

        <circle cx="73" cy="30" r="2.8"/><circle cx="79" cy="33" r="2.8"/>
        <circle cx="73" cy="37" r="2.8"/><circle cx="67" cy="33" r="2.8"/>
        <circle cx="73" cy="33" r="1.5"/>

        <circle cx="47" cy="27" r="2.4"/><circle cx="52" cy="30" r="2.4"/>
        <circle cx="47" cy="33" r="2.4"/><circle cx="42" cy="30" r="2.4"/>
        <circle cx="47" cy="30" r="1.3"/>
      </g>
    </symbol>

    <!-- tia sét -->
    <symbol id="d-bolt" viewBox="0 0 28 60">
      <path d="M14,3 L4,32 L13,30 L8,57 L24,26 L15,28 L22,3 Z"
            fill="none" stroke="currentColor" stroke-width="3"
            stroke-linejoin="round" stroke-linecap="round"/>
    </symbol>

    <!-- mũ cử nhân -->
    <symbol id="d-cap" viewBox="0 0 64 50">
      <path d="M32,4 L61,16 L32,28 L3,16 Z" fill="currentColor"/>
      <path d="M14,21 L14,33 C14,40 50,40 50,33 L50,21"
            fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M58,17 L58,33" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M58,33 L53.5,45 L62.5,45 Z" fill="currentColor"/>
    </symbol>

  </defs>
</svg>`;

  function inject() {
    if (document.getElementById('doodle-sprite')) return;
    const holder = document.createElement('div');
    holder.id = 'doodle-sprite';
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = SPRITE;
    document.body.insertBefore(holder, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
