import zope.interface


class ICenter(zope.interface.Interface):
    """
    center interface which handle guid
    """

    def gen(category):
        """
        generate guid
        """

    def category(guid):
        """
        get category of guid
        """


class ICenterFactory(zope.interface.Interface):
    """
    center guid
    """

    def __call__(bundle):
        """
        return object which provide guid center interface
        """

