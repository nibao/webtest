'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.keys()):
    print i,
'''
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.keys()):
    print '����ֵ�ļ�ֵ�ֱ��ǣ�',i,dict1[i]
'''
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.values()):
    for k,v in dict1.items():
        if v==i:
            print '����ֵ�ļ�ֵ�ֱ��ǣ�',i,k
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
def search():       #����ĺ�������Ҫ��returnֻ�������ں�����Χ��
    for k,v in dict1.items():
        if v==i:
            return k
for i in sorted(dict1.values()):
    print i,search()
