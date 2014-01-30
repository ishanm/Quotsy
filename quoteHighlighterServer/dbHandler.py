import config
import psycopg2
import contextlib
import exceptions

class DbException(Exception):
    def __init__(self, msg):
        self.msg = msg
        
    def __str__(self):
        return self.msg
    
class PostgresqlHandler(object):
    '''
    Postgresql connection handler. Will abstract out db handlers
    on adding other databases support in the future
    '''
    def __init__(self):
        try:
            db_settings = config.config['DATABASE']
            self.host = db_settings['HOST']
            self.db_name = db_settings['NAME']
            self.user_name = db_settings['USER_NAME']
            self.password = db_settings['PASSWORD']
        except KeyError:
            raise exceptions.ConfigException('DATABASE')

        self.connection = None
        
    def _get_connection(self):
        try:
            self.connection = psycopg2.connect("dbname='%s' user='%s' host='%s' password='%s'" % (self.db_name, self.user_name, self.host, self.password))
        except psycopg2.DatabaseError, e:
            raise DbException(e)
        
    def _rollback(self):
        try:
            self.connection.rollback()
        except:
            raise DbException("There was an error rolling back the transcation.")
        
    @contextlib.contextmanager
    def cursor(self):
        if not self.connection or self.connection.closed:
            self._get_connection()
        
        try:
            yield self.connection.cursor()
        except Exception, e:
            print e
            if not self.connection.closed:
                self._rollback()
            raise DbException("There was an error running the query.")
        finally:
            if self.connection.closed:
                raise DbException("Cannot commit because the db connection is closed")
            self.connection.commit()
            
    def get_rows(self, query, *args, **kwargs):
        '''
        Runs the given query and returns the result rows as a list of tuples
        '''
        with self.cursor() as cursor:
            cursor.execute(query, *args, **kwargs)
            return cursor.fetchall()
        
    def execute(self, query, *args, **kwargs):
        '''
        Exceutes the given query and returns the number of rows inserted/updated
        '''
        with self.cursor() as cursor:
            cursor.execute(query, *args, **kwargs)
            return cursor.rowcount
        
