import { expect } from 'chai';
import * as sinon from 'sinon';
import { sandboxStub } from '../../libs/test-helper';
import * as auth from '../auth/auth';

import { UserType, logout } from './logout';

describe('ShareWebCore', () => {
    describe('logout', () => {
        const sandbox = sinon.createSandbox();
        beforeEach('stub', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: auth,
                    moduleProp: [
                        'getID',
                        'getUserType',
                        'authlogout',
                        'thirdauthLogoff',
                        'wiseduLogoff'
                    ]
                }
            ]);
        });
        afterEach('restore', () => {
            sandbox.restore();
        });

        it('重置自动退出定时器#resetTimer（内部调用，无法测试）')

        describe('登出系统#logout', () => {
            it('非第三方登录的用户，直接本地退出', () => {
                const onLogoutSuccessSpy = sinon.spy();
                auth.getUserType.resolves(UserType.LocalUser);
                auth.authlogout.resolves();

                return logout(onLogoutSuccessSpy).then(() => {
                    expect(auth.authlogout.called).to.be.true;
                    expect(onLogoutSuccessSpy.calledWith('/')).to.be.true;
                });
            });

            describe('第三方登录', () => {
                describe('使用wisedu_v4', () => {
                    it('西南交大，登出AnyShare时不注销集成平台(无法测试，location.hostname只读)')
                    it('其他，注销集成平台', () => {
                        const onLogoutSuccessSpy = sinon.spy()
                        auth.getUserType.resolves(UserType.ThirdUser);
                        auth.getID.returns('wisedu_v4')
                        auth.wiseduLogoff.resolves('testurl')
                        return logout(onLogoutSuccessSpy).then(() => {
                            expect(auth.wiseduLogoff.calledWith(undefined, true)).to.be.true
                            expect(onLogoutSuccessSpy.calledWith('testurl')).to.be.true
                        })
                    });
                });

                it('使用wisedu_sync', () => {
                    const onLogoutSuccessSpy = sinon.spy()
                    auth.getUserType.resolves(UserType.ThirdUser);
                    auth.getID.returns('wisedu_sync')
                    auth.wiseduLogoff.resolves('testurl')
                    return logout(onLogoutSuccessSpy).then(() => {
                        expect(auth.wiseduLogoff.calledWith(undefined, true)).to.be.true
                        expect(onLogoutSuccessSpy.calledWith('testurl')).to.be.true
                    })
                });

                describe('sso第三方登出', () => {
                    it('配置了logoutUrl', () => {
                        const onLogoutSuccessSpy = sinon.spy()
                        auth.getUserType.resolves(UserType.ThirdUser);
                        auth.getID.returns('sso')
                        auth.thirdauthLogoff.resolves(
                            {
                                logoutUrl: 'http://logouturl.com',
                                authServer: 'http://anyshare.eisoo.com:8080/cas/login'
                            }
                        )
                        return logout(onLogoutSuccessSpy).then(() => {
                            expect(auth.thirdauthLogoff.called).to.be.true
                            expect(onLogoutSuccessSpy.calledWith('http://logouturl.com')).to.be.true
                        })
                    });

                    it('未配置logoutUrl', () => {
                        const onLogoutSuccessSpy = sinon.spy()
                        auth.getUserType.resolves(UserType.ThirdUser);
                        auth.getID.returns('sso')
                        auth.thirdauthLogoff.resolves(
                            {
                                authServer: 'http://anyshare.eisoo.com:8080/cas/login'
                            }
                        )
                        return logout(onLogoutSuccessSpy).then(() => {
                            expect(auth.thirdauthLogoff.called).to.be.true
                            expect(onLogoutSuccessSpy.calledWith('http://anyshare.eisoo.com:8080/cas/logout?service=')).to.be.true
                        })
                    });


                });
            });

            it('用户类型为三方用户类型，但是不存在第三方认证服务id，使用本地登出', () => {
                const onLogoutSuccessSpy = sinon.spy();
                auth.getUserType.resolves(UserType.ThirdUser);
                auth.getID.returns('')
                auth.authlogout.resolves();

                return logout(onLogoutSuccessSpy).then(() => {
                    expect(auth.authlogout.called).to.be.true;
                    expect(onLogoutSuccessSpy.calledWith('/')).to.be.true;
                });
            });
        });
    });
});
