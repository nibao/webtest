import zope.interface


class IBundle(zope.interface.Interface):
    """
    bundle to store all objects needed
    """

    component = zope.interface.Attribute("objects which provide interfaces")
    """
    collections of objects which provide interfaces
    """

    dependent = zope.interface.Attribute("dependent modules")
    """
    dependent objects and modules
    """

    option = zope.interface.Attribute("options")
    """
    flags and switches used by logic
    """

    other = zope.interface.Attribute("others")
    """
    other useful objects
    """


class IBundleFactory(zope.interface.Interface):
    """
    factory of bundle interface
    """
    def __init__(**kwargs):
        """
        initialize bundle factory
        """

    def __call__(**kwargs):
        """
        call to create bundle
        """

    def install():
        """
        install running environment
        """

    def uninstall():
        """
        uninstall environment
        """
