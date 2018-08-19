import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import CheckBox from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('CheckBox@mobile', () => {
        describe('#render', () => {

            it('默认渲染', () => {
                shallow(<CheckBox />)
            });

            it('渲染中包含UIIcon和input', () => {
                const wrapper = shallow(<CheckBox />)
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('input')).to.have.length(1)
            });

            it('自定义input id', () => {
                const wrapper = shallow(<CheckBox id="test" />)
                expect(wrapper.find('input').prop('id')).to.equal('test')
            });

            it('UIIcon的code参数正确', () => {
                const wrapper1 = shallow(<CheckBox checked={true} />)
                expect(wrapper1.find('UIIcon').prop('code')).to.equal('\uf063')
                const wrapper2 = shallow(<CheckBox checked={false} />)
                expect(wrapper2.find('UIIcon').prop('code')).to.equal('\uf07B')
            });

            it('disabled时UIIcon的颜色正确', () => {
                const wrapper = shallow(<CheckBox disabled={true} checked={true} />)
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#ddd')
            });

            it('未disabled时UIIcon的颜色正确', () => {
                const wrapper1 = shallow(<CheckBox disabled={false} checked={true} />)
                expect(wrapper1.find('UIIcon').prop('color')).to.equal('#0075ed')
                const wrapper2 = shallow(<CheckBox disabled={false} checked={false} />)
                expect(wrapper2.find('UIIcon').prop('color')).to.equal('#aaa')
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
                    wrapper.find('input').simulate('click')
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