import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LinkButton from '../ui.mobile';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('LinkButton@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<LinkButton></LinkButton>)
            })

            it('渲染结果为a标签', () => {
                const wrapper = shallow(<LinkButton></LinkButton>)
                expect(wrapper.type()).to.equal('a')
            });

            it('禁用拖拽', () => {
                const wrapper = shallow(<LinkButton></LinkButton>)
                expect(wrapper.prop('draggable')).to.equal(false)
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<LinkButton className="test"></LinkButton>)
                expect(wrapper.hasClass('test')).to.be.true
            });
        })
        describe('#event', () => {
            it('未禁用时，点击触发onClick', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkButton onClick={spy}></LinkButton>)
                wrapper.simulate('click')
                expect(spy.calledOnce).to.be.true
            });
            it('禁用时，点击不触发触发onClick', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<LinkButton disabled={true} onClick={spy}></LinkButton>)
                wrapper.simulate('click')
                expect(spy.called).to.be.false
            });
        });
    });
});