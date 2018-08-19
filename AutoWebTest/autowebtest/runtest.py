# coding:utf-8
import unittest,os,time,HTMLTestRunner
from config.globalparameter import test_case_path,report_name
from dataprepared.dataprepared import DataPrepare

'''
构建测试套件，并执行测试
'''

#构建测试集,包含cases目录下的所有以test开头的.py文件
suite = unittest.defaultTestLoader.discover(start_dir=test_case_path,pattern='test_*.py')


# 执行测试
if __name__=="__main__":
    #准备数据
    object1=DataPrepare()
    org, userid1, userid2=object1.AddUser()
    docid = object1.create_custom("name", "文档库", [userid1])
    #定义测试应用
    report = report_name+"_autoweb_report.html"
    fb = open(report,'wb')
    runner = HTMLTestRunner.HTMLTestRunner(
        stream=fb,
        title=u'自动化测试报告',
        description=u'运行环境：Firefox,Chrome,IE', 
    )
    try:
        runner.run(suite)
    except Exception, e:
        print e
        pass
    fb.close()
    #清除数据
    object1.delete_custom(docid)
    object1.DelOrg(org)
    object1.DelUser(userid1)
    object1.DelUser(userid2)
