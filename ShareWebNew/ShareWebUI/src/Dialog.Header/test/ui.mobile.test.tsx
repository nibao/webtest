import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DialogHeader from '../ui.mobile';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('DialogHeader@mobile', () => {
        describe('#render', () => {

            it('渲染传入的子组件', () => {
                const wrapper = shallow(<DialogHeader><span>test</span></DialogHeader>);
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });

            it('closable props为true时应该渲染关闭按钮', () => {
                const wrapper = shallow(<DialogHeader closable={true}></DialogHeader>);
                expect(wrapper.find('LinkIcon')).to.have.lengthOf(1);
            });
        });
        describe('#event', () => {
            it('点击关闭按钮时，调用onClose props', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DialogHeader closable={true} onClose={spy}></DialogHeader>);
                wrapper.find('LinkIcon').simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});