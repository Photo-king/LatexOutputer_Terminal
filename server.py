#!/usr/bin/env python3
"""A loopback-only Markdown and LaTeX reader; Python standard library only."""
import argparse
import hashlib
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import mimetypes

ROOT = Path(__file__).resolve().parent


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/api/content':
            try:
                source = self.server.content.read_text(encoding='utf-8')
            except (OSError, UnicodeError) as exc:
                self.send_error(503, 'Cannot read content.md')
                return
            body = json.dumps({'text': source, 'version': hashlib.sha256(source.encode()).hexdigest()}, ensure_ascii=False).encode()
            mime = 'application/json; charset=utf-8'
        else:
            relative = 'index.html' if path == '/' else path.lstrip('/')
            file = (ROOT / 'web' / relative).resolve()
            if not file.is_relative_to((ROOT / 'web').resolve()) or not file.is_file():
                self.send_error(404)
                return
            body = file.read_bytes()
            mime = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=5541)
    parser.add_argument('--content', type=Path, default=ROOT / 'content.md')
    args = parser.parse_args()
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError as exc:
        parser.exit(1, f'无法启动服务：{exc}\n可用 --port 5542 更换端口。\n')
    server.content = args.content.resolve()
    print(f'StudyView: http://127.0.0.1:{args.port}/\n内容文件: {server.content}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
