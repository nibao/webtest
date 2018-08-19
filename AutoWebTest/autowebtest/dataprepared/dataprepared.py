#coding:utf-8
from ShareMgnt import ncTShareMgnt
from ShareMgnt.ttypes import *
from ShareMgnt.constants import *

from EACP import ncTEACP
from EACP.ttypes import *
from EACP.constants import *

try:
    from ShareSite import ncTShareSite
    from ShareSite.ttypes import *
    from ShareSite.constants import *
except:
    pass

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

import StringIO
import random
import sys
import json
from M2Crypto import RSA, BIO
import os 
import time
import requests
import requests.packages.urllib3
requests.packages.urllib3.disable_warnings()
import sys
import threading
import string
from variable.variable import ip

share_transport = TSocket.TSocket(ip,9600)
share_transport = TTransport.TBufferedTransport(share_transport)
share_protocol = TBinaryProtocol.TBinaryProtocol(share_transport)
share_client = ncTShareMgnt.Client(share_protocol)

eacp_transport = TSocket.TSocket(ip,9992)
eacp_transport = TTransport.TBufferedTransport(eacp_transport)
eacp_protocol = TBinaryProtocol.TBinaryProtocol(eacp_transport)
eacp_client = ncTEACP.Client(eacp_protocol)

try:
    sharesite_transport = TSocket.TSocket(ip,9601)
    sharesite_transport = TTransport.TBufferedTransport(sharesite_transport)
    sharesite_protocol = TBinaryProtocol.TBinaryProtocol(sharesite_transport)
    sharesite_client = ncTShareSite.Client(sharesite_protocol)
except:
    pass

class DataPrepare():

    def admin_login(self):
        share_transport.open()
        try:
            option = ncTUserLoginOption ()
            option.loginIp = "192.168.1.1"
            result = share_client.Usrm_Login("admin", "eisoo.com", 1, option)
        except:
            result = share_client.Usrm_Login("admin", "eisoo.com", 1)
        share_transport.close()
        return result

    #获取本地站点信息
    def GetLocalSiteInfo(self):
        id = ''
        name = ''
        try:
            sharesite_transport.open()
            result = ncTSiteInfo()
            result = sharesite_client.GetLocalSiteInfo()
            id = result.id
            name = result.name
            sharesite_transport.close()
        except Exception,e:
            pass
        return id, name
    
    #创建组织
    def create_organize(self,name):
        share_transport.open()
        try: 
            org = ncTAddOrgParam()
            org.orgName = name 
            result = share_client.Usrm_CreateOrganization(org)
        except Exception,e:
            result = share_client.Usrm_CreateOrganization(name)
        else:
            pass
        finally:
            share_transport.close()
            return result

    #创建部门
    def create_depart(self,name, parentid):
        share_transport.open()
        result = ''
        try:
            addperm = ncTAddDepartParam()
            addperm.departName = str(name)
            addperm.parentId = parentid
            result = share_client.Usrm_AddDepartment(addperm)
        except Exception,e:
            result = share_client.Usrm_AddDepartment(parentid, name)
        finally:
            share_transport.close()
        return result

    #创建用户
    def create_user(self,loginName, passwd, depid, id, name):
        adminid = self.admin_login()
        userinfo = ncTUsrmUserInfo()
        userinfo.loginName = str(loginName)
        userinfo.departmentIds = [depid]
        userinfo.space = 1 * 1024 * 1024 * 1024 * 1024
        try:
            site = ncTUsrmSiteInfo()
            site.id = id
            site.name = name 
            userinfo.siteInfo = site
        except:
            pass
        adduserinfo = ncTUsrmAddUserInfo()
        adduserinfo.user = userinfo
        adduserinfo.password = passwd    
        try:
            share_transport.open()
            result = share_client.Usrm_AddUser(adduserinfo, adminid)
            share_transport.close()
            return result
        except Exception, e:
            print e
            share_transport.close()
            return "get an exception", e

    #删除个人文档
    def EACP_DeleteUserDoc(self, userid):
        try:
            eacp_transport.open()
            # import pdb;pdb.set_trace()
            eacp_client.EACP_DeleteUserDoc(userid)
            eacp_transport.close()
            return 'success'       
        except Exception, e:
            print e
            eacp_transport.close()
            return ['get an exception', e]

    #删除用户
    def Usrm_DelUser(self, userid):
        try:
            share_transport.open()
            share_client.Usrm_DelUser(userid)
            share_transport.close()
            return 'success'
        except Exception, e:
            print e
            share_transport.close()
            return "get an exception", e

    #删除组织
    def Usrm_DeleteOrganization(self, orgaId):
        try:
            share_transport.open()
            share_client.Usrm_DeleteOrganization(orgaId)
            share_transport.close()
            return 'success'
        except Exception, e:
            print e
            share_transport.close()
            return "get an exception", e
        
    def create_custom(self, name, typename, ownerIds):
        adminid = self.admin_login()
        eacp_transport.open()
        customdoc = ncTAddCustomDocParam()
        customdoc.name = name
        customdoc.typeName = typename
        customdoc.ownerIds = ownerIds
        customdoc.spaceQuota = 200 * 1024 *1024 *1024
        customdoc.createrId = adminid
        try:
            docid = eacp_client.EACP_AddCustomDoc(customdoc)
        except Exception,e:
            print e
        eacp_transport.close()
        return docid
    
    def delete_custom(self, docid):
        adminid = self.admin_login()
        eacp_transport.open()
        customdoc = ncTDeleteCustomDocParam()
        customdoc.docId = docid
        customdoc.userId = adminid
        try:
            docid = eacp_client.EACP_DeleteCustomDoc(customdoc)
        except Exception,e:
            print e
        eacp_transport.close()

    #简写添加用户
    def AddUser(self):
        id, name = self.GetLocalSiteInfo()
        org = self.create_organize("爱数软件")
        sub1 = self.create_depart("文档管理研发部", org)
        sub11 = self.create_depart("开发部", sub1)
        sub12 = self.create_depart("测试部", sub1)
        sub13 = self.create_depart("产品部", sub1)
        sub111 = self.create_depart("前端开发组", sub11)
        sub112 = self.create_depart("后端开发组", sub11)
        sub121 = self.create_depart("系统测试组", sub12)
        userid1 = self.create_user("张三","111111", sub121, id, name)
        userid2 = self.create_user("李四","111111", sub121, id, name)
        print 'Create user success.'
        return org, userid1,userid2

        

    #简写删除用户
    def DelUser(self, userid):
        self.EACP_DeleteUserDoc(userid)
        self.Usrm_DelUser(userid)
        print 'Delete user success.'

    #简写删除组织架构
    def DelOrg(self,orgid):
        self.Usrm_DeleteOrganization(orgid)  
        print 'Delete org success.'
