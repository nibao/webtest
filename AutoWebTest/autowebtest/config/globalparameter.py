# coding:utf-8
import time,os
'''
配置全局参数
'''
def file_name(file_dir,str1):   
    for root, dirs, files in os.walk(file_dir):  
        for file in files:   
            if str1 in file:
                return file
        for  dir in  dirs:   
            if str1 in  dir:
                return  dir

# 获取项目路径
project_path =  os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)[0]), '.'))
# 测试用例代码存放路径（用于构建suite,注意该文件夹下的文件都应该以test开头命名）
test_case_path = project_path+"\\cases"
# 测试数据存放路径
testdata_path = project_path+"\\dataprepared\\testdata\\"
# 测试数据目录和文件
androidpac = file_name(testdata_path,'Android')
macpac = file_name(testdata_path,'Mac')
windowspac = file_name(testdata_path,'Windows_All_x64')
# 测试报告存储路径，并以当前时间作为报告名称前缀
report_path = project_path+"\\report\\"
if not os.path.exists(report_path):
    os.makedirs(report_path)
report_time = time.strftime('%Y%m%d%H%S', time.localtime())
report_name = report_path+report_time
# 截图存储路径,并以当前时间作为图片名称前缀
img_path = project_path+"\\screenshot\\"
if not os.path.exists(img_path):
    os.makedirs(img_path)
#zbar路径
zbar = "C:\\Program Files (x86)\\ZBar\\bin\\zbarimg"