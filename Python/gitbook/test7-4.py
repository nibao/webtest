list1=[1,2,3]
list2=['a','b','c']
dict1={}

len1=len(list1)
len2=len(list2)

if len1==len2:
    index=0
    while index<len1:       #这里的循环判断不可以使用for，for在Python中是用于循环遍历序列
        dict1[list1[index]]=list2[index]
        index=index+1
    print dict1
else:
    print '两个列表长度不一样，无法组合'
