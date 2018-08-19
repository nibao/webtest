#实现三个数的升序
list=map(int,raw_input('please your number:').split())
x=list[0]
y=list[1]
z=list[2]
max=0
second=0
third=0
if x>y:
    if x>z:
        max=x
        if y>z:
            second=y
            third=z
        else:
            second=z
            third=y
    else:
        max=z
        second=x
        third=y
else:
    if y>z:
        max=y
        if x>z:
            second=x
            third=z
        else:
            second=z
            third=x
    else:
        max=z
        second=y
        third=x
print max,second,third
            


