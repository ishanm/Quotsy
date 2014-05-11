from wsgiref.simple_server import make_server
from requestResponse import Request, Response

import exception
import constants
import logging
import logging.config
import config

logger = logging.getLogger(__name__)
logging.config.dictConfig(config.config['LOGGING'])
    
# -----------------------------------
# Views 
# -----------------------------------

viewMap = {}

def add_view(path, view):
    path = path.rstrip('/')
    viewMap[path] = view
    
def get_view(path):
    path = path.rstrip('/')
    try:
        view = viewMap[path]
    except KeyError:
        logger.error('No view exists mapped to the path %s', path)
        raise exception.ServerException('No view exists mapped to the path %s' % path)
    return view

# -----------------------------------
# Default app
# -----------------------------------

class DefaultApp():
    def __init__(self):
        self.request = None
        self.response = None
        
    def __call__(self, environ, start_response):
        self.request = Request(environ)

        currentPath = environ['PATH_INFO']
        view = get_view(currentPath)
        try:
            self.response = view(self.request)
        except Exception:
            logger.error("An error was caught in the global error handler", exc_info=True)
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
