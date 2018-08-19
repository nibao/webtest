import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper, mount } from 'enzyme';
import RadioBox from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('RadioBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<RadioBox />)
            })

            it('input类型为radio', () => {
                const wrapper = shallow(<RadioBox />)
                expect(wrapper.prop('type')).to.equal('radio')
            });

            it('允许自定义id', () => {
                const wrapper = shallow(<RadioBox id="testId" />)
                expect(wrapper.prop('id')).to.equal('testId')
            });

            it('允许自定义name', () => {
                const wrapper = shallow(<RadioBox name="testName" />)
                expect(wrapper.prop('name')).to.equal('testName')
            });

            it('允许自定义value', () => {
                const wrapper = shallow(<RadioBox value="testValue" />)
                expect(wrapper.prop('value')).to.equal('testValue')
            });

            it('允许禁用', () => {
                const wrapper = shallow(<RadioBox disabled={true} />)
                expect(wrapper.prop('disabled')).to.be.true
            });

            it('允许自定义defaultChecked', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.prop('defaultChecked')).to.be.true

                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.prop('defaultChecked')).to.be.true
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<RadioBox className="test" />)
                expect(wrapper.prop('className')).to.equal('test')
            });
        })

        describe('#event', () => {
            describe('禁用时', () => {
                it('单选由选中到非选中，不触发onChange事件回调，不触发onUncheck回调,不触发onCheck事件回调', () => {
                    const onChangeSpy = sinon.spy(),
                        onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = mount(
                            <RadioBox
                                disabled={true}
                                checked={true}
                                onChange={onChangeSpy}
                                onUncheck={onUncheckSpy}
                                onCheck={onCheckSpy}
                            />
                        );
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    wrapper.find('input').simulate('change', { target: { checked: false } })
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    expect(onChangeSpy.called).to.be.false
                    expect(onUncheckSpy.called).to.be.false
                    expect(onCheckSpy.called).to.be.false

                });

                it('单选由非选中到选中，不触发onChange事件回调，不触发onCheck回调，不触发onCheck事件回调', () => {
                    const onChangeSpy = sinon.spy(),
                        onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = mount(
                            <RadioBox
                                disabled={true}
                                checked={false}
                                onChange={onChangeSpy}
                                onUncheck={onUncheckSpy}
                                onCheck={onCheckSpy}
                            />
                        );
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    wrapper.find('input').simulate('change', { target: { checked: true } })
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    expect(onChangeSpy.called).to.be.false
                    expect(onUncheckSpy.called).to.be.false
                    expect(onCheckSpy.called).to.be.false
                });
            });

            describe('未禁用时', () => {
                it('单选由选中到非选中，正确触发onChange事件回调，正确触发onUncheck回调，不触发onUncheck事件回调', () => {
                    const onChangeSpy = sinon.spy(),
                        onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = mount(
                            <RadioBox
                                checked={true}
                                onChange={onChangeSpy}
                                onUncheck={onUncheckSpy}
                                onCheck={onCheckSpy}
                            />
                        );
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    wrapper.find('input').simulate('change', { target: { checked: false } })
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    expect(onChangeSpy.calledOnce).to.be.true
                    expect(onUncheckSpy.calledOnce).to.be.true
                    expect(onCheckSpy.called).to.be.false
                });

                it('单选由非选中到选中，正确触发onChange事件回调，正确触发onCheck回调，不触发onUncheck事件回调', () => {
                    const onChangeSpy = sinon.spy(),
                        onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = mount(
                            <RadioBox
                                checked={false}
                                onChange={onChangeSpy}
                                onUncheck={onUncheckSpy}
                                onCheck={onCheckSpy}
                            />
                        );
                    expect(wrapper.find('input').prop('checked')).to.be.false
                    wrapper.find('input').simulate('change', { target: { checked: true } })
                    expect(wrapper.find('input').prop('checked')).to.be.true
                    expect(onChangeSpy.calledOnce).to.be.true
                    expect(onUncheckSpy.called).to.be.false
                    expect(onCheckSpy.calledOnce).to.be.true
                });
            });
        });
    });
});