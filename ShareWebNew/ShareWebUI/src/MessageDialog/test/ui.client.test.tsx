import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MessageDialog from '../ui.client';
import __ from '../locale'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('MessageDialog@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<MessageDialog></MessageDialog>)
            })

            it('渲染结果为Dialog组件，包含Panel PanelMain PanelFooter PanelButton', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                expect(wrapper.name()).to.equal('Dialog')
                expect(wrapper.find('Dialog Panel')).to.have.lengthOf(1)
                expect(wrapper.find('Dialog Panel PanelMain')).to.have.lengthOf(1)
                expect(wrapper.find('Dialog Panel PanelFooter')).to.have.lengthOf(1)
                expect(wrapper.find('Dialog Panel PanelFooter PanelButton')).to.have.lengthOf(1)
            });

            it('渲染的Dialog传入props width为400，没有title属性', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                expect(wrapper.prop('width')).to.equal(400)
                expect(wrapper.prop('title')).to.be.undefined
            });

            it('渲染结果中包含UIIcon，且props参数正确', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                const UIIconWrapper = wrapper.find('PanelMain UIIcon')
                expect(UIIconWrapper.prop('code')).to.equal('\uf076')
                expect(UIIconWrapper.prop('color')).to.equal('#5a8cb4')
                expect(UIIconWrapper.prop('size')).to.equal(40)
            });

            it('正确渲染传入的子组件', () => {
                const wrapper = shallow(
                    <MessageDialog>
                        <div>test</div>
                    </MessageDialog>
                )
                expect(wrapper.find('PanelMain').contains(<div>test</div>)).to.be.true
            });

            it('确认按钮渲染正确，type为submit，按钮内容为"确认"', () => {
                const wrapper = shallow(<MessageDialog></MessageDialog>)
                expect(wrapper.find('PanelButton').prop('type')).to.equal('submit')
                expect(wrapper.find('PanelButton').childAt(0).text()).to.equal(__('确定'))
            });

        })

        describe('#event', () => {
            it('不传递onConfirm到Dialog中，且点击确认按钮时，正确触发onConfirm回调', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<MessageDialog onConfirm={spy}></MessageDialog>)
                expect(wrapper.prop('onClose')).to.be.undefined
                wrapper.find('PanelButton').simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});