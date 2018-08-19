import interfaces.collect
import implements.technical.sa_util

import zope.interface.declarations
import sqlalchemy
import sqlalchemy.ext.declarative
import sqlalchemy.orm


@zope.interface.declarations.implementer(interfaces.collect.ICollect)
class _Collect(implements.technical.sa_util.Tables):
    """
    table for Collect
    """
    ''' database table name '''
    __tablename__ = 'winter_collect_info'
    ''' collect guid '''
    id = sqlalchemy.Column(sqlalchemy.String(32), primary_key=True)
    ''' guid of shop which the product belongs to '''
    user = sqlalchemy.Column(sqlalchemy.String(32), nullable=False, index=True)
    ''' file type '''
    type = sqlalchemy.Column(sqlalchemy.Integer, nullable=False, index=True)
    ''' file name '''
    name = sqlalchemy.Column(sqlalchemy.String(255), nullable=False, index=True)
    ''' collect time '''
    time = sqlalchemy.Column(sqlalchemy.DateTime, index=True)

    def __init__(self, session):
        self.session = session

    def load(self):
        """ load form database """
        if self.id is None:
            return False
        clt = self.session.query(_Collect).filter(
            _Collect.id == self.id).first()
        if clt is None:
            return False
        self.user = clt.user
        self.type = clt.type
        self.name = clt.name
        self.time = clt.time
        return True

    # def save(self):
    #     """ save to database """
    #     if self.id is None:
    #         return False
    #     self.session.merge(self)
    #     return True


@zope.interface.declarations.implementer(interfaces.collect.ICenter)
@zope.interface.declarations.provider(interfaces.collect.ICenterFactory)
class _Center(object):
    """
    class implement auth center interface
    """

    def __init__(self, session, guid):
        """ initialize sqlalchemy session """
        self.session = session
        self.guid = guid

    def genCollect(self):
        return _Collect(self.session)

    def addCollect(self, icollect):
        if icollect.id is None:
            icollect.id = self.guid.gen(0xf000)
        self.session.add(icollect)
        return True

    def rmvCollect(self, collectid):
        return True if self.session.query(_Collect).filter(
            _Collect.id == collectid).delete() != 0 else False

    def getCollect(self, collectid):
        clt = self.session.query(_Collect).filter(
            _Collect.id == collectid).first()
        if clt:
            clt.session = self.session
            return clt

    def getCollectByUser(self, userid):
        """ return a generator """
        session = self.session
        query = session.query(_Collect)\
            .filter(_Collect.user == userid)\
            .order_by(_Collect.user)

        def _generator():
            """ generator for page select """
            off = 0
            lmt = 10
            while True:
                res = query.offset(off).limit(lmt).all()
                off += lmt
                if not res:
                    return
                for clt in res:
                    clt.session = session
                    yield clt
        ''' return the generator '''
        return _generator()


@zope.interface.declarations.implementer(interfaces.collect.ICenterFactory)
class Factory(object):
    """
    factory of collect center interface
    """
    def __call__(self, bundle):
        """ create object provide interface """
        return _Center(bundle.dependent.sa.session,
                       bundle.component.technical.guid(bundle))