# coding:utf-8
import paramiko
import hashlib
import hmac
import json
import os
import platform
import threading
import time
import urllib
from ShareMgnt import ncTShareMgnt
from ShareMgnt.ttypes import *
from ShareMgnt.constants import *
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from EThriftException.ttypes import *
plat = platform.system()
cond = threading.Condition()
from config.globalparameter import *
from variable.variable import *
share_transport = TSocket.TSocket(ip,9600)
share_transport = TTransport.TBufferedTransport(share_transport)
share_protocol = TBinaryProtocol.TBinaryProtocol(share_transport)
share_client = ncTShareMgnt.Client(share_protocol)

class FilePrepare():

    def UploadToServer(self, local_dir, remote_dir):
        '''
        从windows上传到服务器上
        '''
        try:  
            #print local_dir,remote_dir
            t=paramiko.Transport((ip,backport))  
            t.connect(username=backusername,password=backpassword)  
            sftp=paramiko.SFTPClient.from_transport(t) 
            for root,dirs,files in os.walk(local_dir): 
                for filespath in files:  
                    local_file = os.path.join(root,filespath)  
                    a = local_file.replace(local_dir,'').replace('\\','/').lstrip('/')
                    remote_file = os.path.join(remote_dir,a)  
                    try:  
                        sftp.put(local_file,remote_file)  
                    except Exception as e:  
                        sftp.mkdir(os.path.split(remote_file)[0])  
                        sftp.put(local_file,remote_file)  
                for name in dirs:  
                    local_path = os.path.join(root,name)  
                    a = local_path.replace(local_dir,'').replace('\\','')  
                    remote_path = os.path.join(remote_dir,a)  
                    try:  
                        sftp.mkdir(remote_path)  
                    except Exception as e: 
                        result = ['get an exception', e]
                        print result 
            print('Upload package to terminal success.') 
            t.close()  
        except Exception as e:  
            print e
            result = ['get an exception', e]
            return result
                    

    def UploadClientUpdatePackage(self, packagePath):
        '''
        上传客户端升级包
        '''
        result = ''
        try:
            share_transport.open()
            #import pdb;pdb.set_trace()
            result = share_client.UploadClientUpdatePackage(packagePath)
            share_transport.close()
            return ['success', result]
        except Exception, e:
            result = ['get an exception', e]
            share_transport.close()
            return result

    def DeleteClientUpdatePackage(self, osType):
        '''
        删除客户端升级包
        '''
        result = ''
        try:
            share_transport.open()
            result = share_client.DeleteClientUpdatePackage(osType)
            share_transport.close()
            return ['success', result]
        except Exception, e:
            result = ['get an exception', e]
            share_transport.close()
            return result

    #简写上传升级包
    def uploadpac(self):
        self.UploadToServer(testdata_path, uploadfilepath)
        windowspac_path = uploadfilepath+androidpac
        self.UploadClientUpdatePackage(windowspac_path)
        macpac_path = uploadfilepath+macpac
        self.UploadClientUpdatePackage(macpac_path)
        androidpac_path = uploadfilepath+windowspac
        self.UploadClientUpdatePackage(androidpac_path)
        print 'Upload package to server success.'

    #简写删除升级包
    def deletepac(self):
        self.DeleteClientUpdatePackage(5)
        self.DeleteClientUpdatePackage(3)
        self.DeleteClientUpdatePackage(2)
        print 'Delete package success.'
        