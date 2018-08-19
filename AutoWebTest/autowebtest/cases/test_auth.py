# coding=utf-8 
import sys
from libraries.auth import Auth
from selenium import webdriver
import unittest
from time import sleep
from variable.variable import *

#定义chrome浏览器浏览方式
options = webdriver.ChromeOptions()
options.add_argument("disable-infobars")
options.add_argument("--start-maximized")

class AuthTest(unittest.TestCase):
    """
    登录的case
    """
    @classmethod
    def setUpClass(cls):
        print('LoginTest Start.')

    @classmethod
    def tearDownClass(cls):
        print('LoginTest End.')
    
    def setUp(self):
        self.driver = webdriver.Chrome(chrome_options=options)
        #self.driver.maximize_window()
        
    def tearDown(self):
        self.driver.quit()

    #用例执行demo
    def test_login_success(self):
        print "用户名和密码正确，登录成功"
        #声明Auth类对象
        auth = Auth(self.driver)
        #调用打开页面组件
        auth.open(urlpart1)
        #用户名张三，密码111111，登录成功
        auth.login_action(username1,password1)
        #休眠1秒
        #sleep(1)
        #验证是否登录成功
        self.assertEqual(auth.login_success_user(), username1)
        #截图
        auth.img_screenshot("登录成功")

    def test_login_user_pawd_error(self):
        print "用户名或密码错误，登录失败"
        auth = Auth(self.driver)
        auth.open(urlpart1)
        auth.login_action(username1,password2)
        self.assertEqual(auth.login_error_hint(), u'账号或密码不正确')
        auth.img_screenshot("账号或密码不正确")
