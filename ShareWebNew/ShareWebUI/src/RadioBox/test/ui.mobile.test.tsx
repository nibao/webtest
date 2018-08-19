import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper, mount } from 'enzyme';
import RadioBox from '../ui.mobile';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('RadioBox@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<RadioBox />)
            })

            it('渲染结果中包含UIIcon和input', () => {
                const wrapper = shallow(<RadioBox />)
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('input')).to.have.lengthOf(1)
            });

            it('根据选中状态不同渲染不同的UIIcon', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf0cd')
                wrapper = shallow(<RadioBox checked={false} />)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf07B')
            });

            it('禁用时UIIcon颜色为#ddd', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<RadioBox disabled={true} checked={true} />)
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#ddd')
                wrapper = shallow(<RadioBox disabled={true} checked={false} />)
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#ddd')
            });

            it('未禁用时，UIIcon的颜色根据选中状态改变', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#0075ed')
                wrapper = shallow(<RadioBox checked={false} />)
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#aaa')
            });

            it('input类型为radio', () => {
                const wrapper = shallow(<RadioBox />)
                expect(wrapper.find('input').prop('type')).to.equal('radio')
            });

            it('默认input的display为none', () => {
                const wrapper = shallow(<RadioBox />)
                expect(wrapper.find('input').prop('style')).to.deep.equal({ display: 'none' })
            });

            it('允许自定义name', () => {
                const wrapper = shallow(<RadioBox name="testName" />)
                expect(wrapper.find('input').prop('name')).to.equal('testName')
            });

            it('允许自定义value', () => {
                const wrapper = shallow(<RadioBox value="testValue" />)
                expect(wrapper.find('input').prop('value')).to.equal('testValue')
            });

            it('允许禁用', () => {
                const wrapper = shallow(<RadioBox disabled={true} />)
                expect(wrapper.find('input').prop('disabled')).to.be.true
            });

            it('允许自定义defaultChecked', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.find('input').prop('defaultChecked')).to.be.true

                wrapper = shallow(<RadioBox checked={true} />)
                expect(wrapper.find('input').prop('defaultChecked')).to.be.true
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