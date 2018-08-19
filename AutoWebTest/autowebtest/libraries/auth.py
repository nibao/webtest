# coding=utf-8
'''
Project:页面基本操作方法：如login_action
'''

from common.base import Base
from common.loc import *

#继承Base类
class Auth(Base):

    def login_username(self, username):
        self.find_element(*username_loc).send_keys(username)
    
    def login_password(self, password):
        self.find_element(*password_loc).send_keys(password)
        
    def login_button(self):
        self.find_element(*submit_loc).click()

    def login_action(self,username,password):
        self.login_username(username)
        self.login_password(password)
        self.login_button()

    def login_success_user(self):
        return self.find_element(*login_success_user_loc).text
    
    def login_error_hint(self):
        return self.find_element(*login_erro_hint_loc).text
