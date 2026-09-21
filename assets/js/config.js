/* ============================================================
   SỬA MỌI THÔNG TIN Ở ĐÂY — không cần đụng vào file nào khác.

   Thiệp do Mai Hoa gửi bạn bè, nên mọi lời đều là lời Mai Hoa
   nói với các bạn: xưng "mình", gọi "bạn".
   ============================================================ */

window.INVITE = {

  /* --- Tên --- */
  shoutName: 'Mai Hoa',            // tên in to nhất ở trang bìa
  school:    'Trường Đại học Thủy lợi',

  /* --- Khung 1 trang trong: câu chuyện --- */
  storyTitle: 'Một chặng đường…',
  storyBody: [
    'Một chặng đường học tập sắp khép lại, để lại nhiều kỷ niệm, những lần cố gắng và cả những khoảnh khắc đáng nhớ.',
    'Giờ thì mình muốn chia sẻ khoảnh khắc này cùng bạn.',
  ],

  /* --- Khung cuối: hẹn gặp --- */
  closingTitle: 'Hẹn gặp bạn',
  closingLine:  'Cùng mình lưu giữ khoảnh khắc này nhé!',

  /* --- Thông tin buổi lễ --- */
  event: {
    title:    'Lễ Tốt Nghiệp',


    // Ngày giờ ISO. Dạng: YYYY-MM-DDTHH:MM:SS
    // Đây là nguồn duy nhất: lịch tháng, ngày khoanh tròn và đồng hồ
    // đếm ngược đều sinh ra từ dòng này.
    dateISO:  '2026-09-23T07:00:00',

    timeText: '7h:00 sáng',

    venue:      'Hội trường T45',
    venueAddr:  '175 Tây Sơn, Đống Đa, Hà Nội',
    mapUrl:     'https://maps.google.com/?q=Truong+Dai+hoc+Thuy+loi+175+Tay+Son+Ha+Noi',

    dressCode:  'Thoải mái, miễn là lên ảnh đẹp',
  },

  /* --- Ảnh --- *
     Ba tấm đầu tiên sẽ đứng dọc mép dưới trang bìa.

     photoStyle: 'print'  = ảnh chữ nhật, có viền trắng như ảnh rọi
                 'cutout' = ảnh ĐÃ TÁCH NỀN (file .png nền trong suốt)  */
  photoStyle: 'cutout',

  photos: [
    { src: 'photos/cut1.png' },
    { src: 'photos/cut2.png' },
    { src: 'photos/cut3.png' },
  ],

  /* --- Ảnh kỷ niệm ở khung "Một chặng đường" (trang trong) --- *
     Chép ảnh vào  photos/  rồi khai báo ở đây. Bỏ trống thì cả khung tự ẩn. */
  memories: [
    { src: 'photos/slide5img1.jpg' },
    { src: 'photos/slide5img2.jpg' },
    { src: 'photos/slide5img3.jpg' },
    { src: 'photos/slide5img4.jpg' },
    { src: 'photos/slide5img5.jpg' },
    { src: 'photos/slide5img6.jpg' },
  ],

  /* --- Ảnh lịch (trang 3 bản Canva) --- *
     Bỏ trống thì tự dựng lịch bằng HTML theo dateISO ở trên. */
  calImage: 'photos/slide3.png',

  /* --- Sơ đồ trường --- *
     Xuất trang 4 trong bản Canva ra ảnh PNG rồi để vào  photos/ .
     Bỏ trống thì khung sơ đồ chỉ hiện nút mở bản đồ. */
  mapImage: 'photos/slide4.png',

  /* --- Ảnh "một chặng đường" (trang 5 bản Canva) --- *
     Ảnh này có 6 ô còn TRỐNG (chưa dán ảnh thật trong Canva) nên để trống.
     Khi nào có ảnh kỷ niệm thật thì khai vào  memories  ở trên,
     không dùng field này — nó chỉ dành cho ảnh chụp nguyên trang. */
  storyImage: '',

  /* --- Nhạc nền --- *
     Chép file nhạc vào  assets/music/  rồi sửa đúng tên file ở dưới.
     Tên phân biệt hoa thường. Dùng được: .mp3 .m4a .ogg .wav
     Để '' (rỗng) nếu không muốn có nhạc — nút nhạc sẽ tự ẩn.

     Đang dùng bản nhạc hộp tự soạn. Thay bằng bài của bạn thì sửa dòng này,
     ví dụ:  musicSrc: 'assets/music/thanh-xuan.mp3',                        */
  musicSrc: 'assets/music/thanh-xuan.mp3',
};
