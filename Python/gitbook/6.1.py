
#检查标识符合法性。标识符以字母和下划线开头；后面跟字母，下划线或者数字
#这里需要检查两点，首字母是否在字母或者下划线中；紧随字母...
#字母和字符串的list分别使用string模块中的letters和digits


'''
该程序存在BUG：只检查了首字符和第二个字符，并未对其他字符做出检查
import string

first=string.letters+'_'
second=string.digits+first

username=raw_input('please input your id:')

if username[0] in first:
    if username[1] in second:
        print "your id is right~"
    else:
        print "your id second string is wrong"
else:
    print 'your id first number is wrong'
'''
'''
代码中关于是以in判断还是not in判断，没有做出解释。我是以in先进行判断的，遇到的问题：无法处理后续
字符出错后同时提示正确和错误的问题
并且，我也没有判断ID的字符数问题
import string

first=string.letters+'_'
second=string.digits+first

username=raw_input('please input your id:')

if username[0] in first:
    for others in username[1:]:
        if others not in second:
            print "your is wrong"
            break
    print 'you are right'
else:
    print 'your id first number is wrong'
'''
#coding:utf-8
import string
import keyword

first=string.letters+'_'
second=string.digits+first

username=raw_input('please input your id:')

if not keyword.iskeyword(username):
    if len(username)>1:
        if username[0] not in first:
            print '首字符必须是字母或下划线'
            for others in username[1:]:
                if others not in second:
                    print "后续字符必须是字母，下划线或者数字"
                    break
        else:
            print '创建用户名成功'
    else:
        print '用户名字符数至少为两位'
else:
    print '输入用户名与保留关键字重复，请重新输入'
