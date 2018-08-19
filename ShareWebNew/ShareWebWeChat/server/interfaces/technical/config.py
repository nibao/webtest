import zope.interface


class ICenter(zope.interface.Interface):
    """
    user center interface
    """

    def addConfig(key, value):
        """
        add config
        """

    def getConfig(key):
        """
        query value by key
        """


class ICenterFactory(zope.interface.Interface):
    """
    config center interface factory
    """

    def __call__(bundle):
        """
        create an object which provide config center interface
        """
