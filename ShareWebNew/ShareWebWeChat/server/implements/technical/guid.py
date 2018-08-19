import interfaces.technical.guid
import zope.interface.declarations
import uuid


@zope.interface.declarations.implementer(interfaces.technical.guid.ICenter)
@zope.interface.declarations.provider(interfaces.technical.guid.ICenterFactory)
class _Center(object):
    """
    implement of guid center interface
    """
    # for base64 encoding

    def gen(self, category):
        if not isinstance(category, (int, long)):
            try:
                category = int(category)
            except ValueError:
                ''' category can not convert to int '''
                return None
        ''' generate guid as a uuid '''
        uid = uuid.uuid4().int >> 16
        uid += (category << 112)
        return uuid.UUID(int=uid)\
            .bytes.encode('base64')\
            .rstrip('=\n').replace('/', '_')

    def category(self, guid):
        """ get category id from a guid """
        if not isinstance(guid, basestring):
            try:
                guid = str(guid)
            except ValueError:
                ''' guid can not convert to string '''
                return None
        try:
            guid += '=='
            guid = uuid.UUID(bytes=guid
                             .replace('_', '/')
                             .replace('-', '+')
                             .decode('base64'))
            cat = int(guid) >> 112
            return cat
        except ValueError:
            return None

"""
    def gen(self, category):
        if not isinstance(category, (int, long)):
            try:
                category = int(category)
            except ValueError:
                ''' category can not convert to int '''
                return None
        ''' generate guid as a uuid '''
        uid = uuid.uuid4().int >> 16
        uid += (category << 112)
        return hex(uid).replace('0x', '').replace('L', '')

    def category(self, guid):
        ''' get category id from a guid '''
        try:
            cat = int(guid, 16) >> 112
            return cat
        except ValueError:
            return None
"""


@zope.interface.declarations.implementer(interfaces.technical.guid.ICenterFactory)
class Factory(object):
    """
    implements of center factory interface
    """
    ''' singleton  '''
    center = _Center()

    def __call__(self, bundle):
        return self.center


