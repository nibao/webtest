import interfaces.user
import implements.technical.sa_util

import zope.interface.declarations
import sqlalchemy
import sqlalchemy.ext.declarative
import sqlalchemy.orm


@zope.interface.declarations.implementer(interfaces.user.IAnyShare)
class _AnyShare(implements.technical.sa_util.Tables):
    """
    table for user anyshare information
    """
    ''' table name '''
    __tablename__ = "winter_user_anyshare"
    ''' user id '''
    id = sqlalchemy.Column(sqlalchemy.String(32), primary_key=True)
    ''' user anyshare account'''
    account = sqlalchemy.Column(sqlalchemy.String(128))
    '''user anyshare password '''
    password = sqlalchemy.Column(sqlalchemy.String(64))
    ''' user anyshare server address'''
    server_addr = sqlalchemy.Column(sqlalchemy.String(128))
    ''' user anyshare server right port'''
    right_port = sqlalchemy.Column(sqlalchemy.Integer)
    ''' user anyshare server file port'''
    file_port = sqlalchemy.Column(sqlalchemy.Integer)


@zope.interface.declarations.implementer(interfaces.user.IUser)
class _User(implements.technical.sa_util.Tables):
    """
    table for user
    """
    ''' table name '''
    __tablename__ = 'winter_user_info'
    ''' user id '''
    id = sqlalchemy.Column(sqlalchemy.String(32), primary_key=True)
    ''' user nickname '''
    nickname = sqlalchemy.Column(sqlalchemy.String(64))
    ''' user cellphone'''
    cellphone = sqlalchemy.Column(sqlalchemy.String(16))
    ''' user email '''
    email = sqlalchemy.Column(sqlalchemy.String(255))
    ''' user anyshare info should be instance of _AnyShare() '''
    anyshare = None

    def __init__(self, session):
        """ initialize session """
        self.session = session

    def loadAnyShare(self):
        if self.id is None:
            return False
        self.anyshare = self.session.query(_AnyShare).filter(
            _AnyShare.id == self.id).first()
        return False if self.anyshare is None else True

    def saveAnyShare(self):
        if (self.id is None) or (self.anyshare is None):
            return False
        ''' ensure anyshare information and information get the same id '''
        self.anyshare.id = self.id
        self.session.merge(self.anyshare)
        return True

    def load(self):
        if self.id is None:
            return False
        user = self.session.query(_User).filter(
            _User.id == self.id).first()
        if user is None:
            return False
        ''' save variables '''
        self.nickname = user.nickname
        self.cellphone = user.cellphone
        self.email = user.email
        return True

    def save(self):
        if self.id is None:
            return False
        self.session.merge(self)
        return True


@zope.interface.declarations.implementer(interfaces.user.ICenter)
@zope.interface.declarations.provider(interfaces.user.ICenterFactory)
class _Center(object):
    """
    class implement center interface
    """

    def __init__(self, session, guid):
        #initialize sqlalchemy session
        self.session = session
        self.guid = guid
    
    def genUser(self):
        return _User(self.session)

    def addUser(self, iuser):
        if iuser.id is None:
            iuser.id = self.guid.gen(0x0000)
        if iuser.anyshare is None:
            iuser.anyshare = _AnyShare()
        ''' ensure anyshare info and information get the same id '''
        iuser.anyshare.id = iuser.id
        self.session.add(iuser)
        self.session.add(iuser.anyshare)
        return True

    def getUser(self, userid):
        user = self.session.query(_User).filter(
            _User.id == userid).first()
        if user:
            user.session = self.session
            return user

    def rmvUser(self, userid):
        if self.session.query(_User).filter(
                _User.id == userid).delete() != 0:
            self.session.query(_AnyShare).filter(
                _AnyShare.id == userid).delete()
            return True
        return False


@zope.interface.declarations.implementer(interfaces.user.ICenterFactory)
class Factory(object):
    """
    factory of user center interface
    """
    def __call__(self, bundle):
        """ create object provide interface """
        return _Center(bundle.dependent.sa.session,
                       bundle.component.technical.guid(bundle))