
#����ʶ���Ϸ��ԡ���ʶ������ĸ���»��߿�ͷ���������ĸ���»��߻�������
#������Ҫ������㣬����ĸ�Ƿ�����ĸ�����»����У�������ĸ...
#��ĸ���ַ�����list�ֱ�ʹ��stringģ���е�letters��digits


'''
�ó������BUG��ֻ��������ַ��͵ڶ����ַ�����δ�������ַ��������
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
�����й�������in�жϻ���not in�жϣ�û���������͡�������in�Ƚ����жϵģ����������⣺�޷��������
�ַ������ͬʱ��ʾ��ȷ�ʹ��������
���ң���Ҳû���ж�ID���ַ�������
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
            print '���ַ���������ĸ���»���'
            for others in username[1:]:
                if others not in second:
                    print "�����ַ���������ĸ���»��߻�������"
                    break
        else:
            print '�����û����ɹ�'
    else:
        print '�û����ַ�������Ϊ��λ'
else:
    print '�����û����뱣���ؼ����ظ�������������'
