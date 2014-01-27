import dbHandler
import hashlib, uuid

db = dbHandler.PostgresqlHandler()

def create_account_if_non_existant(username, password):
    '''
    Creates a new account if one doesn't already exist, storing the salt and salted password
    '''
    get_account_query = "SELECT COUNT(*) FROM accounts WHERE username = %s;"
    if db.get_rows(get_account_query, (username,))[0][0] > 0:
        return False

    create_account_query = "INSERT INTO accounts (username, passhash, salt) values (%s, %s, %s);"

    salt = uuid.uuid4().hex
    hashed_password = hashlib.sha512(password + salt).hexdigest()
    db.execute(create_account_query, (username, hashed_password, salt))
    
    return True
    