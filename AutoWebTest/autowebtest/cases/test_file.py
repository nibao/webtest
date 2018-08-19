# coding=utf-8
import sys
import os
from libraries.auth import Auth
from libraries.file import *
from selenium import webdriver
import unittest
from time import sleep
from variable.variable import *
from config.globalparameter import * 
from dataprepared.fileprepare import FilePrepare

#定义chrome浏览器浏览方式
options = webdriver.ChromeOptions()
options.add_argument("disable-infobars")
options.add_argument("--start-maximized")
prefs = {'profile.default_content_settings.popups': 0, 'download.default_directory': osdownloadfilepath, 'safebrowsing':True}
options.add_experimental_option('prefs', prefs)

class fileTest(unittest.TestCase):
    """
    上传下载的case
    """
    @classmethod
    def setUpClass(cls):
        print('FileTest Start.')
        #准备数据
        object1=FilePrepare()
        object1.uploadpac()
        #启动浏览器
        # cls.driver = webdriver.Chrome(chrome_options=options)

    @classmethod
    def tearDownClass(cls):
        #清除数据
        object1=FilePrepare()
        object1.deletepac()
        # #退出浏览器
        # cls.driver.quit()
        print('FileTest End.')

    def setUp(self):
        self.driver = webdriver.Chrome(chrome_options=options)

    def tearDown(self):
        self.driver.quit()

    def test_QRdownload_androidpackage(self):
        print "扫描二维码，登录移动端下载android客户端升级包，下载成功"
        po = File(self.driver)
        po.open(urlpart1)
        qrdata = po.androidpac_QRdownload()
        options.add_argument('--user-agent=android')
        driver2 = webdriver.Chrome(chrome_options = options)
        driver2.get(qrdata)
        po2 = File(driver2)
        #po2.img_screenshot("二维码下载android包")
        po2.judge_download()
        driver2.quit()
        file_path = osdownloadfilepath+androidpac
        src_path=testdata_path+androidpac
        self.assertEqual(po.md5sum(file_path), po.md5sum(src_path))
        os.remove(file_path)

    def test_download_androidpackage(self):
        print "下载android客户端升级包，下载成功"
        po = File(self.driver)
        po.open(urlpart1)
        po.androidpac_download()
        #po.img_screenshot("下载android包")
        po.judge_download()
        file_path = osdownloadfilepath+androidpac
        src_path=testdata_path+androidpac
        self.assertEqual(po.md5sum(file_path), po.md5sum(src_path))
        os.remove(file_path)

    def test_download_macpackage(self):
        print "下载mac客户端升级包，下载成功"
        po = File(self.driver)
        po.open(urlpart1)
        po.macpac_download()
        #po.img_screenshot("下载mac包")
        po.judge_download()
        file_path = osdownloadfilepath+macpac
        src_path=testdata_path+macpac
        self.assertEqual(po.md5sum(file_path), po.md5sum(src_path))
        os.remove(file_path)

    def test_download_windowspackage(self):
        print "下载windows客户端升级包，下载成功"
        po = File(self.driver)
        po.open(urlpart1)
        po.windowspac_download()
        #po.img_screenshot("下载windows包")
        po.judge_download()
        file_path = osdownloadfilepath+windowspac
        src_path=testdata_path+windowspac
        self.assertEqual(po.md5sum(file_path), po.md5sum(src_path))
        os.remove(file_path)   

    def test_download_success(self):
        #下载个人文档
        # webdriver.Chrome()
        auth= Auth(self.driver)
        auth.open(urlpart1)
        auth.login_action(username1,password1)
        sleep(1)
        #鼠标选中
        mouse = Mouseoperation(self.driver)
        mouse.select_selector(selected_selector_loc)
        mouse.click_button(selected_selector_loc)
        sleep(1)
        #选中下载按钮
        down = Download(self.driver)
        down.download(download_loc)
        sleep(2)
        #鼠标点击
        mouse.click_button(download_loc)
        print "下载成功"

    def test_viewsize_success(self):
        #查看大小
        auth = Auth(self.driver)
        auth.open(urlpart1)
        auth.login_action(username1,password1)
        mouse = Mouseoperation(self.driver)
        mouse.select_selector(selected_selector_loc)
        mouse.click_button(selected_selector_loc)
        view = Viewsize(self.driver)
        #选中查看大小按钮
        view.viewsize(viewsizeperson_loc)
        mouse.click_button(viewsizeperson_loc)
        print "查看大小成功"

    def test_copyto_success(self):
        #复制到
        auth = Auth(self.driver)
        auth.open(urlpart1)
        auth.login_action(username1,password1)
        mouse = Mouseoperation(self.driver)
        mouse.select_selector(selected_selector_loc)
        mouse.click_button(selected_selector_loc)
        copy_to = Copyto(self.driver)
        #跳转到复制到页面
        copy_to.copyto(copyto_loc)
        mouse.click_button(copyto_loc)
        #展开目的根路径
        copy_to.copyaddress(copyaddress_loc)
        mouse.click_button(copyaddress_loc)
        #选择目的路径
        copy_to.select_copyaddress(select_copyaddress_loc)
        mouse.click_button(select_copyaddress_loc)
        #点击确定按钮
        copy_to = copy_to.surecopy(surecopy_loc)
        mouse.click_button(surecopy_loc)
        print "复制成功"
