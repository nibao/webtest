'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.keys()):
    print i,
'''
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.keys()):
    print '这个字典的键值分别是：',i,dict1[i]
'''
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
for i in sorted(dict1.values()):
    for k,v in dict1.items():
        if v==i:
            print '这个字典的键值分别是：',i,k
'''
dict1={'b':2,'f':5,'d':3,'a':4,'c':7,'e':6}
def search():       #这里的函数很重要，return只能作用于函数范围中
    for k,v in dict1.items():
        if v==i:
            return k
for i in sorted(dict1.values()):
    print i,search()
