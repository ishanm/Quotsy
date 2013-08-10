from wsgiref.simple_server import make_server
from urlparse import parse_qs
from cgi import FieldStorage

class ServerException(Exception):
    def __init__(self, message):
        self.message = message
        
    def __str__(self):
        return self.message
    
class Request:
    def __init__(self, environ):
        self.environ = environ
        self.method = self.environ['REQUEST_METHOD'].upper()
        self.pathInfo = self.environ.get('PATH_INFO', '/')
        self.queryString = self.environ['QUERY_STRING']
        self._get = None
        self._post = None
        self._body = None

    @property
    def GET(self):
        """
        Parse the query string to create a dictionary for the GET parameters
        """
        # Don't check for method type here like we do in POST as it could be a
        # POST method and still have query parameters
        
        if self._get is None:
            self._get = parse_qs(self.queryString)
            # parse_qs returns the values in a list. If there's just one value
            # we don't need it in a list
            for key, val in self._get:
                if len(val) == 1:
                    self._get[key] = val[0]
        return self._get
    
    @property
    def POST(self):
        """
        Parse the body of the request to create a dictionary for POST data
        """
        
        if self.method != "POST":
            raise ServerException("Request method was not POST")

        self.POST = {}
        fs = FieldStorage(fp=self.environ['wsgi.input'], environ=self.environ)

        for key in fs.keys():
            val = fs[key]
            if type(val) == list:
                self.POST[key] = [i.value for i in val]
            else:
                self.POST[key] = val.value
        
        return self.POST
                    
    @property
    def body(self):
        """
        Returns the contents of the body of the request as a string
        """
        if 'CONTENT_LENGTH' not in self.environ or int(self.environ['CONTENT_LENGTH']) == 0:
            return ""
        
        return self.environ['wsgi.input'].read(int(self.environ['CONTENT_LENGTH']))
            
viewMap = {}

def addView(path, view):
    viewMap[path] = view
    
def getView(path):
    return viewMap[path]

def defaultApp(environ, start_response):
    start_response('200 OK', [('Content-type', 'text/html')])
    currentPath = environ['PATH_INFO']
    request = Request(environ)
    view = getView(currentPath)
    return view(request)

def serve(host='127.0.0.1', port=8080):
    httpd = make_server(host, port, defaultApp)
    print "Starting server on host %s, port %d" % (host, port)
    httpd.serve_forever()
