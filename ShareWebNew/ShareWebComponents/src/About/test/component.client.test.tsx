import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import * as clientConfig from '../../../core/apis/client/config/config'
import * as eachttpConfig from '../../../core/apis/eachttp/config/config'
import { sandboxStub } from '../../../libs/test-helper';

import About from '../component.client';
import * as styles from '../styles.client.css'


const sandbox = sinon.createSandbox();
describe('ShareWebComponent', () => {
    describe('About', () => {
        before('stub调用到的外部依赖（getVersionInfo getLanguageInfo getOemConfigBySection）', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: clientConfig,
                    moduleProp: ['getVersionInfo', 'getLanguageInfo']
                },
                {
                    moduleObj: eachttpConfig,
                    moduleProp: ['getOemConfigBySection']
                }
            ])

            /* 
            * 设置默认响应
            * 可以在每个用例中覆盖
            */

            clientConfig.getLanguageInfo.resolves({
                language: 'zh_cn'
            })
            clientConfig.getVersionInfo.resolves({
                majorVersionNumber: '5.0.21',
                minorVersionNumber: '7543',
                versionData: '20180208'
            })
            eachttpConfig.getOemConfigBySection.resolves({
                'logo.png': 'base64url',
                copyright: 'copyrightContent'
            })
        })
        after('restore stub', () => {
            sandbox.restore()
        });

        it('正确显示图标', (done) => {
            const wrapper = shallow(<About />); // 只能在it内部渲染，外部不会被stub
            /* 
             * 必须在setTimout中进行断言 ：因为setState是异步的
             * 必须wrapper.update() ：因为enzyme不会因为state更新自动更新渲染结果,需要调用进行手动更新
             * 必须在setTimout中调用done：保证stub的函数不会被提前restore掉
            */
            setTimeout(() => {
                wrapper.update()
                expect(wrapper.find('img').prop('src')).to.equal('data:image/png;base64,base64url')
                done()
            }, 0);
        });

        it('正确显示版本信息', (done) => {
            const wrapper = shallow(<About />);
            setTimeout(() => {
                wrapper.update()
                expect(wrapper.find(`.${styles['version']}`).childAt(0).text()).to.include('5.0.21')
                expect(wrapper.find(`.${styles['release-date']}`).childAt(0).text()).to.include('2018/02/08')
                done()
            }, 0);
        });

        it('正确显示版权信息', (done) => {
            const wrapper = shallow(<About />);
            setTimeout(() => {
                wrapper.update()
                expect(wrapper.find(`.${styles['copyright']} Text`).childAt(0).text()).to.equal('copyrightContent')
                done()
            }, 0);
        });

        it('获取版本信息时抛错，显示错误信息', (done) => {
            clientConfig.getVersionInfo.rejects({
                errmsg: 'getVersionInfoErrmsg'
            })
            const wrapper = shallow(<About />);
            setTimeout(() => {
                wrapper.update()
                /* 仍然显示logo 和 copyright */
                expect(wrapper.find('img')).to.have.lengthOf(1)
                expect(wrapper.find(`.${styles['copyright']}`)).to.have.lengthOf(1)
                /* 不显示版本信息 */
                expect(wrapper.find(`.${styles['version']}`)).to.have.lengthOf(0)
                expect(wrapper.find(`.${styles['release-date']}`)).to.have.lengthOf(0)
                /* 显示错误信息 */
                expect(wrapper.find(`.${styles['version-error']}`).prop('title')).to.equal('getVersionInfoErrmsg')
                expect(wrapper.find(`.${styles['version-error']}`).text()).to.equal('getVersionInfoErrmsg')
                done()
            }, 0);
        });
    });
});