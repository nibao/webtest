import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import ClockBox from '../ui.desktop';
import __ from '../locale'

describe('ShareWebUI', () => {
    describe('ClockBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ClockBox />)
            });

            it('正确渲染', () => {
                const wrapper = shallow(<ClockBox />);
                expect(wrapper.find('TextBox')).have.lengthOf(3);
                expect(wrapper.find('label')).have.lengthOf(3);
                expect(wrapper.find('label').at(0).contains(__('时'))).to.be.true;
                expect(wrapper.find('label').at(1).contains(__('分'))).to.be.true;
                expect(wrapper.find('label').at(2).contains(__('秒'))).to.be.true;
            });
        });

        describe('#lifeCycle', () => {
            it('正确触发componentWillMount', () => {
                const spy = sinon.spy(ClockBox.prototype, 'componentWillMount');
                const wrapper = mount(<ClockBox seconds={3723} />);
                expect(spy.calledOnce).to.be.true;
                expect(wrapper.state()).to.deep.equal({
                    hours: 1,
                    minutes: 2,
                    seconds: 3
                });
                expect(wrapper.find('TextBox').at(0).prop('value')).to.be.equal(1);
                expect(wrapper.find('TextBox').at(1).prop('value')).to.be.equal(2);
                expect(wrapper.find('TextBox').at(2).prop('value')).to.be.equal(3);
            });

            it('正确触发componentWillReceiveProps', () => {
                const componentWillReceivePropsSpy = sinon.spy(ClockBox.prototype, 'componentWillReceiveProps')
                const spy = sinon.spy();
                const wrapper = mount(<ClockBox seconds={3723} onChange={spy} />);
                /* 不改变传入参数 */
                wrapper.setProps({ seconds: 3723 });
                expect(componentWillReceivePropsSpy.calledOnce).to.be.true;
                expect(spy.called).to.be.false;
                /* 改变传入参数 */
                wrapper.setProps({ seconds: 3724 });
                expect(componentWillReceivePropsSpy.calledTwice).to.be.true;
                expect(spy.calledWith(3724)).to.be.true;
            });

        });

        describe('#event', () => {
            it('输入合法值，正确改变值，触发onChange事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<ClockBox onChange={spy} />);

                wrapper.find('input').at(0).simulate('change', { target: { value: 12 } })
                expect(spy.calledOnce).to.be.true
                expect(spy.getCall(0).args[0]).to.equal(12 * 3600)
                expect(wrapper.find('input').at(0).prop('value')).to.equal(12)

                wrapper.find('input').at(1).simulate('change', { target: { value: 1 } })
                expect(spy.calledTwice).to.be.true
                expect(spy.getCall(1).args[0]).to.equal(12 * 3600 + 1 * 60)
                expect(wrapper.find('input').at(1).prop('value')).to.equal(1)

                wrapper.find('input').at(2).simulate('change', { target: { value: 59 } })
                expect(spy.calledThrice).to.be.true
                expect(spy.getCall(2).args[0]).to.equal(12 * 3600 + 1 * 60 + 59)
                expect(wrapper.find('input').at(2).prop('value')).to.equal(59)

            });

            it('输入不合法值，不改变值，不触发onChange事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<ClockBox onChange={spy} />);

                wrapper.find('input').at(0).simulate('change', { target: { value: -1 } })
                expect(spy.called).to.be.false
                expect(wrapper.find('input').at(0).prop('value')).to.equal('')

                wrapper.find('input').at(1).simulate('change', { target: { value: 60 } })
                expect(spy.called).to.be.false
                expect(wrapper.find('input').at(1).prop('value')).to.equal('')

                wrapper.find('input').at(2).simulate('change', { target: { value: 60 } })
                expect(spy.called).to.be.false
                expect(wrapper.find('input').at(2).prop('value')).to.equal('')

            });

        });
    });
});