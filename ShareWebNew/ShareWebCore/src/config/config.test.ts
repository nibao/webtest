import { expect } from 'chai';
import * as config from './config';
import * as sinon from 'sinon';
import { sandboxStub } from '../../libs/test-helper'
import * as  auth1 from '../apis/eachttp/auth1/auth1';
import * as redirect from '../apis/eachttp/redirect/redirect';

const sandbox = sinon.createSandbox()

describe('ShareWebCore', () => {

    describe('config', () => {
        const fakeConfig = {
            https: true,
            oemconfig: {
                clientlogouttime: -1,
                indefiniteperm: true,
                maxpassexpireddays: -1,
                owasurl: 'https://officeonline.eisoo.com',
                rememberpass: true,
                wopiurl: 'http://officeonline.eisoo.com:8989'
            },
            thirdauth: {
                config: {
                    anyshareSSO: 'https://anyshare.eisoo.com/sso',
                    appId: 'ww5c833f03ea3b2f66',
                    appKey: 'aMwQBy_C83tJgYWY9l5bpO0e5IrwtJ3s2de6vWpuuuA',
                    authModule: 'WXEisooAuth',
                    authServer: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww5c833f03ea3b2f66&redirect_uri=https://anyshare.eisoo.com/sso&response_type=code&scope=snsapi_privateinfo&agentid=1000002&state=as#wechat_redirect',
                    hideThirdLogin: true,
                    logoutUrl: 'https://anyshare.eisoo.com',
                    matchUrl: 'https://anyshare.eisoo.com/#/sso',
                    syncModule: 'BaseSyncer'
                },
                id: 'wxeisoo'
            }
        }
        beforeEach(() => {
            sandboxStub(sandbox, [
                {
                    moduleObj: auth1,
                    moduleProp: 'getConfig'
                },
                {
                    moduleObj: redirect,
                    moduleProp: 'getHostInfo'
                }
            ])
        })

        afterEach(() => {
            sandbox.restore()
        })

        describe('获取缓存的配置信息#getConfig', () => {
            it('不指定获取配置项时：返回全部配置项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getConfig()).to.deep.equal(fakeConfig)
            });

            it('指定配置项，返回制定项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getConfig('https')).to.equal(true)
                expect(await config.getConfig('oemconfig.clientlogouttime')).to.equal(-1)
                expect(await config.getConfig('thirdauth.config.authModule')).to.equal('WXEisooAuth')
            })

        });


        describe('获取OEM配置信息#getOEMConfig', () => {

            it('不传参数时：应返回所有OEM配置项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getOEMConfig()).to.deep.equals(fakeConfig.oemconfig)
            })

            it('指定获取配置项时：应返回所指定的配置项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getOEMConfig('wopiurl')).to.deep.equals(fakeConfig.oemconfig.wopiurl)
                expect(await config.getOEMConfig('rememberpass')).to.deep.equals(fakeConfig.oemconfig.rememberpass)
            })

            it('没有OEM配置项时', async () => {
                auth1.getConfig.resolves({ ...fakeConfig, oemconfig: {} })
                expect(await config.getOEMConfig()).to.deep.equal({})
                expect(await config.getOEMConfig('wopiurl')).to.be.undefined
            })
        })


        describe('获取第三方认证配置信息#getThirdAuth', () => {

            it('不指定获取配置项时：应返回所有第三方认证配置项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getThirdAuth()).to.deep.equal(fakeConfig.thirdauth)
            })

            it('指定获取配置项时：应返回所指定第三方认证配置项', async () => {
                auth1.getConfig.resolves(fakeConfig)
                expect(await config.getThirdAuth('config')).to.deep.equals(fakeConfig.thirdauth.config)
                expect(await config.getThirdAuth('config.authServer')).to.deep.equal(fakeConfig.thirdauth.config.authServer)
            })

            it('没有第三方配置项时', async () => {
                auth1.getConfig.resolves({ ...fakeConfig, thirdauth: {} })
                expect(await config.getThirdAuth()).to.deep.equal({})
                expect(await config.getThirdAuth('config')).to.be.undefined
            })
        })


        describe('获取Web客户端访问端口#getWebClientHostInfo', () => {
            it('使用https', async () => {
                auth1.getConfig.resolves({ https: true })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.getWebClientHostInfo()).to.deep.equal({
                    protocol: 'https:',
                    host: 'anyshare.eisoo.com',
                    port: 443,
                })
            })

            it('使用http', async () => {
                auth1.getConfig.resolves({ https: false })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.getWebClientHostInfo()).to.deep.equal({
                    protocol: 'http:',
                    host: 'anyshare.eisoo.com',
                    port: 80
                })
            })
        })

        describe('构建Web客户端访问地址#buildWebClientURI', () => {
            it('path为空时，query为空时，构建地址正确', async () => {
                auth1.getConfig.resolves({ https: true })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.buildWebClientURI({})).to.equal('https://anyshare.eisoo.com:443/?')
            })

            it('path为空，query不为空时，构建地址正确', async () => {
                auth1.getConfig.resolves({ https: false })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.buildWebClientURI({ query: { option1: 'test1', option2: 2 } })).to.equal('http://anyshare.eisoo.com:80/?option1=test1&option2=2')

            })

            it('path不为空，query为空,时构建地址正确', async () => {
                auth1.getConfig.resolves({ https: true })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.buildWebClientURI({ path: 'testpath' })).to.equal('https://anyshare.eisoo.com:443/testpath?')
                expect(await config.buildWebClientURI({ path: '/testpath' })).to.equal('https://anyshare.eisoo.com:443/testpath?')
            })

            it('path，query都不为空，构建地址正确', async () => {
                auth1.getConfig.resolves({ https: false })
                redirect.getHostInfo.resolves({
                    host: 'anyshare.eisoo.com',
                    port: 80,
                    https_port: 443
                })
                expect(await config.buildWebClientURI({ path: 'testpath', query: { option1: 'test1' } })).to.equal('http://anyshare.eisoo.com:80/testpath?option1=test1')
                expect(await config.buildWebClientURI({ path: '/testpath', query: { option1: 'test1', option2: 2 } })).to.equal('http://anyshare.eisoo.com:80/testpath?option1=test1&option2=2')
            })
        })

    })
})
