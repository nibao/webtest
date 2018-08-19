import fakeServerFactory from '../../../../libs/fake-server-factory';

export default fakeServerFactory(server => {
    /**
     * 获取服务器配置
     */
    server.respondWith('POST', /config\?method=getoemconfigbysection/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            product: 'Eisoo AnyShare'
        })
    ]);

    /**
     * 发送邮件
     */
    server.respondWith('POST', /message\?method=sendmail/, [
        200,
        { 'Content-Type': 'application/json' },
        ''
    ]);

    /**
     * 获取服务器配置
     */
    server.respondWith('POST', /auth1\?method=getconfig/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            https: false
        })
    ]);

    /**
     * 获取服务器地址配置
     */
    server.respondWith('POST', /redirect\?method=gethostinfo/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            host: 'anyshare.eisoo.com',
            https_port: 443,
            name: 'anyshare.eisoo.com',
            port: 80,
        })
    ]);

    /**
     * 获取用户信息
     */
    server.respondWith('POST', /user\?method=get/, [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({
            account: 'mao.zhengyang@eisoo.com',
            csflevel: 5,
            directdepinfos: [{
                depid: 'ea74e206-6599-11e4-867f-dcd2fc061e41',
                name: '组件开发组'
            }],
            ismanager: false,
            leakproofvalue: 3,
            mail: 'mao.zhengyang@eisoo.com',
            name: '毛正阳',
            needsecondauth: false,
            pwdcontrol: 0,
            roletypes: [],
            userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
            usertype: 2
        })
    ]);
});