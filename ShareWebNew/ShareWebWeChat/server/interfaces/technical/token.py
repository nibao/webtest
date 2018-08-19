import zope.interface

'''
class IToken(zope.interface.Interface):
    """
    access token for login users
    """

    id = zope.interface.Attribute("inner guid")
    """
    inner guid
    """

    timeout = zope.interface.Attribute("token timeout")
    """
    token timeout
    """
'''


class ICenter(zope.interface.Interface):
    """
    center of access token
    """

    def addToken(content, timeout):
        """
        generate access token
        return token id
        """

    def rmvToken(tokenid):
        """
        remove access token by id
        """

    def getToken(tokenid):
        """
        get inner guid by token id
        """


class ICenterFactory(zope.interface.Interface):
    """
    factory of center
    """

    def __call__(bundle):
        """
        create object which provide token center
        """

