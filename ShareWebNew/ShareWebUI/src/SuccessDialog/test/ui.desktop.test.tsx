import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SuccessDialog from '../ui.desktop';
import UIIcon from '../../UIIcon/ui.desktop'
import __ from '../locale';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('SuccessDialog@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SuccessDialog></SuccessDialog>)
            })

            it('Dialog宽度设置为400，title为“提示”', () => {
                const wrapper = shallow(<SuccessDialog></SuccessDialog>)
                expect(wrapper.prop('width')).to.equal(400)
                expect(wrapper.prop('title')).to.equal(__('提示'))
            });

            it('渲染正确的UIIcon', () => {
                const wrapper = shallow(<SuccessDialog></SuccessDialog>)
                expect(wrapper.contains(<UIIcon
                    code={'\uf0a2'}
                    color={'#54A67D'}
                    size={40}
                />)).to.be.true
            });

            it('渲染正确的内容', () => {
                const wrapper = shallow(
                    <SuccessDialog>
                        <div>test</div>
                    </SuccessDialog>
                )
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('只渲染确定按钮，并且按钮文字内容正确', () => {
                const wrapper = shallow(<SuccessDialog></SuccessDialog>)
                expect(wrapper.find('PanelButton')).to.have.lengthOf(1)
                expect(wrapper.find('PanelButton').prop('type')).to.equal('submit')
                expect(wrapper.find('PanelButton').childAt(0).text()).to.equal(__('确定'))
            });
        })

        describe('#event', () => {
            const onConfirmSpy = sinon.spy()
            const wrapper = shallow(<SuccessDialog onConfirm={onConfirmSpy}></SuccessDialog>)
            it('正确传递onConfirm事件处理到Dialog中', () => {
                expect(wrapper.prop('onClose')).to.equal(onConfirmSpy)
            });

            it('点击确定按钮，调用onConfirm回调函数', () => {
                wrapper.find('PanelButton').simulate('click')
                expect(onConfirmSpy.calledOnce).to.be.true
            });
        });
    });
});