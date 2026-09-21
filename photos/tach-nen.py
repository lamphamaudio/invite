#!/usr/bin/env python3
"""
Trả lại nền trong suốt cho ảnh đã tách nền nhưng bị lưu đè lên nền trắng.

Cách làm: loang (flood fill) từ MÉP ảnh vào trong, chỉ xoá những pixel
gần trắng nối liền được ra tới mép. Nhờ vậy các mảng trắng nằm gọn bên
trong người — gối, áo sáng, ly nước — vẫn được giữ nguyên.

Nếu xoá theo kiểu "cứ trắng là xoá" thì sẽ thủng lỗ chỗ khắp người.

Chạy:  python3 tach-nen.py
"""

from collections import deque
from PIL import Image, ImageFilter

# pixel sáng hơn mức này, và nối được ra mép, thì coi là nền
NGUONG = 246

VIEC = [
    ('im1',      'cut1.png'),
    ('im2.png',  'cut2.png'),
    ('im3.png',  'cut3.png'),
]


def tach(nguon, dich):
    im = Image.open(nguon).convert('RGB')
    w, h = im.size
    px = im.load()

    la_nen = bytearray(w * h)          # 1 = nền
    q = deque()

    def xet(x, y):
        i = y * w + x
        if la_nen[i]:
            return
        r, g, b = px[x, y]
        if r >= NGUONG and g >= NGUONG and b >= NGUONG:
            la_nen[i] = 1
            q.append((x, y))

    for x in range(w):
        xet(x, 0)
        xet(x, h - 1)
    for y in range(h):
        xet(0, y)
        xet(w - 1, y)

    while q:
        x, y = q.popleft()
        if x > 0:     xet(x - 1, y)
        if x < w - 1: xet(x + 1, y)
        if y > 0:     xet(x, y - 1)
        if y < h - 1: xet(x, y + 1)

    alpha = Image.frombytes('L', (w, h),
                            bytes(0 if v else 255 for v in la_nen))

    # Ảnh gốc có sẵn quầng sáng mềm quanh người. Trên nền giấy có vân của
    # thiệp thì quầng đó vẫn lộ thành một đường viền sáng. Co mặt nạ 2 pixel
    # ăn được phần lớn quầng mà chưa đụng tới viền tóc.
    alpha = alpha.filter(ImageFilter.MinFilter(5))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))

    out = im.convert('RGBA')
    out.putalpha(alpha)
    out.save(dich, optimize=True)

    trong = sum(1 for v in la_nen if v)
    return w, h, 100.0 * trong / (w * h)


for nguon, dich in VIEC:
    w, h, pct = tach(nguon, dich)
    print('%-9s → %-10s %dx%d · đã xoá %.1f%% làm nền' % (nguon, dich, w, h, pct))
