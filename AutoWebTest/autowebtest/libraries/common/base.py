# coding=utf-8
'''
Project:基础类BaseMethod，封装所有页面都公用的方法，
定义open函数，重定义find_element，send_keys等函数。
在初始化方法中定义驱动driver，基本url，title
WebDriverWait提供了显式等待方式。
'''
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
import os, sys
ABSPATH = os.path.abspath(os.path.realpath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
sys.path.append(ABSPATH)
from config.globalparameter import img_path
from variable.variable import base_url
import time
from selenium.webdriver.common.action_chains import ActionChains

# 基本层
class Base(object):
    """
    Base封装所有页面都公用的方法，例如driver, url ,FindElement等
    """
    #初始化driver、url等
    def __init__(self,driver):
        self.driver = driver
        self.base_url = base_url
        self.timeout = 30

    #打开页面
    def open(self,url):
        url_ = self.base_url+url
        self.driver.get(url_)

    #切换至新的窗口
    def switch_new_windows(self):
        windows = self.driver.current_window_handle
        all_handles = self.driver.window_handles
        for handle in all_handles:
            if handle != windows:
                self.driver.switch_to.window(handle)
    
    #重写元素定位方法
    def find_element(self,*loc):
        try:
            WebDriverWait(self.driver,30).until(EC.visibility_of_element_located(loc))
            return self.driver.find_element(*loc)
        except:
            print u"%s cannot find %s"%(self, loc)

    # 定位元素并点击(解決前一窗口未及时关闭，在当前窗口click操作失效的问题)
    def find_element_click(self, duration=5, *loc):
        driver_loc = self.find_element(*loc)
        e = "error"
        start = time.time()
        end = start
        while (end-start<duration and e != "success"):
            try:
                driver_loc.click()
                e = "success"
            except Exception as e:
                pass
            end = time.time()
        # print e
        return e
    
    #定义script方法，用于执行js脚本，范围执行结果
    def script(self, src):
        self.driver.execute_script(src)
    
    #重写定义send_keys方法
    def send_keys(self, loc, vaule, clear_first=True, click_first=True):
        try:
            loc = getattr(self,"_%s"% loc)
            if click_first:
                self.find_element(*loc).click()
            if clear_first:
                self.find_element(*loc).clear()
                self.find_element(*loc).send_keys(vaule)
        except AttributeError:
            print u"%s cannot find %s"%(self, loc)

    #定义鼠标悬停方法
    def move_to_element(self, element):
        try:
            ActionChains(self.driver).move_to_element(element).perform()
        except AttributeError:
            print u"%s cannot find %s"%(self, element)

    #截图
    def img_screenshot(self, img_name):
        picname = img_path+img_name+".png"
        self.driver.get_screenshot_as_file(picname.decode('utf-8'))
        print "screenshot: %s.png"%(img_name)
    