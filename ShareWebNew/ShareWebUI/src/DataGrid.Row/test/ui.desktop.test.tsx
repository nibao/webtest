import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import DataGridRow from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('DataGridRow@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<DataGridRow></DataGridRow>)
            });

            it('正确渲染斑马线样式', () => {
                const wrapper = shallow(<DataGridRow strap={true}></DataGridRow>);
                expect(wrapper.hasClass(styles['strap'])).to.be.true;
            });

            it('正确渲染复选框', () => {
                const wrapper = shallow(<DataGridRow checkbox={true}></DataGridRow>);
                expect(wrapper.find('CheckBox')).have.lengthOf(1);
                expect(wrapper.find('CheckBox').prop('disabled')).to.be.false;
                expect(wrapper.find('CheckBox').prop('checked')).to.be.false;

            });

            it('设置复选框默认选中', () => {
                const wrapper = shallow(<DataGridRow checkbox={true} selected={true}></DataGridRow>);
                expect(wrapper.find('CheckBox').prop('checked')).to.be.true;
            });

            it('禁用复选框', () => {
                const wrapper = shallow(<DataGridRow checkbox={true} selected={true} disabled={true}></DataGridRow>);
                expect(wrapper.find('CheckBox').prop('disabled')).to.be.true;
            });
        });

        describe('#event', () => {
            it('正确处理响应复选框点击事件', () => {
                const spy1 = sinon.spy();
                const spy2 = sinon.spy();
                const wrapper = mount(<table><tbody><DataGridRow checkbox={true} onClick={spy1} onCheckChange={spy2}></DataGridRow></tbody></table>);
                wrapper.find('CheckBox').simulate('click');
                expect(spy1.called).to.be.false; // 阻止消息传播
                expect(spy2.calledOnce).to.be.true;
            });

            it('正确处理tr上的单击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataGridRow checkbox={true} onClick={spy}></DataGridRow>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.true;
            });

            it('正确处理tr上的双击事件', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataGridRow checkbox={true} onDoubleClick={spy}></DataGridRow>);
                wrapper.simulate('doubleClick');
                expect(spy.calledOnce).to.be.true;
            });
        });

    });
});