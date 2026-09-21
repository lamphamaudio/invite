#!/usr/bin/env python3
"""
Máy chủ xem thử tại chỗ.

Khác bản `python3 -m http.server` mặc định ở hai điểm:
  - KHÔNG liệt kê thư mục. Mặc định thì gõ /photos/ là thấy danh sách
    file thô, gửi link cho người khác trông rất luộm thuộm.
  - Không phục vụ file ẩn (.hallmark, .git…) và file mã nguồn (.py).

Chạy:  python3 serve.py [cổng]
"""

import os
import sys
import http.server
import socketserver

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

BLOCKED_SUFFIX = ('.py',)
BLOCKED_DIRS = ('.hallmark', '.git')


class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        # xem thử tại chỗ: luôn tải lại, khỏi dính bản cũ trong bộ nhớ đệm
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def list_directory(self, path):
        """Thư mục không có index.html thì coi như không tồn tại."""
        self.send_error(404, 'Not Found')
        return None

    def send_head(self):
        parts = [p for p in self.path.split('?')[0].split('/') if p]

        if any(p.startswith('.') for p in parts) \
           or any(p in BLOCKED_DIRS for p in parts) \
           or self.path.endswith(BLOCKED_SUFFIX):
            self.send_error(404, 'Not Found')
            return None

        return super().send_head()

    def log_message(self, fmt, *args):
        # bớt ồn: chỉ ghi lỗi
        if args and str(args[1]).startswith(('4', '5')):
            super().log_message(fmt, *args)


socketserver.TCPServer.allow_reuse_address = True

with socketserver.ThreadingTCPServer(('', PORT), Handler) as httpd:
    print('Thiệp đang chạy tại  http://localhost:%d' % PORT)
    print('Bấm Ctrl+C để dừng.')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nĐã dừng.')
