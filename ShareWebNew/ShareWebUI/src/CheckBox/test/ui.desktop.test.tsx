import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import CheckBox from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('CheckBox@desktop', () => {
        describe('#render', () => {

            it('默认渲染', () => {
                shallow(<CheckBox />)
            });
            
            it('自定义input id', () => {
                const wrapper = shallow(<CheckBox id="test"/>)
                expect(wrapper.find('input').prop('id')).to.equal('test') 
            });

            it('input的type为checkbox', () => {
                const wrapper = shallow(<CheckBox />);
                expect(wrapper.find('input').prop('type')).to.equal('checkbox')
            })

            it('正确传递checked属性', () => {
                const wrapper = shallow(<CheckBox checked={true} />);
                expect(wrapper.find('input').prop('checked')).to.be.true
            });
        });

        describe('#event', () => {
            describe('未禁用时', () => {
                it('改变checked状态', () => {
                    const spy = sinon.spy();
                    const wrapper = mount(<CheckBox value="test" checked={true} onChange={spy} />);
                    wrapper.find('input').simulate('change', { target: { checked: false } });
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    expect(spy.firstCall.args).to.deep.equal([false, 'test'])
                });

                it('点击时触发onClick事件处理函数', () => {
                    const spy = sinon.spy();
                    const wrapper = mount(<CheckBox value="test" checked={true} onClick={spy} />);
                    wrapper.simulate('click')
                    expect(spy.calledOnce).to.be.true
                });

                it('checked状态变为true时正确触发onCheck', () => {
                    const onCheckSpy = sinon.spy();
                    const onChangeSpy = sinon.spy();
                    const wrapper = mount(<CheckBox value="test" checked={false} onCheck={onCheckSpy} onChange={onChangeSpy} />);
                    wrapper.find('input').simulate('change', { target: { checked: true } });
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    expect(onCheckSpy.firstCall.args).to.deep.equal(['test'])
                    expect(onChangeSpy.firstCall.args).to.deep.equal([true, 'test'])

                });

                it('checked状态变为false时正确触发onCheck', () => {
                    const onCheckSpy = sinon.spy();
                    const onUncheckSpy = sinon.spy();
                    const onChangeSpy = sinon.spy();
                    const wrapper = mount(<CheckBox value="test" checked={true} onCheck={onCheckSpy} onUncheck={onUncheckSpy} onChange={onChangeSpy} />);
                    wrapper.find('input').simulate('change', { target: { checked: false } });
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    expect(onCheckSpy.called).to.be.false
                    expect(onUncheckSpy.firstCall.args).to.deep.equal(['test'])
                    expect(onChangeSpy.firstCall.args).to.deep.equal([false, 'test'])

                });
            });

            describe('禁用时', () => {
                it('初始checked为true，点击无法改变checked，不会触发onChange onUnchecked onChecked', () => {
                    const onCheckSpy = sinon.spy();
                    const onUncheckSpy = sinon.spy();
                    const onChangeSpy = sinon.spy();
                    const wrapper = mount(<CheckBox disabled={true} checked={true} onCheck={onCheckSpy} onUncheck={onUncheckSpy} onChange={onChangeSpy} />);
                    wrapper.find('input').simulate('change', { target: { checked: false } });
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    expect(onCheckSpy.called).to.be.false
                    expect(onUncheckSpy.called).to.be.false
                    expect(onChangeSpy.called).to.be.false
                });

                it('初始checked为true，点击无法改变checked，不会触发onChange onUnchecked onChecked', () => {
                    const onCheckSpy = sinon.spy();
                    const onUncheckSpy = sinon.spy();
                    const onChangeSpy = sinon.spy();
                    const wrapper = mount(<CheckBox disabled={true} checked={false} onCheck={onCheckSpy} onUncheck={onUncheckSpy} onChange={onChangeSpy} />);
                    wrapper.find('input').simulate('change', { target: { checked: true } });
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    expect(onCheckSpy.called).to.be.false
                    expect(onUncheckSpy.called).to.be.false
                    expect(onChangeSpy.called).to.be.false
                });
            });
        });
    });
});