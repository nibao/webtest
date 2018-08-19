stack=[]

def pushit():
    stack.append(raw_input('Enter New String:').strip())

def popit():
    if len(stack)==0:
        print 'Cannot pop from an empty stack'
    else:
        x=len(stack)-1
        print 'Remove[ '+stack.pop()+' ]'
        
def viewstack():
    print stack

CMDs={'u':pushit,'o':popit,'v':viewstack}   

def showmenu():
    pr='''
pUsh
pOp
View
Quit
Enter choice:'''

    while True:
        while True:
            try:
                user_input=raw_input(pr)
                processed=user_input.strip()
                first=processed[0]
                low_first=first.lower()
            except (EOFError,KeyboardInterrupt,IndexError):
                low_first='q'

            print '\nYou picked:[%s]'%low_first
            if low_first not in 'uovq':
                print 'Invalid option,try again'
            else:
                break
        if low_first=='q':
            break
        CMDs[low_first]()               #通过字典的查询实现对函数的调用
if __name__=='__main__':
    showmenu()
