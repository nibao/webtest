#��ѯһ���ַ����Ƿ�����һ���ַ�����һ����&&����ʶ��Python�ؼ���
import keyword

str1=raw_input('please input your string:')
str2='fdfdhabcshdshjkabcshdjsj'

length=len(str2)+1
result=str2.count(str1,0,length)

if not keyword.iskeyword(str1):
    if result:
        print '����Ŷ'
    else:
        print '������Ŷ'
else:
    print '��Ǹ'+str1+'��ϵͳ�����ؼ���'
