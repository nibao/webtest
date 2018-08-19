#coding=utf-8
from sys import exit
from random import randint

def death():
    list=[u'你已经死了，你有点被这个吸引',u'做得好，但是你已经死了...驴子',u'如此失败的人',u'我有一只小狗更善于此道']
    #randint函数是random中的一个函数，用于生成随机数N，N为a,b之间的数字，包含a,b
    print list[randint(0,len(list)-1)]
    #exit(0)：无错误就退出；exit(1):有错误就退出
    exit(1)


def center():
    print u'来自#25星球的戈尔登侵入你的飞船并摧毁它'
    print u'全员阵亡，你是仅有的幸存者'
    print u'任务是从武器军械库得到中子破坏弹'
    print u'把武器放到船上，然后开动船'
    print u'逃生舱'
    print '\n'
    print u'当你跑到中央走廊底部的时候，你就可以看到武器军械库'
    print u'一个戈尔登跳了出来，红色的鳞状皮肤，黑暗的肮脏牙齿，邪恶的小丑服装'
    print u'仇恨在他身体上流淌。 他挡住了去的门'
    print u'武器库即将引爆，去炸死你'
    action=raw_input('>')
    if action=='shoot!':
        print 'a'
        print 'b'
        print 'c'
    elif action=='dodge!':
        print 'A'
        print 'B'
        print 'C'
    elif action=='tell a joke':
        print 'aa'
        print 'bb'
        print 'cc'
    else:
        print 'does not computer'
        print 'center_cor'
