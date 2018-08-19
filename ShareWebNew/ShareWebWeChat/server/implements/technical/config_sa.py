import interfaces.technical.config

import zope.interface.declarations
import sqlalchemy
import sqlalchemy.exc
import sqlalchemy.ext.declarative
import sqlalchemy.orm


class _Config(sqlalchemy.ext.declarative.declarative_base()):
    """
    table for login
    """
    ''' table name '''
    __tablename__ = 'winter_config'
    ''' configuration key '''
    key = sqlalchemy.Column(sqlalchemy.String(64), nullable=False, primary_key=True)
    ''' configuration value '''
    value = sqlalchemy.Column(sqlalchemy.String(511), nullable=False)


@zope.interface.declarations.implementer(interfaces.technical.config.ICenter)
@zope.interface.declarations.provider(interfaces.technical.config.ICenterFactory)
class _Center(object):
    """
    class implements authentication center interface
    """
    
    def __init__(self, engine, cache):
        """ init all variables """
        ''' initialize configuration cache '''
        self.cache = cache
        ''' initialize Sqlalchemy session '''
        self.session = sqlalchemy.orm.scoped_session(
            sqlalchemy.orm.sessionmaker(bind=engine, autocommit=True))()
    
    def addConfig(self, key, value):
        self.session.begin(subtransactions=True)
        try:
            self.session.merge(_Config(key=key, value=value))
            self.session.commit()
            ''' store to cache '''
            self.cache[key] = value
            return True
        except sqlalchemy.exc.DatabaseError:
            self.session.rollback()
        return False

    def getConfig(self, key):
        try:
            ''' find in cache first '''
            return self.cache[key]
        except KeyError:
            pass
        val = self.session.query(_Config.value)\
            .filter(_Config.key == key).first()
        if val:
            ''' store to cache  '''
            self.cache[key] = val[0]
            return val[0]


class Factory(object):
    """
    factory of register center interface
    """

    def __init__(self, engine):
        self.cache = {}
        self.engine = engine
        _Config.metadata.create_all(engine)

    def __call__(self, bundle):
        """ create object provide interface """
        return _Center(self.engine, self.cache)
