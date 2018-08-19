import interfaces.extension.wechat
import implements.technical.sa_util
import wechat_api.api

import zope.interface.declarations
import sqlalchemy
import sqlalchemy.ext.declarative
import sqlalchemy.orm


@zope.interface.declarations.implementer(interfaces.extension.wechat.IMapping)
class _Binding(implements.technical.sa_util.Tables):
    """
    binding table (wechat openid to inner guid)
    """
    ''' database table name '''
    __tablename__ = 'winter_wechat_bind'
    ''' wechat openid '''
    openid = sqlalchemy.Column(sqlalchemy.String(64), primary_key=True)
    ''' guid used in anyshare '''
    id = sqlalchemy.Column(sqlalchemy.String(32))
    ''' bind status '''
    status = sqlalchemy.Column(sqlalchemy.Integer)

    def save(self):
        if self.openid is None:
            return False
        self.session.merge(self)
        return True


@zope.interface.declarations.implementer(interfaces.extension.wechat.ICenter)
@zope.interface.declarations.provider(interfaces.extension.wechat.ICenterFactory)
class _Center(object):
    """
    implement center interface
    """
    
    def __init__(self, session):
        self.session = session

    def addBind(self, openid, id, status):
        self.session.add(_Binding(openid=openid, id=id, status=status))
        return True

    def getBind(self, openid):
        query = self.session.query(_Binding)
        if openid:
            query = query.filter(_Binding.openid == openid)
        bi = query.first()
        return bi # and (bi.openid, bi.id, bi.status) or (None, None, None)

    def rmvBind(self, openid):
        return True if self.session.query(_Binding).filter(
            _Binding.openid == openid).delete() != 0 else False


@zope.interface.declarations.implementer(interfaces.extension.wechat.ICenterFactory)
class Factory(object):
    """
    implement center factory interface
    """
    def __init__(self, bundle_maker):
        """ initialize wechat api """
        config = bundle_maker.component.technical.config(bundle_maker())
        bundle_maker.dependent.wechat = implements.technical.Dummy()
        bundle_maker.dependent.wechat.engine = wechat_api.api.WeChatAPI(
            config.getConfig('wechat_appid') or "wxe931e43ea8295b5e",
            config.getConfig('wechat_appsecret') or "cf6555521019a15815091718978169c7",
            config.getConfig('wechat_token') or "ANYSHARE_WECHAT201501_TOKEN")
    
    def __call__(self, bundle):
        """ create wechat center """
        return _Center(bundle.dependent.sa.session)