from interfaces.technical.error import *
import implements.technical.sa_util
import anyshare_api.api
import tornado.web
import json
import math
import array
import datetime
import json
import urllib
import operator
import urllib2


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self, bundle):
        bundle = bundle()

        self.wechat = bundle.component.extension.wechat(bundle)

        self.config = bundle.component.technical.config(bundle)
        self.token = bundle.component.technical.token(bundle)

        self.collect = bundle.component.collect(bundle)
        self.user = bundle.component.user(bundle)

        self.session = bundle.dependent.sa.session
        self.debug = bundle.option.debug
        self.wechat_api = bundle.dependent.wechat.engine

        self.appid = self.config.getConfig('wechat_appid')
        self.secret = self.config.getConfig('wechat_appsecret')
        self.anyshare_folder_name = self.config.getConfig('anyshare_folder_name')

        # set header application/json
        if self.debug:
            port = self.request.headers["Origin"]
            self.set_header("Access-Control-Allow-Origin", port)


class ServerSetHandler(BaseHandler):
    """
    anyshare server set handler
    """

    def post(self):
        # get received json string
        req = self.request.body
        decodejson = json.loads(req)

        server_addr = decodejson["server_addr"]
        right_port = decodejson["authority"]
        file_port = decodejson["file"]

        #check if the anyshare server right or file port is valid
        anyshare = anyshare_api.api.AnyShareAPI()
        if not anyshare.get_server_ping(server_addr, right_port, file_port):
            self.write(json.dumps({'error_code': anyshare_server_check_error}))
            return

        self.write(json.dumps({'error_code': succeed}))

    def get(self):
        if self.debug:
            self.post()


class AnyShareBindHandler(BaseHandler):
    """
    anyshare account bind handler
    """

    def _getuserProfile(self, user):
        openid = user
        userinfo = self.wechat_api.get_user_info(openid, 'zh_CN')
        if userinfo is None or str(userinfo["subscribe"]) == "0":
            return None
        return userinfo["nickname"]

    def post(self):
        # get received json string
        req = self.request.body
        decodejson = json.loads(req)

        server_addr = decodejson["server_addr"]
        right_port = decodejson["authority"]
        file_port = decodejson["file"]
        account = decodejson["username"]
        password = decodejson["password"]
        token = decodejson["token"]

        # check anyshare account and password is useful
        try:
            anyshare = anyshare_api.api.AnyShareAPI()
            bind_ret = anyshare.get_user_login(server_addr, right_port, account, password)
            if not bind_ret and not bind_ret['userid'] and not bind_ret['tokenid']:
                self.write(json.dumps({'error_code': anyshare_account_error}))
                return
        except:
            self.write(json.dumps({'error_code': user_unavailable}))
            return

        #get user wechat openid
        openid = self.token.getToken(token)

        # save the server address, right port and file port in database
        user = self.user.genUser()
        user.nickname = self._getuserProfile(openid)

        @implements.technical.sa_util.transaction2
        def _addInfo(session, retry):
            self.user.addUser(user)
            user.loadAnyShare()
            user.anyshare.account = account
            user.anyshare.password = password
            user.anyshare.server_addr = server_addr
            user.anyshare.right_port = right_port
            user.anyshare.file_port = file_port
            user.saveAnyShare()
            # add bind , and this time the bind status is not set
            status = 1
            self.wechat.addBind(openid, user.id, status)
            # after bind success then create wechat folder on anyshare
            name = self.anyshare_folder_name
            anyshare.create_floder(server_addr, right_port, file_port,
                                   bind_ret['userid'], bind_ret['tokenid'], name)
        try:
            _addInfo(self.session, 3)
        except:
            self.write(json.dumps({'error_code': user_fail_to_create}))
            return

        self.write(json.dumps({'error_code': succeed}))

    def get(self):
        if self.debug:
            self.post()


class AnyShareUnBindHandler(BaseHandler):
    """
    anyshare account unbind handler
    """

    def post(self):
        pass

    def get(self):
        if self.debug:
            self.post()


class UploadFileHandler(BaseHandler):
    """
    collect file to wechat handler
    """

    def post(self):
        # get received json string
        req = self.request.body
        decodejson = json.loads(req)

        # get token and check its openid
        openid = decodejson["openid"]
        # todo get upload files
        files = ""
        self.wechat_api.send_multimedia_file(files)

    def get(self):
        if self.debug:
            self.post()


class SaveToAnyShareHandler(BaseHandler):
    """
    collect file save to anyshare server handler
    """

    def post(self):
        pass

    def get(self):
        if self.debug:
            self.post()


class QueryFileHandler(BaseHandler):
    """
    query file from anyshare server handler
    """

    def post(self):
        pass

    def get(self):
        if self.debug:
            self.post()


class WatchCollectedMore(BaseHandler):
    def post(self):
        req = self.request.body
        decodejson = json.loads(req)

        openid = decodejson["openid"]
        try:
            bind = self.wechat.getBind(openid)
            user = self.user.getUser(bind.id)
            if not user:
                return self.write(json.dumps({'error_code': unknown}))
            user.loadAnyShare()
            account = str(user.anyshare.account)
            password = str(user.anyshare.password)
            server_addr = str(user.anyshare.server_addr)
            right_port = str(user.anyshare.right_port)
            file_port = str(user.anyshare.file_port)
            anyshare = anyshare_api.api.AnyShareAPI()
            collects = anyshare.get_document_links(server_addr, right_port, file_port, account, password, self.anyshare_folder_name)
            if collects is None:
                return self.write(json.dumps({'error_code': unknown}))

            self.write(json.dumps({'error_code': succeed, 'collects': collects}))
        except:
            self.write(json.dumps({'error_code': unknown}))

    def get(self):
        if self.debug:
            self.post()