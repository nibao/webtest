#��ѯһ���ַ����Ƿ�����һ���ַ�����һ����

str1='abc'
str2='fdfdhabcshdshjkabcshdjsj'

length=len(str2)+1
result=str2.count(str1,0,length)

if result:
    print '����Ŷ'
else:
    print '������Ŷ'
