import { expect } from 'chai';
import { parse as parseURL } from 'url';
import { useFakeXHR } from '../../../../libs/fake-server-factory';
import { setup as setupOpenAPI } from '../../../openapi/openapi';
import * as auth1 from './auth1';

declare const { describe, it, before, after }

describe('ShareWebCore', () => {

    describe('apis', () => {
        describe('eachttp', () => {

            before('初始化userid和tokenid', () => {
                setupOpenAPI({
                    userid: '2a664704-5e18-11e3-a957-dcd2fc061e41',
                    tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298',
                });
            });

            after('清除userid和tokenid', () => {
                setupOpenAPI({
                    userid: undefined,
                    tokenid: undefined,
                });
            });


            describe('身份认证（旧）#auth1', () => {

                describe('获取服务器配置信息#getConfig', () => {

                    it('传入单个无关参数', (done) => {

                        useFakeXHR((requests, restore) => {
                            auth1.getConfig({ _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1');
                            expect(url.query).to.deep.equal({ method: 'getconfig' });
                            expect(JSON.parse(requests[0].requestBody)).equals(null);

                            restore();
                            done();
                        });

                    });
                });

                describe('登录（标准）#getNew', () => {

                    it('传入正确的必传参数，完整的可选参数deviceinfo（包含所有子属性），单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getNew({ account: 'mao.zhengyang', password: 'Ea8ek&ahP4ke_', deviceinfo: { name: 'My iPhone', ostype: 1, devicetype: 'iPhone X', udid: '54591197-b7e6-11e7-8a4e-38c98650ffed' }, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'getnew' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ account: 'mao.zhengyang', password: 'Ea8ek&ahP4ke_', deviceinfo: { name: 'My iPhone', ostype: 1, devicetype: 'iPhone X', udid: '54591197-b7e6-11e7-8a4e-38c98650ffed' } })

                            restore();
                            done();
                        })
                    });

                });


                describe('登录（西电ticket）#getByTicket', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getByTicket({ ticket: 'test', service: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')

                            expect(url.query).to.deep.equal({ method: 'getbyticket' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ ticket: 'test', service: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('登录（使用windows登录凭据）#getByADSession', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getByADSession({ adsession: 'test', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'getbyadsession' });
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ adsession: 'test' })

                            restore();
                            done();
                        })
                    })

                });


                describe('登录（信任的第三方应用appid）#extLoginClient', () => {

                    it('传入所有必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.extLoginClient({ account: 'mao.zhengyang', appid: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', key: '9afbf25e-be97-4f5f-8a28-2ed92b19a0f3', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'extloginclient' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ account: 'mao.zhengyang', appid: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', key: '9afbf25e-be97-4f5f-8a28-2ed92b19a0f3' })

                            restore();
                            done();
                        })
                    })

                });


                describe('登录web（信任的第三方应用appid）#extLoginWeb', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.extLoginWeb({ account: 'mao.zhengyang', appid: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', key: '9afbf25e-be97-4f5f-8a28-2ed92b19a0f3', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'extloginweb' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ account: 'mao.zhengyang', appid: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', key: '9afbf25e-be97-4f5f-8a28-2ed92b19a0f3' })

                            restore();
                            done();
                        })
                    })

                });

                describe('登录（使用第三方凭证）#getByThirdParty', () => {

                    it('传入正确的必传参数、完整的可选参数deviceinfo（包含所有子属性）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getByThirdParty({ thirdpartyid: 'anyshare', params: { ticket: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', code: '0' }, deviceinfo: { name: 'My iPhone', ostype: 1, devicetype: 'iPhone X', udid: '54591197-b7e6-11e7-8a4e-38c98650ffed' }, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'getbythirdparty' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ thirdpartyid: 'anyshare', params: { ticket: '5e9ccedf-31b2-4bd4-a83c-02ce1662c9fb', code: '0' }, deviceinfo: { name: 'My iPhone', ostype: 1, devicetype: 'iPhone X', udid: '54591197-b7e6-11e7-8a4e-38c98650ffed' }, })
                            restore();
                            done();
                        })
                    })

                });


                describe('登录外部应用（集成到anyshare）#getExtAppInfo', () => {

                    it('传入正确的必传参数、完整的可选参数params（包含所有子属性）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getExtAppInfo({ apptype: 123, params: { grant_type: 'test', scope: 'test' }, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'getextappinfo', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ apptype: 123, params: { grant_type: 'test', scope: 'test' } })
                            restore();
                            done();
                        })
                    })

                });


                describe('刷新身份凭证有效期#refreshToken', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.refreshToken({ userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298', expirestype: 2, _useless: true });
                            const url = parseURL(requests[0].url, true);
                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'refreshtoken', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298', expirestype: 2 })

                            restore();
                            done();
                        })
                    })

                });


                describe('回收身份凭证#revokeToken', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.revokeToken({ tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'revoketoken', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })

                            restore();
                            done();
                        })
                    })

                });


                describe('修改用户密码#modifyPassword', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.modifyPassword({ account: 'test', oldpwd: 'old', newpwd: 'new', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'modifypassword', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ account: 'test', oldpwd: 'old', newpwd: 'new' })

                            restore();
                            done();
                        })
                    });

                });


                describe('登出#logout', () => {

                    it('传入正确的必传参数、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.logout({ ostype: 1, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'logout', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ ostype: 1 })

                            restore();
                            done();
                        })
                    })

                });


                describe('二次安全设备认证#validateSecurityDevice', () => {

                    it('传入正确的必传参数（thirdpartyid为空字符串）、完整的可选参数params（包含所有子属性）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.validateSecurityDevice({ thirdpartyid: '', params: { account: '', key: '' }, _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'validatesecuritydevice', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ thirdpartyid: '', params: { account: '', key: '' } })

                            restore();
                            done();
                        })
                    })

                });

                describe('PC客户端卸载输入口令#checkUninstallPwd', () => {

                    it('传入正确的必传参数（uninstallpwd参数为空字符串）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.checkUninstallPwd({ uninstallpwd: '', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'checkuninstallpwd', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ uninstallpwd: '' })

                            restore();
                            done();
                        })
                    })

                });

                describe('获取验证码#getVcode', () => {

                    it('传入所有必传参数（uuid参数为空字符串）、单个无关参数', (done) => {
                        useFakeXHR((requests, restore) => {
                            auth1.getVcode({ uuid: '', _useless: true });

                            const url = parseURL(requests[0].url, true);

                            expect(url.pathname).equals('/v1/auth1')
                            expect(url.query).to.deep.equal({ method: 'getvcode', userid: '2a664704-5e18-11e3-a957-dcd2fc061e41', tokenid: '786946e4-32ec-43bc-aab8-fc4baa484298' })
                            expect(JSON.parse(requests[0].requestBody)).deep.equals({ uuid: '' })

                            restore();
                            done();
                        })
                    })

                });


            });
        });
    });
});