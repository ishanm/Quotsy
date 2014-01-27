from server import Response

import json

def json_response(func):
    '''
    Decorator to take the object returned by the decorated function
    and return a json/jsonp response
    '''
    def decorated_function(request):
        objects = func(request)
        response = Response()
        if 'callback' in request.GET:
            response.headers['Content-type'] = "text/javascript"
            response.body = '%s(%s);' % (request.GET['callback'], json.dumps(objects))
        else:
            response.headers['Content-type'] = "application/json"
            response.body = json.dumps(objects)
        return response
    
    return decorated_function