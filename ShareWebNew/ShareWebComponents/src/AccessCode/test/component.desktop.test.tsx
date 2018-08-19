import * as React from 'react';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import AccessCode from '../component.desktop';
import __ from '../locale'

import { sandboxStub } from '../../../libs/test-helper';
import * as linkconfig from '../../../core/linkconfig/linkconfig';
import * as link from '../../../core/apis/efshttp/link/link';


const sandbox = sinon.createSandbox();
describe('ShareWebComponent', () => {
    describe('AccessCode', () => {

        it('正确渲染输入框', () => {
            const wrapper = shallow(<AccessCode />)
            expect(wrapper.find('TextBox')).to.have.lengthOf(1)
            expect(wrapper.find('TextBox').prop('placeholder')).to.equal(__('请输入文件提取码'))
        });

        it('正确渲染 提取文件 按钮', () => {
            const wrapper = shallow(<AccessCode />)
            expect(wrapper.find('Button')).to.have.lengthOf(1)
            expect(wrapper.find('Button').childAt(0).text()).to.equal(__('提取文件'))
        });
    })

    describe('输入提取码', () => {
        it('输入合法的提取码', () => {
            const wrapper = mount(<AccessCode />)
            wrapper.find('input').simulate('change', { target: { value: '123456' } })
            expect(wrapper.find('TextBox').prop('value')).to.equal('123456')

            wrapper.find('input').simulate('change', { target: { value: '123Abc' } })
            expect(wrapper.find('TextBox').prop('value')).to.equal('123Abc')
        });

        it('输入不合法的提取码，无法成功输入', () => {
            const wrapper = mount(<AccessCode />)
            /* 模拟输入只会触发一次onChange，不会输入一个字符触发一次 */
            wrapper.find('input').simulate('change', { target: { value: '*' } })
            expect(wrapper.find('TextBox').prop('value')).to.equal('')

            wrapper.find('input').simulate('change', { target: { value: '1234567' } })
            expect(wrapper.find('TextBox').prop('value')).to.equal('')
        });
    });

    describe('提取文件', () => {
        beforeEach('stub getLinkByAccessCode buildLinkHref 外部模块', () => {
            sandboxStub(sandbox, [
                {
                    moduleObj: link,
                    moduleProp: 'getLinkByAccessCode'
                },
                {
                    moduleObj: linkconfig,
                    moduleProp: 'buildLinkHref'
                }
            ])
        });

        afterEach('restore Stub', () => {
            sandbox.restore()
        });

        it('提取码正确,正确调用onGetLink', (done) => {
            const onGetLinkSpy = sinon.spy()
            const wrapper = mount(<AccessCode onGetLink={onGetLinkSpy} />)

            /* 模拟模块返回值为提取码正确时的返回值 */
            link.getLinkByAccessCode.resolves({ link: 'linkid' })
            linkconfig.buildLinkHref.resolves('http://anyshare.eisoo.com:8080/link/linkid')

            wrapper.find('input').simulate('change', { target: { value: '123456' } })
            wrapper.find('button').simulate('click')

            setTimeout(() => {
                wrapper.update()
                expect(wrapper.contains(__('提取码不存在'))).to.be.false
                expect(onGetLinkSpy.calledWith('http://anyshare.eisoo.com:8080/link/linkid')).to.be.true
                done()
            }, 0)
        });

        it('提取码错误，显示 提取码错误 提示信息', (done) => {
            const onGetLinkSpy = sinon.spy()
            const wrapper = mount(<AccessCode onGetLink={onGetLinkSpy} />)

            /* 模拟模块返回值为提取码不存在时的返回值 */
            link.getLinkByAccessCode.resolves({})

            wrapper.find('input').simulate('change', { target: { value: '123456' } })
            wrapper.find('button').simulate('click')

            setTimeout(() => {
                wrapper.update()
                expect(wrapper.contains(__('提取码不存在'))).to.be.true
                expect(onGetLinkSpy.called).to.be.false
                done()
            }, 0)
        });
    });
});