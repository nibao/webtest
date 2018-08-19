import datetime
import hashlib
import urllib2

''' save unix begin time '''
_time_begin = datetime.datetime(1970, 1, 1)


def _time_to_integer(time):
    """ convert datetime to integer """
    return int((time - _time_begin).total_seconds())


class Signature(object):

    def __init__(self):
        self.elements = []

    def add(self, element):
        """ add element for signature """
        if not isinstance(element, basestring):
            return False
        self.elements.append(element)
        return True

    def signature(self, delimiter=None, append=None):
        self.elements.sort()
        signature = ""
        if delimiter is None:
            signature = signature.join(self.elements)
        else:
            delimiter = str(delimiter)
            for element in self.elements:
                signature += (delimiter + element)\
                    if len(signature) != 0 else element
        if append is not None:
            signature += str(append)
        return hashlib.sha1(signature).hexdigest()


class Article(object):
    """
    articles in news
    """
    def __init__(self, title, desc, pic, url):
        self.title = title
        self.desc = desc
        self.pic = pic
        self.url = url


class MessageEcho(object):

    def __init__(self, userto, userfrom):
        self.userto = userto
        self.userfrom = userfrom

    def text(self, content):
        return "<xml>" \
               "<ToUserName><![CDATA[%s]]></ToUserName>" \
               "<FromUserName><![CDATA[%s]]></FromUserName>" \
               "<CreateTime>%s</CreateTime>" \
               "<MsgType><![CDATA[text]]></MsgType>" \
               "<Content><![CDATA[%s]]></Content>" \
               "</xml>" % (self.userto, self.userfrom,
                           _time_to_integer(datetime.datetime.now()), content)

    def news(self, articles):
        content = ""
        count = 0
        for article in articles:
            if isinstance(article, Article):
                count += 1
                content += "<item>" \
                           "<Title><![CDATA[%s]]></Title>" \
                           "<Description><![CDATA[%s]]></Description>" \
                           "<PicUrl><![CDATA[%s]]></PicUrl>" \
                           "<Url><![CDATA[%s]]></Url>" \
                           "</item>" % (article.title, article.desc,
                                        article.pic, article.url)
        if count == 0:
            return None
        return "<xml>" \
               "<ToUserName><![CDATA[%s]]></ToUserName>" \
               "<FromUserName><![CDATA[%s]]></FromUserName>" \
               "<CreateTime>%s</CreateTime>" \
               "<MsgType><![CDATA[news]]></MsgType>" \
               "<ArticleCount>%s</ArticleCount>" \
               "<Articles>%s</Articles>" \
               "</xml>" % (self.userto, self.userfrom,
                           _time_to_integer(datetime.datetime.now()),
                           count, content)


class MessageUnicast(object):

    def __init__(self, userto):
        self.userto = userto

    def text(self, content):
        return ('{"touser":"%s","msgtype":"text",'
                '"text":{"content":"%s"}}'
                % (self.userto, content)).encode('utf-8')

    def news(self, articles):
        content = ""
        count = 0
        for article in articles:
            if isinstance(article, Article):
                count += 1
                if content != "":
                    content += ","
                content += '{"title":"%s","description":"%s",' \
                           '"url":"%s","picurl":"%s"}'\
                           % (article.title, article.desc,
                              article.url, article.pic)
        if count == 0:
            return None
        return '{"touser":"%s","msgtype":"news",' \
               '"news":{"articles": [%s]}}'\
               % (self.userto, content)


class PaymentPackage(object):

    attach = None
    bank_type = "WX"
    body = None
    fee_type = 1
    goods_tag = None
    input_charset = "GBK"
    notify_url = ""
    out_trade_no = None
    partner = None
    product_fee = 0
    spbill_create_ip = None
    time_expire = None
    time_start = None
    total_fee = 0
    transport_fee = 0

    def _urlstring(self, urlencode=False):
        """ compose string for signature """
        signature = ""
        if self.attach:
            signature += "attach=%s&" % (
                urllib2.quote(self.attach.encode("utf-8"), '')
                if urlencode else self.attach)
        if self.bank_type:
            signature += "bank_type=%s&" % self.bank_type
        if self.body:
            signature += "body=%s&" % (
                urllib2.quote(self.body.encode("utf-8"), '')
                if urlencode else self.body)
        if isinstance(self.fee_type, int):
            signature += "fee_type=%s&" % self.fee_type
        if self.goods_tag:
            signature += "goods_tag=%s&" % (
                urllib2.quote(self.goods_tag.encode("utf-8"), '')
                if urlencode else self.goods_tag)
        if self.input_charset:
            signature += "input_charset=%s&" % self.input_charset
        if self.notify_url:
            signature += "notify_url=%s&" % (
                urllib2.quote(self.notify_url.encode("utf-8"), '')
                if urlencode else self.notify_url)
        if self.out_trade_no:
            signature += "out_trade_no=%s&" % self.out_trade_no
        if self.partner:
            signature += "partner=%s&" % self.partner
        if isinstance(self.product_fee, int) and self.product_fee != 0:
            signature += "product_fee=%s&" % self.product_fee
        if self.spbill_create_ip:
            signature += "spbill_create_ip=%s&" % (
                urllib2.quote(self.spbill_create_ip.encode("utf-8"), '')
                if urlencode else self.spbill_create_ip)
        if self.time_expire:
            signature += "time_expire=%s&" % self.time_expire
        if self.time_start:
            signature += "time_start=%s&" % self.time_start
        if isinstance(self.total_fee, int):
            signature += "total_fee=%s&" % self.total_fee
        if isinstance(self.transport_fee, int) and self.transport_fee != 0:
            signature += "transport_fee=%s&" % self.transport_fee
        return signature

    def signature(self, partnerkey):
        return hashlib.md5(self._urlstring() + (
            "key=%s" % partnerkey)).hexdigest().upper()

    def urlstring(self, partnerkey):
        return self._urlstring(urlencode=True) + "sign=" + self.signature(partnerkey)




