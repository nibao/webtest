import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SwitchButton from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('SwitchButton2', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SwitchButton />)
            })

            it('禁用时正确设置className', () => {
                const wrapper = shallow(<SwitchButton disabled={true} />)
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
            });

            it('正确渲染关闭状态', () => {
                const wrapper = shallow(<SwitchButton active={false} />)
                expect(wrapper.find(`.${styles['slide']}`).hasClass(styles['slide-close'])).to.be.true
                expect(wrapper.find(`.${styles['slide']}`).hasClass(styles['slide-on'])).to.be.false

                expect(wrapper.find(`.${styles['btn']}`).hasClass(styles['btn-close'])).to.be.true
                expect(wrapper.find(`.${styles['btn']}`).hasClass(styles['btn-on'])).to.be.false
            });

            it('正确渲染开启状态', () => {
                const wrapper = shallow(<SwitchButton active={true} />)
                expect(wrapper.find(`.${styles['slide']}`).hasClass(styles['slide-close'])).to.be.false
                expect(wrapper.find(`.${styles['slide']}`).hasClass(styles['slide-on'])).to.be.true

                expect(wrapper.find(`.${styles['btn']}`).hasClass(styles['btn-close'])).to.be.false
                expect(wrapper.find(`.${styles['btn']}`).hasClass(styles['btn-on'])).to.be.true
            });
        })

        describe('#event', () => {
            describe('当前状态为关时', () => {
                it('禁用时，不触发props.onChange', () => {
                    const onChangeSpy = sinon.spy();
                    const wrapper = shallow(
                        <SwitchButton
                            disabled={true}
                            active={false}
                            value="test"
                            onChange={onChangeSpy}
                        />
                    )
                    wrapper.find('a').simulate('click')
                    expect(onChangeSpy.called).to.be.false
                });

                it('未禁用时，正确触发props.onChange', () => {
                    const onChangeSpy = sinon.spy();
                    const wrapper = shallow(
                        <SwitchButton
                            disabled={false}
                            active={false}
                            value="test"
                            onChange={onChangeSpy}
                        />
                    )
                    wrapper.find('a').simulate('click')
                    expect(onChangeSpy.calledWith('test', true)).to.be.true
                });
            });

            describe('当前状态为开时', () => {
                it('禁用时，不触发props.onChange', () => {
                    const onChangeSpy = sinon.spy();
                    const wrapper = shallow(
                        <SwitchButton
                            disabled={true}
                            value="test"
                            active={true}
                            onChange={onChangeSpy}
                        />
                    )

                    wrapper.find('a').simulate('click')
                    expect(onChangeSpy.called).to.be.false
                });

                it('未禁用时，正确触发props.onChange', () => {
                    const onChangeSpy = sinon.spy();
                    const wrapper = shallow(
                        <SwitchButton
                            disabled={false}
                            value="test"
                            active={true}
                            onChange={onChangeSpy}
                        />
                    )
                    wrapper.find('a').simulate('click')
                    expect(onChangeSpy.calledWith('test', false)).to.be.true
                });
            });
        });
    });
});