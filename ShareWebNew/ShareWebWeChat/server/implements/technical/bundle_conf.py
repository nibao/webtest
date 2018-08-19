import interfaces.technical.bundle
import interfaces.technical.config
import implements.technical
import implements.technical.sa_util

import zope.interface.declarations
import sqlalchemy
import sqlalchemy.orm
import copy


@zope.interface.declarations.implementer(interfaces.technical.bundle.IBundle)
class _Bundle(object):
    """
    implement of IBundle interface
    """

    ''' implement of attributes  '''
    dependent = implements.technical.Dummy()
    component = None
    option = None
    other = None

    def __init__(self, factory):
        """ initialize bundle """
        self.option = factory.option
        self.component = factory.component
        ''' copy every sub attribute of variable dependent '''
        for var in vars(factory.dependent):
            setattr(self.dependent, var, copy.copy(
                getattr(factory.dependent, var)))
        ''' create a new session '''
        self.dependent.sa.session\
            = self.dependent.sa.session_maker()


@zope.interface.declarations.implementer(interfaces.technical.bundle.IBundleFactory)
@zope.interface.declarations.provider(interfaces.technical.bundle.IBundle)
class Factory(object):
    """
    implement of bundle factory
    """
    component = implements.technical.Dummy()
    dependent = implements.technical.Dummy()
    option = implements.technical.Dummy()

    def __init__(self, **kwargs):
        config = kwargs['config']
        if not interfaces.technical.config.ICenter.providedBy(config):
            raise Exception('bundle should be initialized by config center')

        self.component.technical = implements.technical.Dummy()
        self.component.extension = implements.technical.Dummy()

        ''' check running options '''
        self.option.debug = (kwargs.get('debug') and True) or False

        ''' get sqlalchemy configuration string '''
        sal_conn = config.getConfig('sal_conn')
        if sal_conn:
            ''' initialize database '''
            self.dependent.sa = implements.technical.Dummy()
            self.dependent.sa.engine = sqlalchemy.create_engine(
                sal_conn, echo=self.option.debug, pool_size=2, pool_recycle=3600)
            self.dependent.sa.session_maker = sqlalchemy.orm.scoped_session(
                sqlalchemy.orm.sessionmaker(bind=self.dependent.sa.engine, autocommit=True))

        try:
            ''' check running options '''
            self.option.debug = True if kwargs['debug'] else False
        except KeyError:
            self.option.debug = False

    def __call__(self, **kwargs):
        return _Bundle(self)

    def install(self):
        """ install environment """
        ''' create all database tables  '''
        implements.technical.sa_util.Tables.metadata.create_all(
            self.dependent.sa.engine)

    def uninstall(self):
        """ uninstall environment """
        ''' remove all database tables  '''
        implements.technical.sa_util.Tables.metadata.drop_all(
            self.dependent.sa.engine)


