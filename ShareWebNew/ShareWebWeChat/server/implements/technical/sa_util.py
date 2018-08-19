import sqlalchemy
import sqlalchemy.exc
import sqlalchemy.ext.declarative
import sqlalchemy.orm
import sqlalchemy.sql


Tables = sqlalchemy.ext.declarative.declarative_base()


def transaction1(func):
    """
    decorator for sqlalchemy transaction
    """
    def __commit(session):
        session.begin(subtransactions=True)
        try:
            ''' execute code block '''
            ret = func(session)
            ''' commit to database '''
            session.commit()
            return ret
        except sqlalchemy.exc.DatabaseError:
            session.rollback()
            ''' raise again '''
            raise
    return __commit


def transaction2(func):
    """
    decorator for sqlalchemy transaction
    """
    def __commit(session, retry):
        for i in range(1, retry):
            ''' retry, if database commit fails  '''
            session.begin(subtransactions=True)
            try:
                ''' execute code block first '''
                ret = func(session, i)
                ''' commit to database '''
                session.commit()
                ''' return immediately if succeed to commit '''
                return ret
            except sqlalchemy.exc.InvalidRequestError:
                ''' return immediately if there is nothing to commit '''
                return
            except sqlalchemy.exc.IntegrityError:
                session.rollback()
                pass
            except sqlalchemy.exc.DatabaseError:
                session.rollback()
                raise

    return __commit

