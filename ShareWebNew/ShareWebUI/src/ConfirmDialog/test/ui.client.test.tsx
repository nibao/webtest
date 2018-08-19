import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ConfirmDialog from '../ui.client';
import __ from '../locale';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('ConfirmDialog@client', () => {
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
                expect(wrapper.find('PanelMain').contains(<div>test</div>)).to.be.true
            });

            it('不渲染关闭按钮和title', () => {
                const wrapper = shallow(<ConfirmDialog>test</ConfirmDialog>);
                expect(wrapper.prop('title')).to.be.undefined
                expect(wrapper.prop('onClose')).to.be.undefined
            });
        });

        describe('#event', () => {

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