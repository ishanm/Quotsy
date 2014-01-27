import server
import dataMethods
import sessionHandler
import utils

@utils.json_response
def register(request):
    username = request.POST['username']
    password = request.POST['password']
    is_account_created = dataMethods.create_account_if_non_existant(username, password)
    
    if not is_account_created:
        return {
            'isSuccess': False,
            'errorMsg' : 'An account already exists with the given username. Please pick a new one and try again'
        }
    else:
        import pdb; pdb.set_trace()
        sessionManager = sessionHandler.SessionHandler()
        sid = sessionManager.create_session('isLoggedIn', True)
        
        return {
            'isSuccess': True,
            'sid' : sid
        }
    
server.add_view('/accounts/register', register)

server.serve()
