import zope.interface


class ICollect(zope.interface.Interface):
    """
    product information
    """
    
    id = zope.interface.Attribute("product id")
    """
    collect id
    """
    
    user = zope.interface.Attribute("user id")
    """
    user id
    """
    
    type = zope.interface.Attribute("collect file type")
    """
    file type
    """

    name = zope.interface.Attribute("file name")
    """
    file name
    """

    time = zope.interface.Attribute("collect time")
    """
    collect time
    """

    def load():
        """
        load collect info
        """


class ICenter(zope.interface.Interface):
    """
    collect center interface
    """

    def genCollect():
        """
        generate an empty collect object
        """

    def addCollect(icollect):
        """
        add collect
        """

    def rmvCollect(collectid):
        """
        delete product
        """

    def getCollect(collectid):
        """
        query collect
        """

    def getCollectByUser(userid):
        """
        query collect by userid
        """


class ICenterFactory(zope.interface.Interface):
    """
    collect center interface factory
    """

    def __call__(bundle):
        """
        create an object which provide center center interface
        """

