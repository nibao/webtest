import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import PlainButton from '../ui.mobile';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('PlainButton@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PlainButton></PlainButton>)
            })

            it('允许自定义type', () => {
                let wrapper: ShallowWrapper;

                /* 默认type为button */
                wrapper = shallow(
                    <PlainButton></PlainButton>
                );

                expect(wrapper.prop('type')).to.equal('button')

                /* 自定义type */
                wrapper = shallow(
                    <PlainButton type="submit"></PlainButton>
                );
                expect(wrapper.prop('type')).to.equal('submit')
            });

            it('禁用时，设置正确的样式，设置button的disabled', () => {
                let wrapper: ShallowWrapper;
                /* 默认为非禁用 */
                wrapper = shallow(
                    <PlainButton></PlainButton>
                );
                expect(wrapper.prop('disabled')).to.be.false

                /* 设置禁用 */
                wrapper = shallow(
                    <PlainButton disabled={true}></PlainButton>
                );
                expect(wrapper.prop('disabled')).to.be.true
            });

            it('正确按钮内容', () => {
                const wrapper = shallow(<PlainButton>test</PlainButton>);
                expect(wrapper.childAt(0).text()).to.equal('test')
            });
        })

        describe('#event', () => {
            it('未禁用时，点击触发onClick回调', () => {
                const spy = sinon.spy(),
                    wrapper = mount(<PlainButton onClick={spy}></PlainButton>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.true
            });

            it('禁用时，点击不触发onClick回调', () => {
                const spy = sinon.spy(),
                    wrapper = mount(<PlainButton disabled={true} onClick={spy}></PlainButton>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.false
            });
        });
    });
});