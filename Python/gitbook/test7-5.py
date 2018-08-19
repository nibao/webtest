import time
import datetime
UserManual={}
Date={}

def newuser():
    prompt='请输入你的用户名:'
    timestamp=time.time()
    while True:
        name=raw_input(prompt)
        if name in UserManual.keys():
            prompt='该用户名已被占用，请重新输入'
            continue
        else:
            break
    pwd=raw_input('请输入你的密码:')
    UserManual[name]=pwd
    Date[name]=timestamp

def olduser():
    name=raw_input('请输入你的用户名:')
    pwd=raw_input('请输入你的密码:')
    timestamp=time.time()
    time_difference=timestamp-Date[name]
    passwd=UserManual.get(name)
    if passwd==pwd:
        print '欢迎再次登录',name
        
        if time_difference<14400:
            #将时间戳转换为localtime
            time_local=time.localtime(timestamp)
            #将localtime转换为新的时间格式
            dt=time.strftime('%Y-%m-%d %H:%M:%S',time_local)
            print '你的上次登录时间是:',dt
        Date[name]=timestamp
    else:
        print '密码不正确'

def showmenu():
    prompt='''
新用户注册输入n
已存在用户登录输入e
退出该界面输入q
Enter choice:'''

    done=False
    while not done:
        chosen=False
        while not chosen:
            try:
                choice=raw_input(prompt).strip()[0].lower()#记录用户的输入选择
            except(EOFError,KeyboardInterrupt):
                chioce='q'
            print '\nYou picked:[%s]'%choice
            if choice not in 'neq':
                print 'invalid option,try again'
            else:
                chosen=True #当用户输入符合时，跳出输入循环判断
        if choice=='q':
            done=True   #当用户输入q，跳出该循环
        if choice=='n':
            newuser()
        if choice=='e':
            olduser()

if __name__=='__main__':
    showmenu()
