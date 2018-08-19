import zope.interface


#class IMapping(zope.interface.Interface):
#    """
#    mapping between wechat platform and anyshare
#    """

#    id = zope.interface.Attribute("guid used in anyshare system")
#    """
#    guid used in our system
#    """

#    openid = zope.interface.Attribute("wechat openid of anyshare wechat users")
#    """
#    wechat openid of anyshare wechat users
#    """
class IMapping(zope.interface.Interface):
    def save(self):
        """
        save user information
        """


class ICenter(zope.interface.Interface):
    """
    center interface
    """

    def addBind(openid, id):
        """
        add mapping
        """

    def rmvBind(openid):
        """
        remove mapping
        """

    def getBind(openid):
        """
        get id by openid
        """


class ICenterFactory(zope.interface.Interface):
    """
    center interface factory
    """
    
    def __call__(bundle):
        """
        create an object which provide center interface
        """
