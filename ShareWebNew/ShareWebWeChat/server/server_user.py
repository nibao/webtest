#!/usr/bin/python
import implements.user_sa
import implements.collect_sa

import implements.extension.wechat_sa

import implements.api.extension.wechat

import implements.technical.loop
import tornado.wsgi

import implements.api.user

import tornado.log
import logging
import sys


def handler(bundle_maker):

    bundle_maker.install()
    bundle_maker.component.user = implements.user_sa.Factory()
    bundle_maker.component.collect = implements.collect_sa.Factory()

    bundle_maker.component.extension.wechat = implements.extension.wechat_sa.Factory(bundle_maker)

    ''' redirect logging message '''
    tornado.log.app_log.addHandler(logging.StreamHandler(sys.stderr))
    tornado.log.gen_log.addHandler(logging.StreamHandler(sys.stdout))
    tornado.log.access_log.addHandler(logging.StreamHandler(sys.stdout))

    return tornado.wsgi.WSGIApplication([
        (r"/binding/server", implements.api.user.ServerSetHandler, dict(bundle=bundle_maker)),
        (r"/binding/bind", implements.api.user.AnyShareBindHandler, dict(bundle=bundle_maker)),
        (r"/binding/unbind", implements.api.user.AnyShareUnBindHandler, dict(bundle=bundle_maker)),
        (r"/collect/upload", implements.api.user.UploadFileHandler, dict(bundle=bundle_maker)),
        (r"/collect/save", implements.api.user.SaveToAnyShareHandler, dict(bundle=bundle_maker)),
        (r"/watch/query", implements.api.user.QueryFileHandler, dict(bundle=bundle_maker)),

        (r"/watch/collected/more", implements.api.user.WatchCollectedMore, dict(bundle=bundle_maker)),

        (r"/user/attention/wechat",
         implements.api.extension.wechat.UserNotifyHandler, dict(bundle_maker=bundle_maker)),
        (r"/user/wechat/authority",
         implements.api.extension.wechat.WeChatAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/collect/how",
         implements.api.extension.wechat.HowCollectAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/collect/collected",
         implements.api.extension.wechat.CollectedAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/help/contact",
         implements.api.extension.wechat.ContactAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/help/problem",
         implements.api.extension.wechat.ProblemAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/more/account",
         implements.api.extension.wechat.AccountAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/more/binding",
         implements.api.extension.wechat.BindingAuthorizeHandler, dict(bundle_maker=bundle_maker)),
        (r"/redirect/get/phone",
         implements.api.extension.wechat.GetPhoneAuthorizeHandler, dict(bundle_maker=bundle_maker)),
    ])

if __name__ == "__main__":
    implements.technical.loop.run(handler)