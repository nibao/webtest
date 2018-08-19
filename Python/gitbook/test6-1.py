#查询一个字符串是否是另一个字符串的一部分

str1='abc'
str2='fdfdhabcshdshjkabcshdjsj'

length=len(str2)+1
result=str2.count(str1,0,length)

if result:
    print '包含哦'
else:
    print '不包含哦'
