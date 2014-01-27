class ServerException(Exception):
    def __init__(self, message):
        self.message = message
        
    def __str__(self):
        return self.message
    
class ConfigException(Exception):
    def __init__(self, key):
        self.message = "There was an error in the '%s' section of your \
            config file. Please fix the config error and try again." % (key)
        
    def __str__(self):
        return self.message