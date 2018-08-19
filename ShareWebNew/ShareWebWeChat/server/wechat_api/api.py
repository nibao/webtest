import datetime
import json
import urllib2


class WeChatAPI(object):

    def __init__(self, appid, appsecret, token):
        self.appid = appid
        self.appsecret = appsecret
        self.token = token
        ''' variables for wechat access token '''
        self.access = None
        self.access_expire = None

    def _get_access_token(self):
        """ do get access token """
        res = urllib2.urlopen(
            "https://api.weixin.qq.com/cgi-bin/token"
            "?grant_type=client_credential&appid=%s&secret=%s"
            % (self.appid, self.appsecret)).read()
        res = json.loads(res)
        try:
            token = str(res["access_token"])
            timeout = int(res["expires_in"])
            if timeout > 30:
                ''' shorten the time by 30 seconds '''
                timeout -= 30
            self.access = token
            self.access_expire =\
                datetime.datetime.now() + \
                datetime.timedelta(seconds=timeout)
            return token
        except KeyError:
            return None

    def get_access_token(self):
        """
        method to get current wechat access token
        """
        ''' check if there is cached token '''
        # return self.access\
        #     if (self.access
        #         and self.access_expire
        #         and self.access_expire <= datetime.datetime.now())\
        #     else self._get_access_token()
        return self._get_access_token()

    def _safe_request(self, url, data=None):
        res = urllib2.urlopen(url % self.get_access_token(), data=data).read()
        res = json.loads(res)
        try:
            if res["errcode"] != 0:
                ''' request again if return error code '''
                ''' and force to request access token '''
                res = urllib2.urlopen(url % self._get_access_token(), data=data).read()
                res = json.loads(res)
        except KeyError:
            pass
        return res

    def get_ip_list(self):
        res = self._safe_request("https://api.weixin.qq.com/"
                                 "cgi-bin/getcallbackip?access_token=%s")
        try:
            ''' return ip list if succeed '''
            return res["ip_list"]
        except KeyError:
            return None

    def get_user_info(self, openid, lang=None):
        if not isinstance(openid, basestring):
            return None
        url = "https://api.weixin.qq.com/" \
              "cgi-bin/user/info?access_token=%s" + ("&openid=%s" % openid)
        if lang:
            url += ("&lang=%s" % lang)
        res = self._safe_request(url)
        return None if "errcode" in res else res

    def get_auth_base(self, code):
        if not isinstance(code, basestring):
            return None
        res = urllib2.urlopen("https://api.weixin.qq.com/sns/oauth2/access_token"
                              "?appid=%s&secret=%s&code=%s"
                              "&grant_type=authorization_code"
                              % (self.appid, self.appsecret, code)).read()
        res = json.loads(res)
        return None if "errcode" in res else res

    def send_unicast(self, msg):
        self._safe_request("https://api.weixin.qq.com/"
                           "cgi-bin/message/custom/send"
                           "?access_token=%s", data=msg)

    def send_multicast(self, msg):
        res = self._safe_request("https://api.weixin.qq.com/"
                                 "cgi-bin/message/mass/sendall"
                                 "?access_token=%s", data=msg)
        res = json.loads(res)
        try:
            ''' succeed only when error code is 0 '''
            if res["errcode"] == 0:
                return True
        except KeyError:
            pass
        return False

    def send_multimedia_file(self, files):
        res = urllib2.urlopen("http://file.api.weixin.qq.com/"
                              "cgi-bin/media/upload"
                              "?access_token=%s&type=%s"
                              % (self.get_access_token(), files)).read()
        res = json.loads(res)
        return None if "errcode" in res else res
