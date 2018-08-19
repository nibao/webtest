import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import AccountDropMenu from '../component.desktop';
import * as styles from '../styles.desktop.css';
import __ from '../locale';


import { sandboxStub } from '../../../libs/test-helper';

import * as oem from '../../../core/oem/oem';
import * as config from '../../../core/config/config';
import * as auth from '../../../core/auth/auth'
import * as openapi from '../../../core/openapi/openapi';
import * as quota from '../../../core/apis/eachttp/quota/quota';

const sandbox = sinon.createSandbox();
describe('ShareWebComponent', () => {
    describe('AccountDropMenu', () => {
        beforeEach('stub getUserQuota getOEMConfByOptions getConfig eachttp', () => {
            window.sessionStorage.setItem('login', '{"userid":"99cccbfc-0bea-11e8-9469-005056bd7904","tokenid":"173aaa8d-c262-4d56-8832-a67a8e8dc1fc","account":"account","agreedtotermsofuse":false,"csflevel":5,"directdepinfos":[{"depid":"6a82637a-0bea-11e8-b373-005056bd7904","name":"test"}],"freezestatus":false,"ismanager":false,"leakproofvalue":3,"mail":"","name":"test1","needrealnameauth":false,"needsecondauth":false,"pwdcontrol":1,"roletypes":[],"telnumber":"","usertype":1}')
            sandboxStub(sandbox, [
                {
                    moduleObj: oem,
                    moduleProp: 'getOEMConfByOptions'
                },
                {
                    moduleObj: config,
                    moduleProp: 'getConfig'
                },
                {
                    moduleObj: auth,
                    moduleProp: ['getID', 'authlogout', 'thirdauthLogoff', 'wiseduLogoff']
                },
                {
                    moduleObj: openapi,
                    moduleProp: ['eachttp', 'getOpenAPIConfig']
                },
                {
                    moduleObj: quota,
                    moduleProp: 'getUserQuota'
                }
            ])

            /* 设置默认响应，可在具体测试用例中进行覆盖 */
            quota.getUserQuota.resolves({
                quotainfos: [
                    {
                        quota: 536870912,
                        used: 3087694
                    },
                    {
                        quota: 536870233,
                        used: 3020021
                    }
                ]
            })

            oem.getOEMConfByOptions.resolves({
                helper: '/download/help_AS_CN.pdf',
                userAgreement: 'userAgreement'
            })

            config.getConfig.resolves({
            })

            openapi.eachttp.resolves({
                usertype: 2
            })
        });

        afterEach('restore', () => {
            window.sessionStorage.removeItem('login')
            sandbox.restore()
        });

        it('正确显示触发区域（图标，用户显示名，下拉箭头）', (done) => {
            const wrapper = mount(<AccountDropMenu />) // 浅渲染无法渲染到触发区，因此需要使用全渲染
            setTimeout(() => {
                wrapper.update()
                /* 图标 */
                expect(wrapper.find(`.${styles['current']}`).find('UIIcon').at(0).prop('code')).to.equal('\uf01f')
                /* 用户显示名 */
                expect(wrapper.find(`.${styles['current']} .${styles['username']}`).text()).to.equal('test1')
                /* 下拉箭头 */
                expect(wrapper.find(`.${styles['current']}`).find('UIIcon').at(1).prop('code')).to.equal('\uf04c')
                /* PopOver会插入元素到body中，因此需要手动取消挂载 */
                wrapper.unmount()
                done()
            }, 0);

        });

        it('鼠标移入正确显示下拉区域（图标 用户信息 存储使用信息 可操作选项）', (done) => {
            const wrapper = shallow(<AccountDropMenu />) // 全渲染无法在当前的wrapper中获取到下拉区域，因为PopOver将内容去插入到body中
            setTimeout(() => {
                wrapper.update()
                /* 图标 */
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf01f')
                /* 用户显示名 */
                expect(wrapper.find(`.${styles['user-info']} Text`).at(0).childAt(0).text()).to.equal('test1')
                /* 用户账户名 */
                expect(wrapper.find(`.${styles['user-info']} Text`).at(1).childAt(0).text()).to.equal('account')
                /* 进度条 */
                expect(wrapper.find(`.${styles['stack-bar']} Stack`).at(0).prop('rate')).to.equal(0.0056882564558890965)
                expect(wrapper.find(`.${styles['stack-bar']} Stack`).at(1).prop('rate')).to.equal(0.9943117435441109)
                /* 存储信息 */
                expect(wrapper.find(`.${styles['quota-info']}`).text()).to.equal('5.82MB/1024.00MB')
                /* 通用可操作选项 */
                expect(wrapper.find('PopMenuItem').last().prop('label')).to.equal(__('退出'))
                done()
            }, 0);

        });

        describe('修改密码', () => {
            it('当用户为本地用户,显示修改密码选项，点击修改密码选项时，无参数调用props.doChangePassword', (done) => {
                openapi.eachttp.resolves({
                    usertype: 1
                })
                const doChangePasswordSpy = sinon.spy()
                const wrapper = shallow(<AccountDropMenu doChangePassword={doChangePasswordSpy} />)
                setTimeout(() => {
                    wrapper.update()
                    expect(wrapper.find('PopMenuItem').first().prop('label')).to.equal(__('修改密码'))
                    wrapper.find('PopMenuItem').first().simulate('click')
                    expect(doChangePasswordSpy.args[0][0]).to.be.undefined
                    done()
                }, 0);
            });

            it('当用户不为本地用户，且配置了passwordUrl时，显示修改密码选项，调用props.doChangePassword时传入passwordUrl', (done) => {
                openapi.eachttp.resolves({
                    usertype: 2
                })
                config.getConfig.resolves({
                    third_pwd_modify_url: 'changepassword.com',
                })
                const doChangePasswordSpy = sinon.spy()
                const wrapper = shallow(<AccountDropMenu doChangePassword={doChangePasswordSpy} />)
                setTimeout(() => {
                    wrapper.update()
                    expect(wrapper.find('PopMenuItem').first().prop('label')).to.equal(__('修改密码'))
                    wrapper.find('PopMenuItem').first().simulate('click')
                    expect(doChangePasswordSpy.args[0][0]).to.equal('changepassword.com')
                    done()
                }, 0);
            });
        });

        describe('管理控制台', () => {
            it('当用户为管理员时，显示管理控制台选项，点击时正确调用props.doOpenConsole', (done) => {
                window.sessionStorage.setItem('login', '{"userid":"99cccbfc-0bea-11e8-9469-005056bd7904","tokenid":"173aaa8d-c262-4d56-8832-a67a8e8dc1fc","account":"account","agreedtotermsofuse":false,"csflevel":5,"directdepinfos":[{"depid":"6a82637a-0bea-11e8-b373-005056bd7904","name":"test"}],"freezestatus":false,"ismanager":true,"leakproofvalue":3,"mail":"","name":"test1","needrealnameauth":false,"needsecondauth":false,"pwdcontrol":1,"roletypes":[],"telnumber":"","usertype":1}')
                const doOpenConsoleSpy = sinon.spy()
                openapi.getOpenAPIConfig.returns({ host: 'consolehost' })
                const wrapper = shallow(<AccountDropMenu doOpenConsole={doOpenConsoleSpy} />)
                setTimeout(() => {
                    wrapper.update()
                    expect(wrapper.find('PopMenuItem').first().prop('label')).to.equal(__('管理控制台'))
                    wrapper.find('PopMenuItem').first().simulate('click')
                    expect(doOpenConsoleSpy.calledWith('consolehost:8000')).to.be.true
                    done()
                }, 0);
            });
        });

        describe('打开客户端', () => {
            it('当前为windows，并且禁用设备类型不是windows，则显示打开客户端选项，点击时正确调用props.doOpenClient', (done) => {
                const doOpenClientSpy = sinon.spy()
                openapi.getOpenAPIConfig.returns({ host: 'host' })
                const wrapper = shallow(<AccountDropMenu doOpenClient={doOpenClientSpy} />)
                setTimeout(() => {
                    wrapper.update()
                    expect(wrapper.find('PopMenuItem').first().prop('label')).to.equal(__('打开客户端'))
                    wrapper.find('PopMenuItem').first().simulate('click')
                    expect(doOpenClientSpy.calledWith('host')).to.be.true
                    done()
                }, 0);
            });

            it('当前为windows，windows客户端被禁用，不显示打开客户端', (done) => {
                config.getConfig.resolves({
                    forbid_ostype: '16'
                })
                const wrapper = shallow(<AccountDropMenu />)
                setTimeout(() => {
                    wrapper.update()
                    wrapper.find('PopMenuItem').forEach(node => {
                        expect(node.prop('label')).not.to.be.equal(__('打开客户端'))
                    })
                    done()
                }, 0);
            });

        });

        describe('退出', () => {
            it('非第三方登录的用户，直接本地退出', (done) => {
                /* 模拟为本地用户登录 */
                openapi.eachttp.resolves({
                    usertype: 1
                })
                auth.authlogout.resolves()
                const doLogoutSpy = sinon.spy()
                const wrapper = shallow(<AccountDropMenu doLogout={doLogoutSpy} />);

                /* 保证state更新完成后再执行，因为handleLogout的逻辑依赖state */
                setTimeout(() => {
                    wrapper.find('PopMenuItem').last().simulate('click')
                }, 0);

                /* doLogout 在 authlogout的then中被调用，因此需要在下一个时钟断言*/
                setTimeout(() => {
                    expect(auth.authlogout.called).to.be.true
                    expect(doLogoutSpy.calledWith('/')).to.be.true
                    done()
                }, 0);
            });

            it('wisedu_v4第三方平台', (done) => {
                /* location.hostname只读，无法模拟西南交大 */
                /* 模拟为第三方用户登录 */
                openapi.eachttp.resolves({
                    usertype: 3
                })
                auth.getID.resolves('wisedu_v4')
                auth.wiseduLogoff.resolves('logoutUrl')
                const doLogoutSpy = sinon.spy()
                const wrapper = shallow(<AccountDropMenu doLogout={doLogoutSpy} />);

                setTimeout(() => {
                    wrapper.find('PopMenuItem').last().simulate('click')
                }, 0);

                setTimeout(() => {
                    expect(auth.wiseduLogoff.calledWith(undefined, true)).to.be.true
                    expect(doLogoutSpy.calledWith('logoutUrl')).to.be.true
                    done()
                }, 0);

            });


            it('wisedu_sync第三方平台', (done) => {
                /* 模拟为第三方用户登录 */
                openapi.eachttp.resolves({
                    usertype: 3
                })
                auth.getID.resolves('wisedu_sync')
                auth.wiseduLogoff.resolves('logoutUrl')
                const doLogoutSpy = sinon.spy()
                const wrapper = shallow(<AccountDropMenu doLogout={doLogoutSpy} />);

                setTimeout(() => {
                    wrapper.find('PopMenuItem').last().simulate('click')
                }, 0);

                setTimeout(() => {
                    expect(auth.wiseduLogoff.calledWith(undefined, true)).to.be.true
                    expect(doLogoutSpy.calledWith('logoutUrl')).to.be.true
                    done()
                }, 0);

            });

            describe('sso登录', () => {
                it('配置了logoutUrl', (done) => {
                    /* 模拟为第三方用户登录 */
                    openapi.eachttp.resolves({
                        usertype: 3
                    })
                    auth.getID.resolves('ssoid')
                    auth.thirdauthLogoff.resolves({
                        logoutUrl: 'logoutUrl'
                    })
                    const doLogoutSpy = sinon.spy()
                    const wrapper = shallow(<AccountDropMenu doLogout={doLogoutSpy} />);

                    setTimeout(() => {
                        wrapper.find('PopMenuItem').last().simulate('click')
                    }, 0);

                    setTimeout(() => {
                        expect(doLogoutSpy.calledWith('logoutUrl')).to.be.true
                        done()
                    }, 0);
                });

                it('配置了authServer', (done) => {
                    /* 模拟为第三方用户登录 */
                    openapi.eachttp.resolves({
                        usertype: 3
                    })
                    auth.getID.resolves('ssoid')
                    auth.thirdauthLogoff.resolves({
                        authServer: 'http://192.168.137.113:8080/cas/login'
                    })
                    const doLogoutSpy = sinon.spy()
                    const wrapper = shallow(<AccountDropMenu doLogout={doLogoutSpy} />);

                    setTimeout(() => {
                        wrapper.find('PopMenuItem').last().simulate('click')
                    }, 0);

                    setTimeout(() => {
                        expect(doLogoutSpy.calledWith('http://192.168.137.113:8080/cas/logout?service=')).to.be.true
                        done()
                    }, 0);
                });
            });

        });

    });
});