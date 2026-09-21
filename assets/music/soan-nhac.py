#!/usr/bin/env python3
"""
Soạn và tổng hợp một đoạn nhạc hộp (music box) lặp liền mạch.
Chỉ dùng thư viện chuẩn: math + wave + array.

Ba bè:
  - hộp nhạc: arpeggio, âm chuông tắt nhanh
  - đệm dây:  hợp âm giữ dài, vào êm
  - bass:     một nốt mỗi ô nhịp

Để lặp không bị cụt đuôi vang, ta dựng HAI lượt liên tiếp rồi chỉ
lấy lượt thứ hai — đuôi vang của lượt một đã tràn sẵn vào đầu lượt hai.
"""

import math
import wave
import array

SR      = 22050          # đủ cho tiếng hộp nhạc, file nhẹ hơn một nửa
BPM     = 88
BEATS   = 4
BAR     = 60.0 / BPM * BEATS
BARS    = 8
LOOP    = BAR * BARS

def midi(n):
    return 440.0 * (2.0 ** ((n - 69) / 12.0))

# --- vòng hoà thanh: C – G/B – Am – F – C – G/B – F – G ------------------

ARP = [
    [72, 76, 79, 84],
    [71, 74, 79, 83],
    [69, 72, 76, 81],
    [65, 69, 72, 77],
    [72, 76, 79, 84],
    [71, 74, 79, 83],
    [65, 69, 72, 77],
    [67, 71, 74, 79],
]

PAD = [
    [60, 64, 67], [59, 62, 67], [57, 60, 64], [53, 57, 60],
    [60, 64, 67], [59, 62, 67], [53, 57, 60], [55, 59, 62],
]

BASS = [48, 47, 45, 41, 48, 47, 41, 43]

# thứ tự bấm trong một ô nhịp (8 nốt móc đơn)
PATTERN = [0, 1, 2, 3, 2, 3, 1, 2]

N = int(LOOP * SR)
buf = [0.0] * (N * 2 + int(SR * 3))   # hai lượt + chỗ cho đuôi vang


def add_bell(start, freq, gain, tau0):
    """Tiếng chuông: các bồi âm lệch quãng, bồi cao tắt nhanh hơn."""
    partials = ((1.0, 1.00), (2.0, 0.46), (3.0, 0.24), (4.16, 0.11), (5.43, 0.06))
    i0 = int(start * SR)
    dur = min(tau0 * 4.5, 2.6)
    n = int(dur * SR)
    if i0 + n > len(buf):
        n = len(buf) - i0
    for ratio, amp in partials:
        w = 2.0 * math.pi * freq * ratio / SR
        tau = tau0 / (1.0 + 0.75 * (ratio - 1.0))
        dec = math.exp(-1.0 / (tau * SR))
        a = gain * amp
        ph = 0.0
        for k in range(n):
            buf[i0 + k] += a * math.sin(ph)
            ph += w
            a *= dec


def add_pad(start, freq, gain, dur):
    """Bè đệm: sóng mềm, vào êm ra êm."""
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(buf):
        n = len(buf) - i0
    atk = int(0.45 * SR)
    rel = int(0.75 * SR)
    # hai bản lệch nhau vài cent cho dày tiếng
    for det in (0.9985, 1.0015):
        w1 = 2.0 * math.pi * freq * det / SR
        w2 = w1 * 2.0
        w3 = w1 * 3.0
        p1 = p2 = p3 = 0.0
        for k in range(n):
            if k < atk:
                env = k / atk
            elif k > n - rel:
                env = (n - k) / rel
            else:
                env = 1.0
            buf[i0 + k] += gain * env * (
                math.sin(p1) + 0.26 * math.sin(p2) + 0.10 * math.sin(p3)
            )
            p1 += w1
            p2 += w2
            p3 += w3


def add_bass(start, freq, gain, dur):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(buf):
        n = len(buf) - i0
    w = 2.0 * math.pi * freq / SR
    atk = int(0.02 * SR)
    tau = 1.5
    dec = math.exp(-1.0 / (tau * SR))
    a = gain
    ph = 0.0
    for k in range(n):
        env = (k / atk) if k < atk else 1.0
        buf[i0 + k] += a * env * (math.sin(ph) + 0.18 * math.sin(ph * 2))
        ph += w
        a *= dec


# --- dựng hai lượt --------------------------------------------------------

for rep in range(2):
    base = rep * LOOP
    for b in range(BARS):
        t0 = base + b * BAR

        add_bass(t0, midi(BASS[b]), 0.30, BAR * 1.05)

        for note in PAD[b]:
            add_pad(t0, midi(note), 0.065, BAR + 0.55)

        eighth = BAR / 8.0
        for i, idx in enumerate(PATTERN):
            t = t0 + i * eighth
            note = ARP[b][idx]
            # nhấn nhẹ vào phách mạnh
            g = 0.30 if i in (0, 4) else 0.21
            add_bell(t, midi(note), g, 0.85)

        # một tiếng chuông cao điểm xuyết ở đầu ô nhịp chẵn
        if b % 2 == 0:
            add_bell(t0, midi(ARP[b][3] + 12), 0.10, 1.25)

# --- tiếng vang: hai lớp vọng, lớp sau tối hơn ---------------------------

def echo(sig, delay_s, fb, mix, damp):
    d = int(delay_s * SR)
    out = list(sig)
    lp = 0.0
    for i in range(d, len(out)):
        lp += damp * (out[i - d] - lp)      # lọc bớt tiếng cao ở đuôi vang
        out[i] += mix * lp
        out[i - d] += 0.0
    # hồi tiếp nhẹ cho đuôi dài thêm
    for i in range(d, len(out)):
        out[i] += fb * out[i - d] * 0.35
    return out

buf = echo(buf, 0.285, 0.22, 0.30, 0.45)
buf = echo(buf, 0.61, 0.12, 0.16, 0.30)

# --- lấy lượt thứ hai, nối vòng cho mượt ---------------------------------

seg = buf[N:N * 2]

# hoà tiếng vài mili giây ở chỗ nối để không nghe tiếng "tách"
xf = int(0.012 * SR)
tail = buf[N * 2:N * 2 + xf]
for i in range(min(xf, len(tail))):
    w = i / xf
    seg[i] = seg[i] * w + tail[i] * (1 - w)

# --- chuẩn hoá và làm mềm đỉnh -------------------------------------------

peak = max(abs(s) for s in seg) or 1.0
norm = 0.82 / peak

out = array.array('h')
for s in seg:
    v = s * norm
    v = math.tanh(v * 1.12) * 0.92        # bo đỉnh cho khỏi vỡ tiếng
    out.append(int(max(-1.0, min(1.0, v)) * 32767))

path = '/home/lampt14/Documents/invite/assets/music/nhac-nen.wav'
with wave.open(path, 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(out.tobytes())

print('đã ghi %s — %.1f giây, %.0f KB' % (path, len(seg) / SR, len(out) * 2 / 1024))
