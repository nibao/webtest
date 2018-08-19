import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SwitchButton from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('SwitchButton@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SwitchButton />)
            })

            it('默认为关闭状态', () => {
                const wrapper = shallow(<SwitchButton />)
                expect(wrapper.hasClass(styles['switch-left'])).to.be.true
            });

            it('允许设置开关状态', () => {
                let wrapper: ShallowWrapper;
                wrapper = shallow(<SwitchButton active={true} />)
                expect(wrapper.hasClass(styles['switch-right'])).to.be.true
                wrapper = shallow(<SwitchButton active={false} />)
                expect(wrapper.hasClass(styles['switch-left'])).to.be.true
            });
        })

        describe('#event', () => {
            describe('当前状态为开', () => {
                it('点击切换状态为关', () => {
                    const wrapper = shallow(<SwitchButton active={true} />)
                    expect(wrapper.hasClass(styles['switch-right'])).to.be.true
                    wrapper.simulate('click')
                    expect(wrapper.hasClass(styles['switch-left'])).to.be.true
                });

                it('点击正确触发onUncheck，不触发onCheck', () => {
                    const onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = shallow(<SwitchButton value="test" active={true} onUncheck={onUncheckSpy} onCheck={onCheckSpy} />)
                    wrapper.simulate('click')
                    expect(onUncheckSpy.calledWith('test')).to.be.true
                    expect(onCheckSpy.called).to.be.false
                });

                it('点击正确触发onChange回调', () => {
                    const onChangeSpy = sinon.spy(),
                        wrapper = shallow(<SwitchButton value="test" onChange={onChangeSpy} active={true} />)
                    wrapper.simulate('click')
                    expect(onChangeSpy.calledWith(false, 'test')).to.be.true
                });
            });

            describe('当前状态为关', () => {
                it('点击切换状态为开', () => {
                    const wrapper = shallow(<SwitchButton active={false} />)
                    expect(wrapper.hasClass(styles['switch-left'])).to.be.true
                    wrapper.simulate('click')
                    expect(wrapper.hasClass(styles['switch-right'])).to.be.true

                });

                it('点击正确触发onCheck,不触发onUncheck', () => {
                    const onUncheckSpy = sinon.spy(),
                        onCheckSpy = sinon.spy(),
                        wrapper = shallow(<SwitchButton value="test" active={false} onUncheck={onUncheckSpy} onCheck={onCheckSpy} />)
                    wrapper.simulate('click')
                    expect(onCheckSpy.calledWith('test')).to.be.true
                    expect(onUncheckSpy.called).to.be.false
                });
                it('点击正确触发onChange回调', () => {
                    const onChangeSpy = sinon.spy(),
                        wrapper = shallow(<SwitchButton value="test" onChange={onChangeSpy} active={false} />)
                    wrapper.simulate('click')
                    expect(onChangeSpy.calledWith(true, 'test')).to.be.true
                });
            });
        });
    });
});