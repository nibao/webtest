#查询一个字符串是否是另一个字符串的一部分&&可以识别Python关键字
import keyword

str1=raw_input('please input your string:')
str2='fdfdhabcshdshjkabcshdjsj'

length=len(str2)+1
result=str2.count(str1,0,length)

if not keyword.iskeyword(str1):
    if result:
        print '包含哦'
    else:
        print '不包含哦'
else:
    print '抱歉'+str1+'是系统保留关键字'
