import time
import datetime
UserManual={}
Date={}

def newuser():
    prompt='����������û���:'
    timestamp=time.time()
    while True:
        name=raw_input(prompt)
        if name in UserManual.keys():
            prompt='���û����ѱ�ռ�ã�����������'
            continue
        else:
            break
    pwd=raw_input('�������������:')
    UserManual[name]=pwd
    Date[name]=timestamp

def olduser():
    name=raw_input('����������û���:')
    pwd=raw_input('�������������:')
    timestamp=time.time()
    time_difference=timestamp-Date[name]
    passwd=UserManual.get(name)
    if passwd==pwd:
        print '��ӭ�ٴε�¼',name
        
        if time_difference<14400:
            #��ʱ���ת��Ϊlocaltime
            time_local=time.localtime(timestamp)
            #��localtimeת��Ϊ�µ�ʱ���ʽ
            dt=time.strftime('%Y-%m-%d %H:%M:%S',time_local)
            print '����ϴε�¼ʱ����:',dt
        Date[name]=timestamp
    else:
        print '���벻��ȷ'

def showmenu():
    prompt='''
���û�ע������n
�Ѵ����û���¼����e
�˳��ý�������q
Enter choice:'''

    done=False
    while not done:
        chosen=False
        while not chosen:
            try:
                choice=raw_input(prompt).strip()[0].lower()#��¼�û�������ѡ��
            except(EOFError,KeyboardInterrupt):
                chioce='q'
            print '\nYou picked:[%s]'%choice
            if choice not in 'neq':
                print 'invalid option,try again'
            else:
                chosen=True #���û��������ʱ����������ѭ���ж�
        if choice=='q':
            done=True   #���û�����q��������ѭ��
        if choice=='n':
            newuser()
        if choice=='e':
            olduser()

if __name__=='__main__':
    showmenu()
