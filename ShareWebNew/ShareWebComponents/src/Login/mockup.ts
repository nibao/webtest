import fakeServerFactory from '../../libs/fake-server-factory';

export default fakeServerFactory(server => {
    /**
     * 获取服务器配置
     */
    server.respondWith('POST', /auth1\?method=getconfig/, [
        200,
        { 'Content-Type': 'application/json' },
        ''
    ]);

    /**
     * 用户鉴权
     */
    server.respondWith('POST', /auth1\?method=getnew/, xhr => {
        const { account } = JSON.parse(xhr.requestBody);

        switch (account) {
            case 'wrongPassword':
                return xhr.respond(401, { 'Content-Type': 'application/json' }, JSON.stringify({
                    errcode: 401003
                }));

            case 'expiredPassword':
                return xhr.respond(401, { 'Content-Type': 'application/json' }, JSON.stringify({
                    errcode: 401012
                }));

            case 'initialPassword':
                return xhr.respond(401, { 'Content-Type': 'application/json' }, JSON.stringify({
                    errcode: 401017
                }));

            case 'lowPassword':
                return xhr.respond(401, { 'Content-Type': 'application/json' }, JSON.stringify({
                    errcode: 401013
                }));

            default:
                return xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({
                    expires: 3600,
                    needmodifypassword: false,
                    tokenid: 'cf3aba7b-4781-420e-b88a-f4f3c4ebfe60',
                    userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                }));
        }
    });

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