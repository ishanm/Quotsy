import config
import exceptions
import shelve
import os
import hashlib
import contextlib
import time
import logging

logger = logging.getLogger(__name__)

class SessionHandler(object):
    def __init__(self):
        try:
            self.session_dir = config.config['SESSION_DIR']
        except KeyError:
            logger.error('The SESSION_DIR key is not set properly in the config file', exc_info=True)
            raise exceptions.ConfigException('SESSION_DIR')
        
    def get_val(self, sid, key):
        '''
        Given a key, returns the value in the session file
        '''
        with self._get_session(sid) as session:
            return session[key]
        
    def add_val(self, sid, key, val):
        '''
        Given a sid and key and val, adds it to the session file
        '''
        with self._get_session(sid) as session:
            session[key] = val
        
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
        
    def delete_session_file(self, sid):
        '''
        Given a sid, deletes the corresponding session file
        '''
        try:
            os.remove(os.path.join(self.session_dir, sid))
        except OSError:
            pass
    
    @contextlib.contextmanager
    def _get_session(self, sid):
        '''
        Creates a shelved file, which will have the key, value pairs for a session
        and returns the file
        '''
        try:
            shelved_file = shelve.open(os.path.join(self.session_dir, sid), writeback=True)
            yield shelved_file
        except:
            logger.error('An error occured while working with shelved file for sid %s', sid, exc_info=True)
            raise
        finally:
            shelved_file.close()
            
