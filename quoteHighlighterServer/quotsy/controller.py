import server
import dataMethods
import sessionHandler
import utils
import json

class QuotsyException(Exception):
    def __init__(self, message):
        self.message = message
        
    def __str__(self):
        return self.message

@utils.json_response
def register(request):
    username = request.POST['username']
    password = request.POST['password']
    account = dataMethods.create_account_if_non_existant(username, password)
    
    if not account:
        return {
            'isSuccess': False,
            'errorMsg' : 'An account already exists with the given username. Please pick a new one and try again.'
        }
    else:
        session_manager = sessionHandler.SessionHandler()
        sid = session_manager.create_session('isLoggedIn', True)
        session_manager.add_val(sid, 'account_id', account)
        
        return {
            'isSuccess': True,
            'sid' : sid
        }
    
@utils.json_response
def login(request):
    username = request.POST['username']
    password = request.POST['password']
    
    account = dataMethods.authenticate_user(username, password)
    
    if not account:
        return {
            'isSuccess': False,
            'errorMsg' : "Sorry, we weren't able to find an account with the given username and password. Please try again."
        }
    else:
        session_manager = sessionHandler.SessionHandler()
        sid = session_manager.create_session('isLoggedIn', True)
        session_manager.add_val(sid, 'account_id', account)
        
        return {
            'isSuccess': True,
            'sid' : sid
        }

@utils.json_response
def sync_quotes(request):
    import pdb; pdb.set_trace()
    sid = request.POST.get('sid')
    all_quotes = json.loads(request.POST.get('quotes'))
    
    if not sid:
        raise QuotsyException("Sync quotes can only be called with a valid session id")
    
    # Get the quotes that don't have an id, which means that they haven't been
    # backed up on the server as yet. So we can add those
    quotes_to_add = [quote for quote in all_quotes if 'id' not in quote]
    
    session_manager = sessionHandler.SessionHandler()
    account_id = session_manager.get_val(sid, 'account_id')
    
    if len(quotes_to_add) > 0:
        dataMethods.insert_quotes(account_id, quotes_to_add)
    
    all_quotes = dataMethods.get_all_quotes(account_id)
    return_val = [{'id':q[0], 'text':q[1], 'url':q[2], 'hash':q[3]} for q in all_quotes]
    print "The quotes being synced are " + str(return_val)

    return return_val

@utils.json_response
def update_quote(request):
    sid = request.POST.get('sid')
    quote_id = json.loads(request.POST.get('quote_id'))
    quote_text = request.POST.get('quote_text')
    quote_hash = request.POST.get('quote_hash')
    
    if not sid:
        raise QuotsyException("Sync quotes can only be called with a valid session id")
    
    dataMethods.update_quote(quote_id, quote_text, quote_hash)
    
@utils.json_response
def add_quote(request):
    sid = request.POST.get('sid')
    quote_text = request.POST.get('quote_text')
    quote_url = request.POST.get('quote_url', None)
    quote_hash = request.POST.get('quote_hash')
    
    session_manager = sessionHandler.SessionHandler()
    account_id = session_manager.get_val(sid, 'account_id')
    
    quote_id = dataMethods.add_quote(account_id, quote_text, quote_url, quote_hash)
    
    return {'quote_id' : quote_id}

@utils.json_response
def delete_quote(request):
    sid = request.POST.get('sid')
    quote_id = request.POST.get('quote_id')
    
    dataMethods.delete_quote(quote_id)

@utils.json_response
def logout(request):
    sid = request.POST.get('sid')
    
    session_manager = sessionHandler.SessionHandler()
    session_manager.delete_session_file(sid)
    

server.add_view('/accounts/register', register)
server.add_view('/accounts/login', login)
server.add_view('/accounts/logout', logout)
server.add_view('/quotes/sync', sync_quotes)
server.add_view('/quotes/add', add_quote)
server.add_view('/quotes/update', update_quote)
server.add_view('/quotes/delete', delete_quote)

server.serve()


