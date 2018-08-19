import implements.technical.bundle_args
import implements.technical.bundle_conf
import implements.technical.config_sa
import implements.technical.guid
import implements.technical.token_sa
import argparse


def run(handler):
    """  service run """
    ''' parse arguments '''
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=80)
    parser.add_argument('--debug', nargs="?", default=argparse.SUPPRESS)
    parser.add_argument("--extra-config", nargs="?", default=argparse.SUPPRESS)
    parser.add_argument('--sal_conn', default="")
    args = parser.parse_args()

    if hasattr(args, "extra_config"):
        ''' make temporary bundle '''
        b = implements.technical.bundle_args.Factory(sal_conn=args.sal_conn)
        ''' get config center '''
        config_center = implements.technical.config_sa.Factory(b.dependent.sa.engine)(b)
        ''' make target bundle '''
        b = implements.technical.bundle_conf.Factory(
            config=config_center,
            debug=True if hasattr(args, 'debug') else False)
        b.component.technical.config = config_center
        b.component.technical.guid = implements.technical.guid.Factory()
        b.component.technical.token = implements.technical.token_sa.Factory(b.dependent.sa.engine)
    else:
        b = implements.technical.bundle_args.Factory(
            sal_conn=args.sal_conn,
            debug=True if hasattr(args, 'debug') else False)
        b.component.technical.config = implements.technical.config_sa.Factory(b.dependent.sa.engine)
        b.component.technical.guid = implements.technical.guid.Factory()
        b.component.technical.token = implements.technical.token_sa.Factory(b.dependent.sa.engine)

    ''' install handler of main logic '''
    app = handler(b)

    try:
        import gevent.monkey
        import gevent.wsgi
        ''' patch all io method '''
        gevent.monkey.patch_all()
        server = gevent.wsgi.WSGIServer(('', args.port), app)
        # print "starting gevent wsgi"
        server.serve_forever()
    except ImportError:
        import tornado.httpserver
        import tornado.ioloop
        import tornado.wsgi
        server = tornado.httpserver.HTTPServer(tornado.wsgi.WSGIContainer(app))
        server.listen(args.port)
        # print "starting tornado ioloop"
        tornado.ioloop.IOLoop.instance().start()