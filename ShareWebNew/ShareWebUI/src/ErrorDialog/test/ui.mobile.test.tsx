import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ErrorDialog from '../ui.mobile';
import __ from '../locale';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('ErrorDialog@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ErrorDialog></ErrorDialog>)
            });

            it('渲染正确的title', () => {
                const wrapper = shallow(<ErrorDialog></ErrorDialog>)
                expect(wrapper.find('DialogHeader').childAt(0).text()).to.equal(__('提示'))
            });

            it('渲染正确的提示内容', () => {
                const wrapper = shallow(<ErrorDialog><div>test</div></ErrorDialog>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })

        describe('#event', () => {
            it('点击确认按钮调用onConfirm事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ErrorDialog onConfirm={spy}></ErrorDialog>)
                wrapper.find('DialogButton').simulate('click')
                 expect(spy.calledOnce).to.be.true
            });
        });
    });
});