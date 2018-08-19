import zope.interface


class IAnyShare(zope.interface.Interface):
    """
    user anyshare information
    """

    account = zope.interface.Attribute("user's account of anyshare")
    """
    user anyshare account
    """

    server_addr = zope.interface.Attribute("user's server address of anyshare")
    """
    user anyshare server address
    """

    right_port = zope.interface.Attribute("user's server right port of anyshare")
    """
    user anyshare server right port
    """
    
    file_port = zope.interface.Attribute("user's server file port of anyshare")
    """
    user anyshare server file port
    """


class IUser(zope.interface.Interface):
    """
    user information
    """
    
    id = zope.interface.Attribute("user id")
    """
    id of user
    """
    
    nickname = zope.interface.Attribute("user nickname")
    """
    nick name
    """
    
    cellphone = zope.interface.Attribute("user cellphone")
    """
    cellphone number
    """
    
    email = zope.interface.Attribute("user email")
    """
    email address
    """

    def loadAnyShare():
        """
        load user anyshare information
        """

    def saveAnyShare():
        """
        save user anyshare information
        """
    
    def load():
        """
        load user information
        """
        
    def save():
        """
        save user information
        """


class ICenter(zope.interface.Interface):
    """
    user center interface
    """
    
    def genUser():
        """
        generate a new user object
        """
    
    def addUser(iuser):
        """
        add user
        """

    def rmvUser(userid):
        """
        delete user
        """

    def getUser(userid):
        """
        query user
        """


class ICenterFactory(zope.interface.Interface):
    """
    user center interface factory
    """

    def __call__(bundle):
        """
        create an object which provide user center interface
        """