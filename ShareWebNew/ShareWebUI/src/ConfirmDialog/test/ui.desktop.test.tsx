import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import ConfirmDialog from '../ui.desktop';
import __ from '../locale';


describe('ShareWebUI', () => {
    describe('ConfirmDialog@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ConfirmDialog></ConfirmDialog>)
            });

            it('正确渲染确认取消按钮', () => {
                const wrapper = shallow(<ConfirmDialog>test</ConfirmDialog>);
                expect(wrapper.find('PanelButton').at(0).contains(__('确定'))).to.be.true
                expect(wrapper.find('PanelButton').at(0).prop('type')).to.equal('submit')
                expect(wrapper.find('PanelButton').at(1).contains(__('取消'))).to.be.true
            });

            it('正确渲染内容', () => {
                const wrapper = shallow(<ConfirmDialog><div>test</div></ConfirmDialog>);
                expect(wrapper.find('PanelMain UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('PanelMain UIIcon').prop('code')).to.equal('\uf077')              
                expect(wrapper.find('PanelMain').contains(<div>test</div>)).to.be.true
            });

            it('渲染关闭按钮和title', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ConfirmDialog onCancel={spy}>test</ConfirmDialog>);
                expect(wrapper.prop('title')).to.be.equal(__('提示'))
                expect(wrapper.prop('onClose')).to.be.equal(spy);
            });
        });

        describe('#event', () => {
            it('正确传递onClose回调函数到Dialog中', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ConfirmDialog onCancel={spy}>test</ConfirmDialog>);
                expect(wrapper.prop('onClose')).to.equal(spy);
            });

            it('点击确认按钮，调用onConfirm进行处理', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ConfirmDialog onConfirm={spy}>test</ConfirmDialog>);
                wrapper.find('PanelButton').at(0).simulate('click');
                expect(spy.calledOnce).to.be.true
            });

            it('点击取消按钮，正确调用onCancel进行处理', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<ConfirmDialog onCancel={spy}>test</ConfirmDialog>);
                wrapper.find('PanelButton').at(1).simulate('click');
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});