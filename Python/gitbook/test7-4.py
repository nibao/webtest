list1=[1,2,3]
list2=['a','b','c']
dict1={}

len1=len(list1)
len2=len(list2)

if len1==len2:
    index=0
    while index<len1:       #�����ѭ���жϲ�����ʹ��for��for��Python��������ѭ����������
        dict1[list1[index]]=list2[index]
        index=index+1
    print dict1
else:
    print '�����б��Ȳ�һ�����޷����'
