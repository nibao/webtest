import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ErrorDialog from '../ui.desktop';
import __ from '../locale';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('ErrorDialog@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ErrorDialog></ErrorDialog>)
            });

            it('width prop为400', () => {
                const wrapper = shallow(<ErrorDialog></ErrorDialog>)
                expect(wrapper.prop('width')).to.equal(400)
            });

            it('渲染正确的提示内容', () => {
                const wrapper = shallow(<ErrorDialog><div>test</div></ErrorDialog>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('渲染正确的UIIcon', () => {
                const wrapper = shallow(<ErrorDialog></ErrorDialog>)
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf075');
            });

            it('渲染正确的确认按钮', () => {
                const wrapper = shallow(<ErrorDialog></ErrorDialog>)
                expect(wrapper.find('PanelButton')).to.have.lengthOf(1)                
                expect(wrapper.find('PanelButton').childAt(0).text()).to.equal(__('确定'))                
            });

        });

        describe('#event', () => {
            it('点击确认按钮调用onConfirm事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ErrorDialog onConfirm={spy}></ErrorDialog>)
                wrapper.find('PanelButton').simulate('click')
                 expect(spy.calledOnce).to.be.true
            });
        });
    });
});