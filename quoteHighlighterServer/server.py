from wsgiref.simple_server import make_server
from requestResponse import Request, Response

import constants

class ServerException(Exception):
    def __init__(self, message):
        self.message = message
        
    def __str__(self):
        return self.message
    
viewMap = {}

def addView(path, view):
    viewMap[path] = view
    
def getView(path):
    return viewMap[path]

class DefaultApp():
    def __init__(self):
        self.request = None
        self.response = None
        
    def __call__(self, environ, start_response):
        self.request = Request(environ)

        currentPath = environ['PATH_INFO']
        view = getView(currentPath)
        try:
            self.response = view(self.request)
        except Exception:
            self.response = Response()
            self.response.status = 500
            self.response.headers['Content-Type'] = 'text/html'
            self.response.body = constants.ERROR_TEMPLATE
            
        if not self.response.status:
            self.response.status = 200
            
        status = "%d %s" % (self.response.status, constants.STATUS_CODES[self.response.status])
        start_response(status, self.response.combine_cookies_headers())
        return self.response.body



def serve(host='127.0.0.1', port=8080):
    httpd = make_server(host, port, DefaultApp())
    print "Starting server on host %s, port %d" % (host, port)
    httpd.serve_forever()
