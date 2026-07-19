#!/usr/bin/env python3
"""
🧠 Simple Language Model - Local Development Server
For GitHub Pages, only static files (HTML/CSS/JS) are needed.
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run(port=8000):
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = HTTPServer(('localhost', port), CORSHandler)
    print(f"🧠 Language Model Server: http://localhost:{port}")
    print("📁 Static files served from:", os.getcwd())
    print("Press Ctrl+C to stop")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

if __name__ == '__main__':
    run()
