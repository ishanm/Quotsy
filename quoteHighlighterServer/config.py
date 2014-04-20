config = {
    # This can either be a string representing a directory location or a list or
    # a list of directory locations
    'TEMPLATE_DIRS' : "/Users/ishanmandhan/quoteHighlighter/quoteHighlighterServer/templates",

    # The two options are 'Basic' and 'Jinja2'; Basic is a barebones
    # template engine that fills in a template with the dictionary provided, but does
    # not provide any of the other functionality template engines out there provide
    'TEMPLATE_RENDERER' : 'Basic',
    
    'DATABASE' : {
        'HOST' : 'localhost',
        'NAME' : 'quotsy',
        'USER_NAME' : 'postgres',
        'PASSWORD' : 'postgre'
    },
        
    'SESSION_DIR' : '/Users/ishanmandhan/quoteHighlighter/quoteHighlighterServer/quotsy/session',

    'LOGGING' : 
        {
            'version': 1,              
            'disable_existing_loggers': False,
            'formatters': {
                'standard': {
                    'format': '%(asctime)s [%(levelname)s] %(module)s: %(message)s'
                },
            },
            'handlers': {
                'default_file_handler': {
                    'level':'DEBUG',    
                    'class':'logging.handlers.RotatingFileHandler',
                    "filename": "/Users/ishanmandhan/quoteHighlighter/quoteHighlighterServer/quotsy/logs/info.log",
                    "maxBytes": "10485760",
                    "backupCount": "20",
                    "encoding": "utf8",
                    'formatter' : 'standard'
                }
            },
            'loggers': {
                '': {                  
                    'handlers': ['default_file_handler'],        
                    'level': 'DEBUG',  
                    'propagate': False
                }
            }
        }

}