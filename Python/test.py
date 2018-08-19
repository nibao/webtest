#coding=utf-8
from appium import webdriver

desired_caps = {
                'platformName':'Android',
                'deviceName':'39e3cc43',
                'platformVersion':'6.0.1',
                'appPackage':'com.android.chrome',
                'appActivity':'com.google.android.apps.chrome.Main',
                }
driver=webdriver.Remote('http://127.0.0.1:4723/wd/hub',desired_caps)
