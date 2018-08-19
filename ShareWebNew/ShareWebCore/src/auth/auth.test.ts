import { expect } from 'chai'
import { createSandbox } from 'sinon'
import { sandboxStub } from '../../libs/test-helper'

import * as auth1 from '../apis/eachttp/auth1/auth1'
import * as rsa from '../../util/rsa/rsa'
import * as user from '../user/user'
import * as eachttoUser from '../apis/eachttp/user/user';
import * as config from '../config/config'

import {
    encrypt,
    OS_TYPE,
    auth,
    login,
    getAuth,
    getID,
    getUserType,
    authByParams,
    loginByParams,
    extLogin,
    pathArgs,
    clear,
    buildURI,
    getVersion,
    buildLogoutUrl,
    authlogout,
    thirdauthLogoff,
} from './auth';



// AnyShare公钥
const PUBLIC_KEY = 'BB24BD0371A3141EE992761C574F1AA20010420C446144922C00F07EFB3C752' +
    '0D81210A3C66DEC43B75A2370D01CD1F23E1BFC93B907201F5116F29A2C8149' +
    'E2D2671313A0A78E455BBFC20B802BA1CBEE1EBBEDA50290F040F0FD4EBE89F' +
    '24DB546EBB6B16579675551B9016A1A6FDCE6F6933901395453885CF55369AD' +
    'B999';
describe('ShareWebCore', () => {
    describe('auth', () => {
        const sandbox = createSandbox();

        beforeEach('stub rsa模块下的rsaEncrypt函数', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: rsa,
                    moduleProp: 'rsaEncrypt'
                },
                {
                    moduleObj: auth1,
                    moduleProp: ['getNew', 'extLoginClient', 'getByThirdParty', 'logout']
                },
                {
                    moduleObj: user,
                    moduleProp: ['getFullInfo']
                },
                {
                    moduleObj: config,
                    moduleProp: ['getConfig']
                }, {
                    moduleObj: eachttoUser,
                    moduleProp: 'get'
                }
            ])
        })

        afterEach('restore stub', () => {
            sandbox.restore()
        })

        it('正确导出登录设备类型', () => {
            expect(OS_TYPE).deep.equal({
                UNKNOWN: 0,
                IOS: 1,
                ANDROID: 2,
                WINDOWS_PHONE: 3,
                WINDOWS: 4,
                MACOSX: 5,
                WEB: 6,
                MOBILEWEB: 7
            })
        });

        describe('使用AnyShare公钥进行加密', () => {
            it('传入字符串，正确调用rsaEncrypt使用正确的公钥加密', () => {
                encrypt('test');
                expect(rsa.rsaEncrypt.calledWith('test', PUBLIC_KEY)).to.be.true
            });
        });

        it('认证用户#auth', () => {
            auth('account', 'password', 1, { uuid: '12140661-e35b-4551-84cf-ce0e513d1596', vcode: '1abc', ismodif: false })
            expect(auth1.getNew.calledWith({
                account: 'account',
                password: encrypt('password'),
                deviceinfo: {
                    ostype: 1
                },
                vcodeinfo: {
                    uuid: '12140661-e35b-4551-84cf-ce0e513d1596',
                    vcode: '1abc',
                    ismodif: false
                }
            })).to.be.true
        })

        it('登录并获取用户信息#login', async () => {
            auth1.getNew.resolves({ userid: 'userid', tokenid: 'tokenid' })
            user.getFullInfo.resolves({ userid: 'userid1', tokenid: 'tokenid1' })
            expect(await login('account', 'password', 1, { uuid: '12140661-e35b-4551-84cf-ce0e513d1596', vcode: '1abc', ismodif: false }))
                .to.deep.equal({
                    userid: 'userid1',
                    tokenid: 'tokenid1'
                })
        })

        it('重定向#redirect(无法重写location.replace()，无法测试)')

        it('获取第三方配置#getAuth', async () => {
            const fakeThirdAuth = { authServer: 'authServer' }
            config.getConfig.resolves(fakeThirdAuth)
            expect(await getAuth()).to.deep.equal(fakeThirdAuth)
        });

        it('获取第三方认证ID#getID', async () => {
            const fakeThirdAuth = { id: 'id' }
            config.getConfig.resolves(fakeThirdAuth)
            expect(await getID()).to.equal('id')
        });

        it('获取登录用户类型#getUserType', async () => {
            eachttoUser.get.resolves({ usertype: 1 })
            expect(await getUserType()).to.equal(1)
        });

        it('第三方认证的参数#authByParams', async () => {
            const fakeThirdAuth = { id: 'id' }
            config.getConfig.resolves(fakeThirdAuth)
            auth1.getByThirdParty.resolves({ authOptions: 'authOptions' })
            const result = await authByParams({ parmas1: 'parmas1', parmas2: 'parmas2' })
            expect(auth1.getByThirdParty.calledWith({
                thirdpartyid: 'id',
                params: {
                    parmas1: decodeURIComponent('parmas1'),
                    parmas2: decodeURIComponent('parmas2')
                },
                deviceinfo: {
                    ostype: OS_TYPE.WEB
                }
            }))
            expect(result).to.deep.equal({ authOptions: 'authOptions' })
        });


        it('认证并登录#loginByParams', async () => {
            config.getConfig.resolves({ id: 'id' })
            auth1.getByThirdParty.resolves({ userid: 'userid', tokenid: 'tokenid' })
            user.getFullInfo.resolves({ fullInfo: 'fullInfo' })
            expect(await loginByParams()).to.deep.equal({ fullInfo: 'fullInfo' })
            expect(user.getFullInfo.calledWith('userid', 'tokenid'))
        });


        it('新人的第三方应用的appid认证#extLogin', async () => {
            auth1.extLoginClient.resolves({ userid: 'userid', tokenid: 'tokenid' })
            user.getFullInfo.resolves({ fullInfo: 'fullInfo' })
            expect(await extLogin({ account: 'account', appid: 'appid', key: 'key' })).to.deep.equal({ fullInfo: 'fullInfo' })
            expect(auth1.extLoginClient.calledWith({ account: 'account', appid: 'appid', key: 'key' })).to.be.true
        });

        it('解析第三方ticket#pathArgs', () => {
            expect(pathArgs('#/path1/path2?key1=value1&key2=value2/')).to.deep.equal({
                key1: 'value1',
                key2: 'value2'
            })
            expect(pathArgs('#/path1/path2/')).to.deep.equal({})
        });

        it('清除会话cookie#clear', () => {
            window.sessionStorage.setItem('login', 'login')
            expect(window.sessionStorage.getItem('login')).to.equal('login')
            clear()
            expect(window.sessionStorage.getItem('login')).to.be.null
        });

        it('构造认证URL#buildURI', async () => {
            config.getConfig.resolves({ config: { authServer: 'authServer' } })
            expect(await buildURI()).to.equal('authServer')
            expect(await buildURI('redirecturl')).to.equal('authServer?redirect_uri=redirecturl')
        });

        describe('获取金智认证版本#getVersion', () => {
            it('wisedu_v4', async () => {
                config.getConfig.resolves({ id: 'wisedu_v4' })
                expect(await getVersion()).to.equal('v4')
            });

            it('wisedu_sync', async () => {
                config.getConfig.resolves({ id: 'wisedu_sync' })
                expect(await getVersion()).to.equal('v5')
            });
        });

        // issue：http://jira.eisoo.com/browse/DAEG-23324
        it('构建退出URL#buildLogoutUrl#等待Bug修复再进行测试')

        it('wisedu注销#wiseduLogoff（依赖buildLogoutUrl）')

        describe('本地注销登录#authlogout', () => {
            it('外部平台,不注销token', async () => {
                window.sessionStorage.setItem('login', JSON.stringify('login'))

                expect(authlogout({ doNotLogoffToken: true })).to.be.an.instanceof(Promise)
                expect(await authlogout({ doNotLogoffToken: true })).to.be.undefined

                expect(window.sessionStorage.getItem('login')).to.be.null
            });

            it('WEB平台,服务器端注销请求成功', async () => {
                window.sessionStorage.setItem('login', JSON.stringify('login'))
                auth1.logout.resolves()

                expect(auth1.logout.calledWith({ ostype: 6 }))
                expect(await authlogout()).to.be.undefined
                expect(window.sessionStorage.getItem('login')).to.be.null

            });

            it('WEB平台,logout指定错误码注销', async () => {
                window.sessionStorage.setItem('login', JSON.stringify('login'))
                auth1.logout.rejects({ errcode: 401001 })

                expect(auth1.logout.calledWith({ ostype: 6 }))
                expect(await authlogout()).to.be.undefined
                expect(window.sessionStorage.getItem('login')).to.be.null

            });

            it('WEB平台,logout非指定错误码不注销', async () => {
                window.sessionStorage.setItem('login', JSON.stringify('login'))
                auth1.logout.rejects({ errcode: 401002 })

                expect(auth1.logout.calledWith({ ostype: 6 }))
                expect(await authlogout()).to.be.undefined
                expect(window.sessionStorage.getItem('login')).to.equal(JSON.stringify('login'))

            });
        })

        it('第三方登出#thirdauthLogoff', async () => {
            // 内部调用authlogout不再覆盖，只验证返回值
            config.getConfig.resolves({ config: { allConfig: 'allConfig' } })
            expect(await thirdauthLogoff({ doNotLogoffToken: true })).to.deep.equal({ allConfig: 'allConfig' })
        });

    })
})