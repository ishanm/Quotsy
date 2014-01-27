import config
import exceptions
import shelve
import os
import hashlib
import contextlib
import time

class SessionHandler(object):
    def __init__(self):
        try:
            self.session_dir = config.config['SESSION_DIR']
        except KeyError:
            raise exceptions.ConfigException('SESSION_DIR')
        
    def get_val(self, sid, key):
        '''
        Given a key, returns the value in the session file
        '''
        with self._get_session(sid) as session:
            return session[key]
        
    def create_session(self, key, val):
        '''
        Creates a shelved file and adds the given key, val pair to it.
        Returns the session id
        '''
        hasher = hashlib.md5()
        hasher.update(repr(time.time()))
        sid = hasher.hexdigest()
        with self._get_session(sid) as session:
            session[key] = val
            return sid
    
    @contextlib.contextmanager
    def _get_session(self, sid):
        '''
        Creates a shelved file, which will have the key, value pairs for a session
        and returns the file
        '''
        try:
            shelved_file = shelve.open(os.path.join(self.session_dir, sid), writeback=True)
            yield shelved_file
        finally:
            shelved_file.close()