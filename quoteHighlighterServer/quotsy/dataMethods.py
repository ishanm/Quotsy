import dbHandler
import hashlib, uuid

db = dbHandler.PostgresqlHandler()

def create_account_if_non_existant(username, password):
    '''
    Creates a new account if one doesn't already exist, storing the salt and salted password hash
    '''
    get_account_query = "SELECT COUNT(*) FROM accounts WHERE username = %s;"
    if db.get_rows(get_account_query, (username,))[0][0] > 0:
        return False

    create_account_query = "INSERT INTO accounts (username, passhash, salt) values (%s, %s, %s);"

    salt = uuid.uuid4().hex
    hashed_password = hashlib.sha512(password + salt).hexdigest()
    db.execute(create_account_query, (username, hashed_password, salt))
    
    get_account_id_query = "SELECT id FROM accounts WHERE username = %s;"
    return db.get_rows(get_account_id_query, (username,))[0][0]
    

def authenticate_user(username, password):
    '''
    Checks if an account exists given a username and hashed password by hashing
    the input password with the salt in the db, and checking that against the hashed
    password in the db. Returns true if it does, else false
    '''
    get_account_query = "SELECT passhash, salt FROM accounts WHERE username = %s;"
    account = db.get_rows(get_account_query, (username,))
    
    if len(account) != 1:
        return False
    
    hashed_password, salt = account[0]
    
    if (hashlib.sha512(password + salt).hexdigest() != hashed_password):
        return False

    get_account_id_query = "SELECT id FROM accounts WHERE username = %s;"
    return db.get_rows(get_account_id_query, (username,))[0][0]    
    
def insert_quotes(account_id, quotes_to_add):
    '''
    Takes a list of quotes and an account_id and adds it to the quotes table
    associating them with the account
    '''
    insert_query = "INSERT INTO quotes (account_id, text, url) VALUES %s"
    
    with db.cursor() as cursor:
        values = ",".join(cursor.mogrify("(%s, %s, %s)", (account_id, quote['text'], quote['url'])) for quote in quotes_to_add)
    
    insert_query = insert_query % (values)
    row_count = db.execute(insert_query)
    return row_count

def get_all_quotes(account_id):
    get_all_quotes_query = "SELECT id, text, url FROM quotes where account_id = %s;"
    all_quotes = db.get_rows(get_all_quotes_query, (account_id,))
    
    return all_quotes

def update_quote(quote_id, quote_text):
    '''
    Called when a quote is edited in the manage quotes page. Updates the text of the quote
    '''
    update_query = "UPDATE quotes SET text = %s WHERE id = %s;"
    row_count = db.execute(update_query, (quote_text, quote_id))
    
def delete_quote(quote_id):
    delete_query = "DELETE FROM quotes WHERE id = %s;"
    row_count = db.execute(delete_query, (quote_id,))
    
def add_quote(account_id, quote_text, url):
    '''
    Called when a quote is added in the manage quotes page. Adds a single quote and
    returns the id of the quote.
    '''
    
    add_query = "INSERT INTO quotes (account_id, text, url) values (%s, %s, %s);"
    db.execute(add_query, (account_id, quote_text, url))
    
    get_account_id_query = "SELECT id FROM quotes WHERE account_id = %s AND text = %s"
    quote = db.get_rows(get_account_id_query, (account_id, quote_text))

    return quote[0][0]
    
    