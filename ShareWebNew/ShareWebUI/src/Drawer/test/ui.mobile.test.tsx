import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Drawer from '../ui.mobile';
import * as styles from '../styles.mobile.css'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('Drawer@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Drawer></Drawer>);
            });

            it('渲染子组件', () => {
                const wrapper = shallow(<Drawer><div>test</div></Drawer>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('渲染遮罩层', () => {
                const wrapper = shallow(<Drawer></Drawer>);
                expect(wrapper.find(`.${styles['mask']}`).exists()).to.be.true
            });

            it('不渲染遮罩层', () => {
                const wrapper = shallow(<Drawer mask={false}></Drawer>);
                expect(wrapper.find(`.${styles['mask']}`).exists()).to.be.false
            });

            it('open状态时，添加遮罩层和内容区className', () => {
                const wrapper = shallow(<Drawer open={true}></Drawer>);
                expect(wrapper.find(`.${styles['mask']}`).hasClass(styles['show'])).to.be.true
                expect(wrapper.find(`.${styles['drawer']}`).hasClass(styles['open'])).to.be.true
            });
        });
        describe('#event', () => {
            it('点击遮罩层时调用onClickMask事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Drawer onClickMask={spy}></Drawer>);
                wrapper.find(`.${styles['mask']}`).simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });

    });
});