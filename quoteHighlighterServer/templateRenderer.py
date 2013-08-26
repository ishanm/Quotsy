from config import config
from jinja2 import Environment, FileSystemLoader, TemplateNotFound as JinjaTemplateNotFound

import sys
import inspect
import os.path

renderer = None

def getRenderedTemplate(templateName, context):
    global renderer
    if not renderer:
        templateRenderer = config.get('TEMPLATE_RENDERER', 'Basic').title()
        for name, obj in inspect.getmembers(sys.modules[__name__]):
            if inspect.isclass(obj) and name == templateRenderer:
                renderer = obj()
                break
    
    return renderer.render(templateName, context)

class BaseRenderer(object):
    def __init__(self):
        self.templatesDir = config['TEMPLATE_DIRS']
        
    def render(self, templateName, context):
        self._loadTemplate(templateName)
        result = self._renderTemplate(context)
        return result
    
    def _loadTemplate(self, templateName):
        raise NotImplementedError
    
    def _renderTemplate(self, context):
        raise NotImplementedError

class Basic(BaseRenderer):
    def _loadTemplate(self, templateName):
        pass
    
    def _renderTemplate(self, context):
        pass
    
class Jinja2(BaseRenderer):
    def __init__(self):
        super(Jinja2, self).__init__()
        self.environment = Environment(loader = FileSystemLoader(self.templatesDir))
        
    def _loadTemplate(self, templateName):
        try:
            self.template = self.environment.get_template(templateName)
        except JinjaTemplateNotFound, e:
            raise TemplateNotFound(e.name)
        
    def _renderTemplate(self, context):
        return self.template.render(**context).encode('utf-8')

# -----------------------------------
# Exceptions 
# -----------------------------------

class TemplateNotFound(Exception):
    def __init__(self, templateName):
        self.templateName = templateName
        
    def __str__(self):
        return "Template %s was not found" % self.templateName
    
class TemplateException(Exception):
    def __init__(self, message):
        self.message = message
        
    def __str__(self):
        return self.message