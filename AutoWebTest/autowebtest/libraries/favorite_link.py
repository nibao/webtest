# coding=utf-8
'''
Project: 收藏  内链   外链
'''

from selenium.webdriver.common.keys import Keys 
from common.base import Base
from common.loc import *
import win32clipboard as w
import win32con
import time


def gettext():
    '''获取剪切板内容'''
    w.OpenClipboard()
    t = w.GetClipboardData(win32con.CF_TEXT)
    w.CloseClipboard()
    return t.decode('gbk').encode('utf-8')

class HideMenu(Base):

    #方法命名规则：操作_窗口_子窗口_元素

    def click_doc_checkbox(self, doc_loc=doc_loc):
        '''选中文档，默认选中个人文档'''
        self.find_element_click(5,*doc_loc)
        
    def click_favorite_icon(self, favorite_loc=favorite_loc):
        '''点击收藏图标，默认点击个人文档的收藏图标'''
        self.find_element_click(5,*favorite_loc)

    def is_favorite(self,favorite_loc=favorite_loc):
        '''判断是否已收藏'''
        time.sleep(2)
        style = self.find_element(*favorite_loc).get_attribute('style')
        print style
        if style == "font-family: AnyShare; font-size: 16px; color: rgb(246, 207, 87);":
            return "favorites"
        elif style == "font-family: AnyShare; font-size: 16px; color: rgb(117, 117, 117);":
            return "not favorites"
        else:
            return "fail"

    def test_favorite(self,doc_loc=doc_loc,favorite_loc=favorite_loc):
        '''收藏/取消收藏文档，默认收藏个人文档'''
        self.click_doc_checkbox(doc_loc)
        self.click_favorite_icon(favorite_loc)
        time.sleep(1)
        re = self.is_favorite(favorite_loc)
        return re

    def click_internalShare(self,internalShare_loc=internalShare_loc):
        '''点击内链共享，默认点击个人文档的内链共享'''
        self.find_element_click(5,*internalShare_loc)

    def click_internalShare_searchbox(self):
        '''点击添加访问者右侧的搜索框'''
        self.find_element_click(5,*internalShare_searchBox_loc)

    def input_internalShare_searchbox(self, accessor="2"):
        '''在搜索框输入访问者'''
        self.find_element(*internalShare_searchBox_loc).send_keys(accessor)

    def select_internalShare_visitor(self,internalShare_selectVisitor_loc=internalShare_selectVisitor_loc):
        '''选中待添加的访问者，默认选中第一个'''
        self.find_element_click(5,*internalShare_selectVisitor_loc)

    def test_addVisitor_internalShareWindow(self,accessor="2",internalShare_selectVisitor_loc=internalShare_selectVisitor_loc):
        '''在内链共享窗口界面执行添加访问者的操作'''
        self.click_internalShare_searchbox()
        self.input_internalShare_searchbox(accessor)
        self.select_internalShare_visitor(internalShare_selectVisitor_loc)    

    def click_internalShare_copy(self):
        '''点击复制链接'''
        self.find_element_click(5,*internalShare_copy_loc)

    def list_internalShare_permissions(self,internalShare_permissionslist_loc=internalShare_permissionslist_loc):
        '''展开权限配置项的permissions选项，默认展开第一条权限配置项'''
        self.find_element_click(5,*internalShare_permissionslist_loc)

    def click_internalShare_displayIcon(self,internalShare_displayIcon_loc=internalShare_displayIcon_loc):
        '''配置权限'''
        "!!!元素定位失败，未实现"
        self.find_element_click(5,*internalShare_displayIcon_loc)

    def test_setDispaly(self,internalShare_permissionslist_loc=internalShare_permissionslist_loc,internalShare_displayIcon_loc=internalShare_displayIcon_loc):
        '''修改权限配置'''
        self.list_internalShare_permissions(internalShare_permissionslist_loc)
        self.click_internalShare_displayIcon(internalShare_displayIcon_loc)

    def is_link_copy_success(self, link, flag="AnyShare://1"):
        '''判断链接是否复制成功'''
        if link in flag:
            return "success"
        else:
            return "fail"       

    def click_internalShare_add(self):
        '''点击添加更多'''
        self.find_element_click(5,*internalShare_add_loc)

    def input_internalShare_addvisitor_searchbox(self, visitor="2"):
        '''在点击添加更多弹出的搜索框中输入信息'''
        self.find_element_click(5,*internalShare_addVisitor_searchVisitor_loc)
        self.find_element(*internalShare_addVisitor_searchVisitor_loc).send_keys(visitor)

    def selectVisitor_internalshare_addvisitor(self,internalShare_addVisitor_selectVisitor_loc=internalShare_addVisitor_selectVisitor_loc):
        '''选中访问者，默认选中第一个'''
        self.find_element_click(5,*internalShare_addVisitor_selectVisitor_loc)

    def click_internalShare_addVisitor_ok(self):
        '''在添加更多窗口中点击确定按钮'''
        self.find_element_click(5,*internalShare_addVisitor_ok_loc)

    def test_addVisitor_addVisitorWindow(self,visitor="2",internalShare_addVisitor_selectVisitor_loc=internalShare_addVisitor_selectVisitor_loc,internalShare_addVisitor_ok_loc=internalShare_addVisitor_ok_loc):
        '''在点击添加更多弹出的搜索框中输入信息，并选中访问者'''
        self.click_internalShare_add()
        self.input_internalShare_addvisitor_searchbox(visitor)
        self.selectVisitor_internalshare_addvisitor(internalShare_addVisitor_selectVisitor_loc)
        self.click_internalShare_addVisitor_ok(internalShare_addVisitor_ok_loc)

    def click_internalShare_addVisitor_tree(self,internalShare_addVisitor_tree_loc=internalShare_addVisitor_tree_loc):
        '''添加更多窗口中展开层级，默认展开最顶级部门'''
        self.find_element_click(5,*internalShare_addVisitor_tree_loc)

    def click_internalShare_addVisitor_item(self,internalShare_addVisitor_item_loc=internalShare_addVisitor_item_loc):
        '''在展开的层级中，选择一项，默认在展开的顶级部门中，选择第一个部门'''
        self.find_element_click(5,*internalShare_addVisitor_Dep_loc)

    def test_addDep_addVisitorWindow(self,internalShare_addVisitor_tree_loc=internalShare_addVisitor_tree_loc,internalShare_addVisitor_item_loc=internalShare_addVisitor_item_loc):
        '''在添加更多窗口中，展开最顶层部门，选择第一个部门加入到访问者中'''
        self.click_internalShare_add()
        self.click_internalShare_addVisitor_tree(internalShare_addVisitor_deptree_loc)
        self.click_internalShare_addVisitor_Dep(internalShare_addVisitor_item_loc)
        self.click_internalShare_addVisitor_ok()


    def click_internalShare_ok(self):
        '''点击内链共享窗口-》确定'''
        self.find_element_click(5,*internalShare_ok_loc)

    def click_internalShare_delete(self,internalShare_delete_loc=internalShare_delete_loc):
        '''删除某条权限配置，默认删除第一条'''
        self.find_element_click(5,*internalShare_delete_loc)

    def click_internalShare_cancel(self):
        '''点击内链共享窗口-》取消按钮'''
        self.find_element_click(5,*internalShare_cancel_loc)

    def click_externalShare(self,externalShare_loc=externalShare_loc):
        '''点击外链共享，默认点击个人文档的外链共享'''
        self.find_element_click(5,*externalShare_loc)

    def click_externalShare_openExternalLink(self):
        '''开启链接'''
        self.find_element_click(5,*externalShare_openExternalLink_loc)

    def click_externalShare_copyLink(self):
        '''复制链接'''
        self.find_element_click(5,*externalShare_copyLink_loc)

    def click_externalShare_closeExternalLink(self):
        '''关闭链接'''
        self.find_element_click(5,*externalShare_closeExternalLink_loc)

    def click_externalShare_preview(self):
        '''勾选/去勾选preview'''
        self.find_element_click(5,*externalShare_preview_loc)

    def click_externalShare_download(self):
        '''勾选/去勾选download'''
        self.find_element_click(5,*externalShare_download_loc)

    def click_externalShare_upload(self):
        '''勾选/去勾选upload'''
        self.find_element_click(5,*externalShare_upload_loc)

    def click_externalShare_expirationDateBox(self):
        '''点击过期日期'''
        self.find_element_click(5,*externalShare_expirationDateBox_loc)

    def click_externalShare_expirationDateBoxCancel(self):
        '''取消设置过期日期'''
        self.find_element_click(5,*externalShare_expirationDateBoxCancel_loc)

    def click_externalShare_passwordCheckBox(self):
        '''点击密码复选框'''
        self.find_element_click(5,*externalShare_passwordCheckBox_loc)

    def click_externalShare_opensCheckBox(self):
        '''点击外链打开次数复选框'''
        self.find_element_click(5,*externalShare_opensCheckBox_loc)

    def click_externalShare_opensInputBox(self):
        '''点击外链打开次数输入框'''
        self.find_element_click(5,*externalShare_opensInputBox_loc)

    def modify_externalShare_opensModifyBox(self, opens=5):
        '''修改外链打开次数'''
        self.find_element(*externalShare_opensModifyBox_loc).clear()
        self.find_element(*externalShare_opensModifyBox_loc).send_keys(opens)

    def test_opens(self, opens):
        '''修改外链打开次数'''
        self.click_externalShare_opensCheckBox()
        self.click_externalShare_opensInputBox()
        self.modify_externalShare_opensModifyBox(opens)

    def click_externalShare_emailInputBox(self):
        '''点击邮件输入框'''
        self.find_element_click(5,*externalShare_emailInputBox_loc)

    def input_externalShare_emailInputBox(self, email_address,externalShare_emailModifyBox_loc=externalShare_emailModifyBox_loc):
        '''输入邮件地址'''
        self.find_element(*externalShare_emailModifyBox_loc).send_keys(email_address)
        self.find_element(*externalShare_emailModifyBox_loc).send_keys(Keys.ENTER)

    def click_externalShare_emailSend(self):
        '''点击发送邮件按钮'''
        self.find_element_click(5,*externalShare_emailSend_loc)

    def test_emailSend(self, email_address,externalShare_emailModifyBox_loc=externalShare_emailModifyBox_loc):
        '''发送邮件'''
        self.click_externalShare_emailInputBox()
        self.input_externalShare_emailInputBox(email_address,externalShare_emailModifyBox_loc)
        self.click_externalShare_emailSend()

    def click_externalShare_save(self):
        '''保存外链配置信息'''
        self.find_element_click(5,*externalShare_save_loc)

    def click_externalShare_closeButton(self):
        '''关闭外链共享窗口'''
        self.find_element_click(5,*externalShare_closeButton_loc)


if __name__ == '__main__':

    from selenium import webdriver
    import time

    driver = webdriver.Chrome()
    driver.get("http://10.2.64.90")
    time.sleep(1)

    username_selector="#root > div > div > div.src-views-Root-styles---wrapper > div > div > div.src-views-Index-styles---index > div._-ShareWebComponents-src-Index-styles-desktop---container > div._-ShareWebComponents-src-Index-styles-desktop---login-body > div:nth-child(2) > div._-ShareWebComponents-src-Login-styles-desktop---container > form > div:nth-child(1) > input"
    password_selector = "#root > div > div > div.src-views-Root-styles---wrapper > div > div > div.src-views-Index-styles---index > div._-ShareWebComponents-src-Index-styles-desktop---container > div._-ShareWebComponents-src-Index-styles-desktop---login-body > div:nth-child(2) > div._-ShareWebComponents-src-Login-styles-desktop---container > form > div:nth-child(2) > input"
    login_selector = "#root > div > div > div.src-views-Root-styles---wrapper > div > div > div.src-views-Index-styles---index > div._-ShareWebComponents-src-Index-styles-desktop---container > div._-ShareWebComponents-src-Index-styles-desktop---login-body > div:nth-child(2) > div._-ShareWebComponents-src-Login-styles-desktop---container > form > div._-ShareWebComponents-src-Login-styles-desktop---login-submit > button"
    driver.find_element_by_css_selector(username_selector).click()
    driver.find_element_by_css_selector(username_selector).send_keys("1")
    driver.find_element_by_css_selector(password_selector).click()
    driver.find_element_by_css_selector(password_selector).send_keys("111111")
    driver.find_element_by_css_selector(login_selector).click()
    time.sleep(1)
    # HideMenu(driver).click_doc_checkbox()

    print HideMenu(driver).test_favorite()
    #内链
    
    # HideMenu(driver).click_internalShare()
    # HideMenu(driver).test_addDep_addVisitorWindow()
    # HideMenu(driver).list_internalShare_permissions()
    # HideMenu(driver).click_internalShare_displayIcon()
    # # HideMenu(driver).test_setDispaly()

    # # HideMenu(driver).click_internalShare()
    # # HideMenu(driver).test_addVisitor_addVisitorWindow()
    # # HideMenu(driver).click_internalShare_ok()
    
    HideMenu(driver).click_internalShare()
    HideMenu(driver).click_internalShare_searchbox()
    HideMenu(driver).input_internalShare_searchbox()
    HideMenu(driver).select_internalShare_visitor()    
    HideMenu(driver).click_internalShare_copy()
    print HideMenu(driver).is_link_copy_success((gettext()), "AnyShare://1")
    HideMenu(driver).click_internalShare_ok()
    time.sleep(1)
    HideMenu(driver).click_internalShare()
    HideMenu(driver).click_internalShare_delete()
    HideMenu(driver).click_internalShare_cancel()
    HideMenu(driver).click_internalShare()
    HideMenu(driver).click_internalShare_delete()
    HideMenu(driver).click_internalShare_ok()        
    # 外链
    HideMenu(driver).click_externalShare()
    HideMenu(driver).click_externalShare_openExternalLink()
    HideMenu(driver).click_externalShare_copyLink()
    print gettext()
    print HideMenu(driver).is_link_copy_success((gettext()[:25]), "http://10.2.64.90:80/link/62D6695C4635646C649413F49A4C2298\n有效期限：2018-08-26")
    HideMenu(driver).click_externalShare_preview()
    HideMenu(driver).click_externalShare_download()
    HideMenu(driver).click_externalShare_upload()
    HideMenu(driver).click_externalShare_expirationDateBox()
    HideMenu(driver).click_externalShare_expirationDateBoxCancel()
    HideMenu(driver).click_externalShare_passwordCheckBox()
    HideMenu(driver).click_externalShare_opensCheckBox()
    HideMenu(driver).click_externalShare_opensInputBox()
    HideMenu(driver).modify_externalShare_opensModifyBox()
    HideMenu(driver).click_externalShare_save()
    HideMenu(driver).click_externalShare_closeExternalLink() 
    HideMenu(driver).click_externalShare_closeButton()  
    
