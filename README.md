# Thiệp mời tốt nghiệp — Mai Hoa

Thiệp hai trang **Mai Hoa gửi bạn bè**. Phong cách giấy nhàu / sticker: nền trắng ngà,
chữ in hoa đậm đỏ booc-đô có bóng lệch kiểu in lụa, hoạ tiết vẽ tay, băng dính và
mảnh giấy xé ở góc.

Mọi lời trong thiệp là **lời Mai Hoa nói với các bạn** — xưng "mình", gọi "bạn".

```
index.html      ← Trang 1: tiêu đề lớn + 3 ảnh, bấm "Mở thiệp"
invite.html     ← Trang 2: câu chuyện · thông tin · hẹn gặp
assets/
  css/tokens.css    ← bảng màu, cỡ chữ, khoảng cách, vân giấy
  css/base.css      ← toàn bộ giao diện
  js/config.js      ← ★ SỬA MỌI NỘI DUNG Ở ĐÂY
  js/doodles.js     ← bộ hoạ tiết vẽ tay (SVG)
  js/audio.js       ← nhạc nền
  js/page-home.js · js/page-invite.js
  music/            ← nhạc nền (đã có sẵn một bản)
photos/             ← ảnh + script tách nền
```

## 1. Sửa nội dung

Mở `assets/js/config.js`. Tên, ngày giờ, địa điểm, các dòng chữ, danh sách ảnh —
tất cả nằm ở đó, không cần đụng file nào khác.

`dateISO` phải đúng dạng `YYYY-MM-DDTHH:MM:SS` — đồng hồ đếm ngược lấy số từ dòng này.

**Bốn chỗ vẫn đang là tôi đoán, kiểm lại giúp:** `degree` (đang để "Kỹ sư"),
`timeText` (giờ lễ), `venue` (đang để "Hội trường Lớn"), `dressCode`.

Phần chữ (`storyBody`, `closingLine`…) nên để Mai Hoa đọc lại và sửa theo cách
cô ấy hay nhắn bạn bè.

## 2. Ảnh

Ba tấm ảnh **đã tách nền**, đứng dọc mép dưới trang bìa, vươn lên chồng vào chân
tiêu đề. Trang trong chỉ còn thông tin, không có ảnh nào.

```js
photoStyle: 'cutout',
photos: [
  { src: 'photos/cut1.png' },
  { src: 'photos/cut2.png' },
  { src: 'photos/cut3.png' },
],
```

Chỉ **ba tấm đầu tiên** được dùng. Tấm ở giữa được cho cao hơn hai tấm bên.

### Ảnh tách nền phải là PNG có kênh trong suốt

Ba file `im1`, `im2.png`, `im3.png` bạn tải về tuy đã tách nền nhưng bị lưu
**đè lên nền trắng đặc** — mở ra vẫn thấy hình chữ nhật trắng.

Script `photos/tach-nen.py` trả lại nền trong suốt: nó loang từ mép ảnh vào,
chỉ xoá vùng trắng nối liền ra được bên ngoài. Nhờ vậy mảng trắng nằm gọn bên
trong người — gối, ly nước, áo sáng — vẫn giữ nguyên. Nếu xoá theo kiểu "cứ
trắng là xoá" thì người sẽ thủng lỗ chỗ.

Có ảnh mới thì chép vào `photos/`, sửa danh sách `VIEC` ở đầu script rồi chạy:

```bash
cd photos && python3 tach-nen.py
```

Ảnh gốc còn sẵn quầng sáng mềm quanh người. Trên nền giấy nó thành bóng đổ nhẹ,
nhìn khá hợp. Muốn ăn sâu hơn thì tăng `MinFilter(5)` thành `MinFilter(7)` trong
script — nhưng cẩn thận, ăn sâu quá là mất viền tóc.

### Muốn quay về ảnh chữ nhật

Đổi `photoStyle: 'print'` và trỏ `photos` sang file `.jpg`. Khi đó ảnh hiện dạng
ảnh rọi có viền trắng, hơi nghiêng, và **không** chồng lên tiêu đề — vì một khối
chữ nhật đè lên chữ thì trông như lỗi.

## 3. Nhạc

Đang dùng bản tạm: `assets/music/nhac-nen.wav` — đoạn hộp nhạc 21,8 giây do tôi
tự soạn (mã nguồn ở `assets/music/soan-nhac.py`).

**Thay bằng bài của bạn:**

1. Chép file vào `assets/music/`
2. Sửa dòng `musicSrc` trong `assets/js/config.js` cho khớp **đúng tên file**:

```js
musicSrc: 'assets/music/thanh-xuan.mp3',
```

3. Xoá `nhac-nen.wav` đi nếu không dùng nữa, đỡ nặng 940 KB

Tên file phân biệt hoa thường. Dùng được `.mp3` `.m4a` `.ogg` `.wav` — `.mp3`
là chắc ăn nhất, máy nào cũng phát được.

Gõ sai tên thì nút nhạc sẽ biến mất. Mở Console của trình duyệt (F12) sẽ thấy
dòng cảnh báo chỉ rõ sai ở đâu.

**Nên nén xuống dưới 4 MB.** Bạn bè Mai Hoa mở bằng 4G, file 10 MB là chờ mệt.
Nếu chỉ muốn lấy một đoạn hay nhất thì cắt khoảng 60–90 giây là vừa, vì nhạc
được đặt lặp vô hạn.

Vài điều nên biết:

- **Trình duyệt luôn chặn nhạc tự phát.** Người xem phải bấm nút góc dưới bên
  phải. Không lách được, đây là quy định của trình duyệt.
- Bấm lần nữa là tắt. Nhạc vào êm 1,4 giây, tắt trong 0,26 giây.
- **Nhạc chạy tiếp sang trang 2** đúng chỗ đang dở.

**Về bản quyền:** thiệp sẽ nằm trên một địa chỉ công khai ai có link cũng mở được.
Nhạc thương mại đưa lên đó là phát hành lại không phép. Muốn chắc chắn hợp lệ thì
nhúng trình phát YouTube chính chủ, hoặc chỉ để một đường dẫn sang bài hát. Bảo
tôi một tiếng là tôi làm.

## 4. Xem thử

Mở thẳng `index.html` bằng trình duyệt là chạy. Hoặc:

```bash
cd /home/lampt14/Documents/invite
python3 -m http.server 8000
```

## 5. Gửi đi

Kéo cả thư mục thả vào https://app.netlify.com/drop — vài giây là có link.

## Ghi chú thiết kế

**Nguồn tham khảo.** Bố cục, bảng màu và cách xếp chữ học từ ảnh thiết kế bạn gửi:
giấy trắng ngà vân nhàu, đỏ booc-đô + đen than, chữ in hoa đậm, hoạ tiết vẽ tay,
băng dính và giấy xé ở góc.

**Hình ảnh thì không lấy.** Toàn bộ hoạ tiết ở đây là SVG tự dựng trong
`assets/js/doodles.js`: tia nắng, gạch chân nguệch, ngôi sao, nét cuộn, trái tim
có đuôi, tia sét, nhành hoa, mũ cử nhân. Vân giấy nhàu cũng sinh bằng bộ lọc SVG
(`--paper-texture` trong `tokens.css`), không phải ảnh chụp giấy.

**Màu** khai báo bằng OKLCH trong `tokens.css`, không có mã màu thô nào rải rác
trong `base.css` — đổi tông chỉ sửa một chỗ.

**Ba bộ chữ**, đều đủ dấu tiếng Việt:

- **Playfair Display 900** — dòng "Lễ Tốt Nghiệp", serif có chân, bóng đổ đen
- **Anton** — các dòng in hoa đậm khác
- **Be Vietnam Pro** — chữ thân

Lưu ý về dấu tiếng Việt: dấu xếp hai tầng (LỄ, Ệ, Ố) chiếm chỗ cao hơn hẳn tiếng
Anh. `line-height` của dòng tiêu đề phải để **1.32** với Playfair và **1.26** với
Anton; hạ xuống dưới 1.1 là dấu đâm lên đè vào dòng trên.

Đã thử và loại: Noto Serif Display (nét quá mảnh), Bitter, Source Serif 4,
Roboto Slab. Muốn đổi thì sửa `--font-hero` trong `tokens.css`.

**Chỉnh hoạ tiết:** vị trí và cỡ nằm ở các lớp `.doodle--*` trong `base.css`.
Muốn bỏ bớt thì xoá thẻ `<svg class="doodle ...">` tương ứng trong file HTML.

Máy nào bật "giảm chuyển động" trong cài đặt hệ thống thì mọi hoạt ảnh tự tắt.
