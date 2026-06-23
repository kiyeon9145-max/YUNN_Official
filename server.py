#!/usr/bin/env python3
import http.server, functools

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    def log_message(self, *args):
        pass

if __name__ == '__main__':
    http.server.test(HandlerClass=NoCacheHandler, port=8124, bind='')
