import interfaces.technical.token
import zope.interface.declarations

import sqlalchemy
import sqlalchemy.exc
import sqlalchemy.ext.declarative
import sqlalchemy.orm
import datetime


class _Token(sqlalchemy.ext.declarative.declarative_base()):
    """ token in database """
    ''' table name '''
    __tablename__ = 'winter_token'
    ''' token id  '''
    id = sqlalchemy.Column(sqlalchemy.String(32), unique=True, nullable=False, index=True)
    ''' token data  '''
    data = sqlalchemy.Column(sqlalchemy.String(32), primary_key=True, nullable=False)
    ''' expire time  '''
    expire = sqlalchemy.Column(sqlalchemy.DateTime, nullable=False, index=True)


@zope.interface.declarations.implementer(interfaces.technical.token.ICenter)
@zope.interface.declarations.provider(interfaces.technical.token.ICenterFactory)
class _Center(object):
    """
    implement of token center
    """

    def __init__(self, engine, guid):
        self.session = sqlalchemy.orm.scoped_session(
            sqlalchemy.orm.sessionmaker(bind=engine, autocommit=True))()
        self.guid = guid

    def addToken(self, content, timeout):
        if not isinstance(timeout, datetime.timedelta):
            return False
        token = _Token(id=self.guid.gen(0xFFFF),
                       data=content,
                       expire=datetime.datetime.now() + timeout)
        self.session.begin(subtransactions=True)
        try:
            self.session.merge(token)
            self.session.commit()
            return token.id
        except sqlalchemy.exc.DatabaseError:
            self.session.rollback()

    def rmvToken(self, tokenid):
        self.session.begin(subtransactions=True)
        try:
            ret = self.session.query(_Token).filter(
                _Token.id == tokenid).delete()
            self.session.commit()
            return ret != 0
        except sqlalchemy.exc.DatabaseError:
            self.session.rollback()
        return False

    def getToken(self, tokenid):
        token = self.session.query(_Token).filter(
            _Token.id == tokenid).first()
        if token is None:
            return
        currenttime = datetime.datetime.now()
        if token.expire > currenttime:
            return token.data
        ''' delete token if then '''
        self.session.begin(subtransactions=True)
        try:
            self.session.query(_Token).filter(
                _Token.expire < currenttime).delete()
            self.session.commit()
        except sqlalchemy.exc.DatabaseError:
            self.session.rollback()


@zope.interface.declarations.implementer(interfaces.technical.token.ICenterFactory)
class Factory(object):
    """
    implement of factories
    """

    def __init__(self, engine):
        self.engine = engine
        _Token.metadata.create_all(engine)

    def __call__(self, bundle):
        """  create and return token center """
        return _Center(self.engine, bundle.component.technical.guid(bundle))
