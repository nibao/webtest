# coding=utf-8
'''
Project:页面基本操作方法：如open，input_username，input_password，click_submit
'''
from common.base import Base
from common.loc import *
import os
import hashlib
from PIL import Image
import subprocess
from config.globalparameter import * 

#继承Base类
class File(Base):
    #操作
    #点击下载安卓升级包
    def androidpac_download(self):
        self.find_element(*androidpac_loc).click()
    
    #点击下载mac升级包
    def macpac_download(self):
        self.find_element(*macpac_loc).click()
    
    #点击下载windows客户端升级包
    def windowspac_download(self):
        self.find_element(*windowspac_loc).click()

    #计算MD5值
    def md5sum(self,file_path):
        #md5 = None
        if os.path.isfile(file_path):
            f = open(file_path,'rb')
            md5_obj = hashlib.md5()
            while True:
                d = f.read(8096)
                if not d:
                    break
                md5_obj.update(d)
            hash_code = md5_obj.hexdigest()
            f.close()
            md5 = str(hash_code).lower()
            return md5

    #解析二维码
    def get_QR(self,QRCode_pic):
        code =  subprocess.check_output([zbar,"-q", QRCode_pic])
        data = code[8:]
        return data

    #二维码下载安卓升级包
    def androidpac_QRdownload(self):
        above = self.find_element(*androidpac_loc)
        self.move_to_element(above)
        self.driver.save_screenshot('QRCode.png')
        QRCode=self.find_element(*androidpac_QRCode_loc)                   
        left = QRCode.location['x']
        top = QRCode.location['y']
        right = QRCode.location['x'] + QRCode.size['width']
        bottom = QRCode.location['y'] + QRCode.size['height']
        im = Image.open('QRCode.png')
        im = im.crop((int(left), int(top), int(right), int(bottom)))
        im.save('QRCode.png')
        qrdata= self.get_QR('QRCode.png')
        os.remove('QRCode.png')
        return qrdata

    #定位到shadow_root
    def expand_shadow_element(self,element):
        shadow_root = self.driver.execute_script('return arguments[0].shadowRoot', element)
        return shadow_root
    
    #查看下载项
    def search_download(self):
        root1 = self.driver.find_element_by_tag_name('downloads-manager')
        shadow_root1 = self.expand_shadow_element(root1)
        ironlist= shadow_root1.find_element_by_css_selector('iron-list')
        root2 = ironlist.find_element_by_css_selector('downloads-item')
        shadow_root2 = self.expand_shadow_element(root2)
        content_div1 = shadow_root2.find_element_by_css_selector('#content')
        content_div2 = content_div1.find_element_by_css_selector('#details')
        content = content_div2.find_element_by_css_selector('#description').text
        return content

    #判断是否下载完成
    def judge_download(self):
        self.switch_new_windows()
        self.driver.get("chrome://downloads")
        while True:
            content = self.search_download()
            if content =='':
                break
            else:
                continue

#文件下载
class Mouseoperation(Base):
    #鼠标悬浮
    def select_selector(self,element):
        return self.find_element(*element)
    #鼠标点击
    def click_button(self, element):
        self.find_element(*element).click()

class Download(Base):
    #下载
    def download(self,element):
        return self.find_element(*element)

class Viewsize(Base):
    #查看大小
    def viewsize(self,element):
        return self.find_element(*element)

class Copyto(Base):
    #选择复制到
    def copyto(self,element):
        return self.find_element(*element)
    #找到复制到根路径
    def copyaddress(self,element):
        return self.find_element(*element)
    #选择复制地址
    def select_copyaddress(self,element):
        return self.find_element(*element)
    #确定
    def surecopy(self,element):
        return self.find_element(*element)
