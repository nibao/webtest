import implements.technical.sa_util
import implements.api

import wechat_api.util
import tornado.web
import json
import xml.etree.ElementTree
import urllib2
import anyshare_api.api
import datetime


class BaseHandler(tornado.web.RequestHandler):
    """
    basic class of wechat request handler
    """
    ''' bundle used by current handler '''
    bundle = None
    ''' wechat_api '''
    wechat_api = None

    ''' use default error handler '''
    write_error = implements.api.write_error_log2db

    def initialize(self, bundle_maker):
        """
        initialize with bundle
        """
        ''' create bundle for current request '''
        self.bundle = bundle_maker()
        ''' initialize technical variables '''
        self.debug = self.bundle.option.debug
        self.session = self.bundle.dependent.sa.session
        self.wechat_api = self.bundle.dependent.wechat.engine
        #self.anyshare = self.bundle.dependent.anyshare.engine
        ''' initialize components '''
        self.config = self.bundle.component.technical.config(self.bundle)
        self.user = self.bundle.component.user(self.bundle)
        self.token = self.bundle.component.technical.token(self.bundle)
        ''' initialize logic components '''
        # self.bill = bundle.component.bill(bundle)
        # self.customer = bundle.component.customer(bundle)
        # self.product = bundle.component.product(bundle)
        self.wechat = self.bundle.component.extension.wechat(self.bundle)

        self.anyshare_folder_name = self.config.getConfig("anyshare_folder_name")

class UserNotifyHandler(BaseHandler):
    """
    main handler of WeChat access
    """

    def _on_subscribe(self, xmldoc):
        # user_from = xmldoc.find('FromUserName').text
        # url_to = "http://" + self.request.host + "/winter_wechat"
        # url_to += "/pages/user_info.html"\
        #     if self.wechat.getBind(user_from)\
        #     else "/pages/user_bmp.html"
        # url_to += "?openid=%s" % user_from
        # ''' construct echo news '''
        # msg = wechat_api.util.MessageEcho(
        #     user_from,
        #     xmldoc.find('ToUserName').text)
        # return msg.news(wechat_api.util.Article(
        #     self.config.getConfig("wechat_attention_title"),
        #     self.config.getConfig("wechat_attention_description"),
        #     self.config.getConfig("wechat_attention_picurl"),
        #     url_to))
        self.wechat_api.send_unicast(
            wechat_api.util.MessageUnicast(xmldoc.find('FromUserName').text).
            text(self.config.getConfig('wechat_attention_push')))
        return None

    def _on_unsubscribe(self, xmldoc):
        """ unbind anyshare account with wechat """
        openid = xmldoc.find('FromUserName').text
        bind = self.wechat.getBind(openid)

        @implements.technical.sa_util.transaction1
        def _remove(session):
            userid = bind.id
            self.wechat.rmvBind(openid)
            self.user.rmvUser(userid)

        try:
            if not bind or bind.status == 0:
                pass
            else:
                _remove(self.session)
        except:
            pass

    # struct collected msg content
    def _create_collected_content(self, collects):
        content = []
        try:
            n = 1
            conf_center = self.bundle.component.technical.config(self.bundle)
            for collect in collects:
                n += 1
                if n > 10:
                    break
                file_type = collect['name'].split('.')[-1]
                title = ""
                picurl = ""
                if file_type == 'png':
                    title = conf_center.getConfig("as_png_title")
                    picurl = conf_center.getConfig("as_png_url")
                elif file_type == 'mp3':
                    title = conf_center.getConfig("as_mp3_title")
                    picurl = conf_center.getConfig("as_mp3_url")
                elif file_type == 'mp4':
                    title = conf_center.getConfig("as_mp4_title")
                    picurl = conf_center.getConfig("as_mp4_url")
                elif file_type == 'html':
                    title = conf_center.getConfig("as_html_title")
                    picurl = conf_center.getConfig("as_html_url")
                else:
                    pass
                temp = wechat_api.util.Article(
                    title + collect['name'].split('.')[0],
                    collect['name'],
                    picurl,
                    collect['url'],
                )
                content.append(temp)
            content.append(',')
            return content
        except:
            return None

    def _on_click_menu(self, xmldoc):
        key = xmldoc.find('EventKey').text
        conf_center = self.bundle.component.technical.config(self.bundle)
        user_from = xmldoc.find('FromUserName').text
        user_to = xmldoc.find('ToUserName').text
        msg = wechat_api.util.MessageEcho(user_from, user_to)
        openid = xmldoc.find('FromUserName').text
        if key == "HowCollect":
            if self.wechat.getBind(openid):
                return msg.text(conf_center.getConfig('wechat_how_collect'))
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "Collected":
            if self.wechat.getBind(openid):
                # show the files collected
                bind = self.wechat.getBind(openid)
                if not bind or bind.status == 0:
                    # return msg about to bind
                    return msg.text(conf_center.getConfig("wechat_bind_hint"))
                user = self.user.getUser(bind.id)
                if not user:
                    # return msg about to bind
                    return msg.text(conf_center.getConfig("wechat_bind_hint"))
                user.loadAnyShare()
                account = str(user.anyshare.account)
                password = str(user.anyshare.password)
                server_addr = str(user.anyshare.server_addr)
                right_port = str(user.anyshare.right_port)
                file_port = str(user.anyshare.file_port)
                anyshare = anyshare_api.api.AnyShareAPI()
                collects = anyshare.get_document_links(server_addr, right_port, file_port, account, password, self.anyshare_folder_name)
                if collects is None:
                    return msg.text(conf_center.getConfig('wechat_checked_failed'))

                # show messages
                msg = wechat_api.util.MessageEcho(
                user_from,
                xmldoc.find('ToUserName').text)
                content = self._create_collected_content(collects)
                # content = []
                # # show the first ten files
                # n = 1
                # for collect in collects:
                #     n += 1
                #     if n > 10:
                #         break
                #     file_type = collect['name'].split('.')[-1]
                #     title = ""
                #     picurl = ""
                #     if file_type == 'png':
                #         title = conf_center.getConfig("as_png_title")
                #         picurl = conf_center.getConfig("as_png_url")
                #     elif file_type == 'mp3':
                #         title = conf_center.getConfig("as_mp3_title")
                #         picurl = conf_center.getConfig("as_mp3_url")
                #     elif file_type == 'mp4':
                #         title = conf_center.getConfig("as_mp4_title")
                #         picurl = conf_center.getConfig("as_mp4_url")
                #     elif file_type == 'html':
                #         title = conf_center.getConfig("as_html_title")
                #         picurl = conf_center.getConfig("as_html_url")
                #     else:
                #         pass
                #     temp = wechat_api.util.Article(
                #         title,
                #         collect['name'],
                #         picurl,
                #         collect['url'],
                #     )
                #     content.append(temp)
                # content.append(',')
                if len(content) < 10:
                    return msg.news(content)
                else:
                    # if collected files big than 10 ,
                    # first: send 9 files
                    # second: send more info
                    self.wechat_api.send_unicast(
                        wechat_api.util.MessageUnicast(user_from).
                        news(content).encode('utf-8'))
                    url = "http://" + self.request.host + "/client/my_collection.html?id=%s" % openid
                    return msg.text(conf_center.getConfig('wechat_more_files_msg') % url)
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "Contact_Us":
            if self.wechat.getBind(openid):
                return msg.text(conf_center.getConfig('wechat_menu_contact_us'))
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "Problems":
            if self.wechat.getBind(openid):
                return msg.text(conf_center.getConfig('anyshare_common_problem'))
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "AccountInfo":
            if self.wechat.getBind(openid):
                # show the files collected
                bind = self.wechat.getBind(openid)
                if not bind or bind.status == 0:
                    # return msg about to bind
                    return msg.text(conf_center.getConfig("wechat_bind_hint"))
                user = self.user.getUser(bind.id)
                if not user:
                    # return msg about to bind
                    return msg.text(conf_center.getConfig("wechat_bind_hint"))
                user.loadAnyShare()
                account = str(user.anyshare.account)
                password = str(user.anyshare.password)
                server_addr = str(user.anyshare.server_addr)
                right_port = str(user.anyshare.right_port)
                file_port = str(user.anyshare.file_port)
                anyshare = anyshare_api.api.AnyShareAPI()
                login = anyshare.get_user_login(server_addr, right_port, account, password)
                userid = login['userid']
                tokenid = login['tokenid']
                user_name = anyshare.get_user_info(server_addr, right_port, userid, tokenid)
                infos = anyshare.get_user_spaces(server_addr, right_port, userid, tokenid)
                return msg.text(conf_center.getConfig('anyshare_account_size') % (user_name, infos['quota'], infos['used']))
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "BindAccount":
            if self.wechat.getBind(openid):
                return msg.text(conf_center.getConfig('wechat_binded'))
            else:
                return msg.text(conf_center.getConfig('wechat_bind_hint'))
        elif key == "key_member":
            ''' member center '''
            pass
        elif key == "key_seller":
            ''' I am shop '''
            pass
        return 

    def _on_scancode_push(self, xmldoc):
        # self.redirect("www.baidu.com")
        if xmldoc.find('EventKey').text == "scan_pay":
            user_from = xmldoc.find('FromUserName').text
            ''' 1.get customer's points '''
            #cus_id = self.wechat.getBind(user_from)
            #cus_points = self.customer.getCustomer(cus_id)
            ''' 2.get product's price '''
            #res = json.loads(xmldoc.find('ScanCodeInfo').find('ScanResult').text)
            #clerkid = res["clerkid"]
            #shopid = res["shopid"]
            #productid = res["productid"]
            #todo if customer could use this
            msg = wechat_api.util.MessageEcho(
                user_from,
                xmldoc.find('ToUserName').text)
            return msg.text("Success")

    def _on_recv_text(self, xmldoc):
        """ handle receiving text from wechat user """
        conf_center = self.bundle.component.technical.config(self.bundle)
        msg = wechat_api.util.MessageEcho(
            xmldoc.find('FromUserName').text,
            xmldoc.find('ToUserName').text)
        rec_text = xmldoc.find('Content').text

        if rec_text == "S":
            send_text = conf_center.getConfig("wechat_how_collect")
        elif rec_text == "W":
            user_from = xmldoc.find('FromUserName').text
            openid = xmldoc.find('FromUserName').text
            # show the files collected
            bind = self.wechat.getBind(openid)
            if not bind or bind.status == 0:
                # return msg about to bind
                return msg.text(conf_center.getConfig("wechat_bind_hint"))
            user = self.user.getUser(bind.id)
            if not user:
                # return msg about to bind
                return msg.text(conf_center.getConfig("wechat_bind_hint"))
            user.loadAnyShare()
            account = str(user.anyshare.account)
            password = str(user.anyshare.password)
            server_addr = str(user.anyshare.server_addr)
            right_port = str(user.anyshare.right_port)
            file_port = str(user.anyshare.file_port)
            anyshare = anyshare_api.api.AnyShareAPI()
            collects = anyshare.get_document_links(server_addr, right_port, file_port, account, password, self.anyshare_folder_name)
            if collects is None:
                return msg.text(conf_center.getConfig('wechat_checked_failed'))
            # show messages
            msg = wechat_api.util.MessageEcho(
            user_from,
            xmldoc.find('ToUserName').text)
            content = self._create_collected_content(collects)

            if len(content) < 10:
                return msg.news(content)
            else:
                # if collected files big than 10 ,
                # first: send 9 files
                # second: send more info
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(user_from).
                    news(content).encode('utf-8'))
                url = "http://" + self.request.host + "/client/my_collection.html?id=%s" % openid
                return msg.text(conf_center.getConfig('wechat_more_files_msg') % url)
                # return msg.text(conf_center.getConfig('wechat_more_files_msg'))
            #return msg.news(content)
        elif rec_text == "H":
            send_text = conf_center.getConfig("wechat_menu_contact_us")
        else:
            send_text = conf_center.getConfig("wechat_text_hint")
        return msg.text(send_text)
        # return None
        #msg = wechat_api.util.MessageEcho(
        #    xmldoc.find('FromUserName').text,
        #    xmldoc.find('ToUserName').text)
        #return msg.text(xmldoc.find('Content').text)

    def _on_recv_image(self, xmldoc):
        """ upload images to anyshare """
        conf_center = self.bundle.component.technical.config(self.bundle)
        msg = wechat_api.util.MessageEcho(
            xmldoc.find('FromUserName').text,
            xmldoc.find('ToUserName').text)

        #image who send
        user_from = xmldoc.find('FromUserName').text
        #get the image media_id
        media_id = xmldoc.find('MediaId').text
        access_token = self.wechat_api.get_access_token()
        #down image
        imgres = urllib2.urlopen(
            "http://file.api.weixin.qq.com/cgi-bin/media/get"
            "?access_token=%s&media_id=%s"
            % (access_token, media_id)).read()

        # get bind user info
        bind = self.wechat.getBind(user_from)
        if not bind or bind.status == 0:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user = self.user.getUser(bind.id)
        if not user:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user.loadAnyShare()
        account = str(user.anyshare.account)
        password = str(user.anyshare.password)
        server_addr = str(user.anyshare.server_addr)
        right_port = str(user.anyshare.right_port)
        file_port = str(user.anyshare.file_port)
        # upload file to anyshare server
        # anyshare = anyshare_api.api.AnyShareAPI(server_address=server_addr,
        #                                         right_port=right_port,
        #                                         file_port=file_port,
        #                                         account=account,
        #                                         password=password)
        # anyshare.upload_files()
        anyshare = anyshare_api.api.AnyShareAPI()
        file_type = ".png"
        file_name = None
        ret = anyshare.upload_files(server_addr, right_port, file_port, account, password, imgres, file_name, file_type, self.anyshare_folder_name)
        if ret and ret is True:
            return msg.text(conf_center.getConfig("wechat_save_successed"))
        else:
            return msg.text(conf_center.getConfig("wechat_save_failed"))

    def _on_recv_voice(self, xmldoc):
        """ upload voices to anyshare """
        conf_center = self.bundle.component.technical.config(self.bundle)
        msg = wechat_api.util.MessageEcho(
            xmldoc.find('FromUserName').text,
            xmldoc.find('ToUserName').text)

        #image who send
        user_from = xmldoc.find('FromUserName').text
        #get the image media_id
        media_id = xmldoc.find('MediaId').text
        access_token = self.wechat_api.get_access_token()
        #down image
        voice = urllib2.urlopen(
            "http://file.api.weixin.qq.com/cgi-bin/media/get"
            "?access_token=%s&media_id=%s"
            % (access_token, media_id)).read()

        # get bind user info
        bind = self.wechat.getBind(user_from)
        if not bind or bind.status == 0:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user = self.user.getUser(bind.id)
        if not user:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user.loadAnyShare()
        account = str(user.anyshare.account)
        password = str(user.anyshare.password)
        server_addr = str(user.anyshare.server_addr)
        right_port = str(user.anyshare.right_port)
        file_port = str(user.anyshare.file_port)
        # upload file to anyshare server
        # anyshare = anyshare_api.api.AnyShareAPI(server_address=server_addr,
        #                                         right_port=right_port,
        #                                         file_port=file_port,
        #                                         account=account,
        #                                         password=password)
        # anyshare.upload_files()
        anyshare = anyshare_api.api.AnyShareAPI()
        file_type = ".mp3"
        file_name = None
        ret = anyshare.upload_files(server_addr, right_port, file_port, account, password, voice, file_name, file_type, self.anyshare_folder_name)
        if ret and ret is True:
            return msg.text(conf_center.getConfig("wechat_save_successed"))
        else:
            return msg.text(conf_center.getConfig("wechat_save_failed"))

    def _on_recv_video(self, xmldoc):
        """ upload videos to anyshare """
        conf_center = self.bundle.component.technical.config(self.bundle)
        msg = wechat_api.util.MessageEcho(
            xmldoc.find('FromUserName').text,
            xmldoc.find('ToUserName').text)

        #image who send
        user_from = xmldoc.find('FromUserName').text
        #get the image media_id
        media_id = xmldoc.find('MediaId').text
        access_token = self.wechat_api.get_access_token()
        #down image
        _video = urllib2.urlopen(
            "http://file.api.weixin.qq.com/cgi-bin/media/get"
            "?access_token=%s&media_id=%s"
            % (access_token, media_id)).read()

        # get bind user info
        bind = self.wechat.getBind(user_from)
        if not bind or bind.status == 0:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user = self.user.getUser(bind.id)
        if not user:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user.loadAnyShare()
        account = str(user.anyshare.account)
        password = str(user.anyshare.password)
        server_addr = str(user.anyshare.server_addr)
        right_port = str(user.anyshare.right_port)
        file_port = str(user.anyshare.file_port)
        # upload file to anyshare server
        # anyshare = anyshare_api.api.AnyShareAPI(server_address=server_addr,
        #                                         right_port=right_port,
        #                                         file_port=file_port,
        #                                         account=account,
        #                                         password=password)
        # anyshare.upload_files()
        anyshare = anyshare_api.api.AnyShareAPI()
        file_type = ".mp4"
        file_name = None
        ret = anyshare.upload_files(server_addr, right_port, file_port, account, password, _video, file_name, file_type, self.anyshare_folder_name)
        if ret and ret is True:
            return msg.text(conf_center.getConfig("wechat_save_successed"))
        else:
            return msg.text(conf_center.getConfig("wechat_save_failed"))

    def _on_recv_link(self, xmldoc):
        """ upload links to anyshare """
        conf_center = self.bundle.component.technical.config(self.bundle)
        msg = wechat_api.util.MessageEcho(
            xmldoc.find('FromUserName').text,
            xmldoc.find('ToUserName').text)

        #image who send
        user_from = xmldoc.find('FromUserName').text
        url_title = xmldoc.find('Title').text
        url_Url = xmldoc.find('Url').text
        # #get the image media_id
        # media_id = xmldoc.find('MediaId').text
        access_token = self.wechat_api.get_access_token()
        #create link content
        linkcontent = '<!DOCTYPE html>' \
                      '<html>' \
                      '<head>' \
                      '<meta charset="utf-8" />' \
                      '<script> document.location.href ="%s"; </script>' \
                      '</head>' \
                      '<body></body>' \
                      '</html>' % url_Url

        # get bind user info
        bind = self.wechat.getBind(user_from)
        if not bind or bind.status == 0:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user = self.user.getUser(bind.id)
        if not user:
            # return msg about to bind
            return msg.text(conf_center.getConfig("wechat_bind_hint"))
        user.loadAnyShare()
        account = str(user.anyshare.account)
        password = str(user.anyshare.password)
        server_addr = str(user.anyshare.server_addr)
        right_port = str(user.anyshare.right_port)
        file_port = str(user.anyshare.file_port)
        # upload file to anyshare server
        # anyshare = anyshare_api.api.AnyShareAPI(server_address=server_addr,
        #                                         right_port=right_port,
        #                                         file_port=file_port,
        #                                         account=account,
        #                                         password=password)
        # anyshare.upload_files()
        anyshare = anyshare_api.api.AnyShareAPI()
        file_type = ".html"
        file_name = url_title
        ret = anyshare.upload_files(server_addr, right_port, file_port, account, password,
                                    linkcontent, file_name, file_type, self.anyshare_folder_name)
        if ret and ret is True:
            return msg.text(conf_center.getConfig("wechat_save_successed"))
        else:
            return msg.text(conf_center.getConfig("wechat_save_failed"))

    def get(self):
        """ handle get request """
        sig = wechat_api.util.Signature()
        sig.add(self.wechat_api.token)
        sig.add(self.get_argument("timestamp", None))
        sig.add(self.get_argument("nonce", None))
        if sig.signature() == self.get_argument("signature", None):
            ''' return echo string '''
            self.write(self.get_argument("echostr", None))

    def post(self):
        """ handle post request """
        sig = wechat_api.util.Signature()
        sig.add(self.wechat_api.token)
        sig.add(self.get_argument("timestamp", None))
        sig.add(self.get_argument("nonce", None))
        if sig.signature() != self.get_argument("signature", None):
            ''' failed to verify signature '''
            return
        
        ''' start to parse WeChat message '''
        xmldoc = xml.etree.ElementTree.fromstring(
            text=self.request.body)
        msg_type = xmldoc.find('MsgType').text
        echo = None

        if msg_type == 'event':
            ''' notify event '''
            event = xmldoc.find('Event').text
            if event == 'subscribe':
                ''' notify user subscribe '''
                echo = self._on_subscribe(xmldoc)
            elif event == 'unsubscribe':
                ''' notify user un-subscribe '''
                self._on_unsubscribe(xmldoc)
            elif event == "scancode_push":
                echo = self._on_scancode_push(xmldoc)
            elif event == "CLICK":
                echo = self._on_click_menu(xmldoc)
        elif msg_type == 'text':
            ''' notify receive text '''
            echo = self._on_recv_text(xmldoc)
        elif msg_type == 'image':
            ''' save images on wecaht '''
            echo = self._on_recv_image(xmldoc)
        elif msg_type == 'voice':
            ''' save voice on wechat '''
            echo = self._on_recv_voice(xmldoc)
        elif msg_type == 'video':
            ''' save video on wechat'''
            echo = self._on_recv_video(xmldoc)
        elif msg_type == 'link':
            echo = self._on_recv_link(xmldoc)
            
        if echo:
            ''' echo message if there is any '''
            self.write(echo)


class WeChatAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """ handle get request """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            token = self.token.addToken(openid, datetime.timedelta(seconds=1800))
            url = "http://" + self.request.host + "/client/index.html?token=%s" % token
            #url = "http://" + self.request.host + ":8888/index.html?token=%s" % token
            self.redirect(url)
        except KeyError:
            pass


class HowCollectAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_how_collect')))
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class CollectedAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                #todo send msg about collected files
                pass
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class ContactAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_menu_contact_us')))
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class ProblemAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                self.redirect("http://www.baidu.com")
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class AccountAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                # todo get anyshare account infomation
                account = "testaccount"
                total_size = "5GB"
                size_used = "3GB"
                msg = wechat_api.util.MessageUnicast(openid)
                text1 = self.config.getConfig('anyshare_account_size') \
                    % (account, total_size, size_used)
                self.wechat_api.send_unicast(msg.text(text1))
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class BindingAuthorizeHandler(BaseHandler):

    #def post(self):
    #    """
    #    handle post request
    #    """

    def get(self):
        """
        handle get request
        """
        auth = self.wechat_api.get_auth_base(
            self.get_argument('code', None))
        if auth is None:
            return
        try:
            openid = auth["openid"]
            if self.wechat.getBind(openid):
                pass
            else:
                """ send msg about how to bind"""
                self.wechat_api.send_unicast(
                    wechat_api.util.MessageUnicast(openid)
                    .text(self.config.getConfig('wechat_bind_hint')))

        except KeyError:
            pass


class GetPhoneAuthorizeHandler(BaseHandler):

    def get(self):
        ua = self.request.headers['User-Agent']
        isIPhone = "No" if ua.find("iPhone") == -1 else "Yes"
        download_url_ios = 'https://itunes.apple.com/cn/app/anyshare/id724109340?l=enmt=8'
        download_url_android = 'http://android.myapp.com/myapp/detail.htm?apkName=com.eisoo.anyshare'
        if isIPhone == 'Yes':
            self.redirect(download_url_ios)
        else:
            self.redirect(download_url_android)

