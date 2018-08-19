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

def manage():
    prompt='''
�����������ֲ���
ɾ������:d
��ʾ�����û���Ϣ:s
Enter choice:'''
    done=False
    while not done:
        chosen=False
        while not chosen:
            choice=raw_input(prompt).strip()[0].lower()
            print 'You picked:[%s]'%choice
            if choice not in 'ds':
                print 'invalid option,try again'
            else:
                chosen=True #���û��������ʱ����������ѭ���ж�
        if choice=='d':
            print delete()
            break
        if choice=='s':
            show()
            
def delete():
    print UserManual
    name=raw_input('��������ɾ�����û�������')
    if name in UserManual.keys():
        del UserManual[name]
        return UserManual
    else:
        print '���û�������'

def show():
    print UserManual

def showmenu():
    prompt='''
���û�ע������:n
�Ѵ����û���¼����:e
�˳��ý�������:q
�����������:m
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
            if choice not in 'neqm':
                print 'invalid option,try again'
            else:
                chosen=True #���û��������ʱ����������ѭ���ж�
        if choice=='q':
            done=True   #���û�����q��������ѭ��
        if choice=='n':
            newuser()
        if choice=='e':
            olduser()
        if choice=='m':
            manage()

if __name__=='__main__':
    showmenu()
