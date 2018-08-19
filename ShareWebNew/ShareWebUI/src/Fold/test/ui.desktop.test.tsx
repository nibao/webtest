import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Fold from '../ui.desktop';
import * as styles from '../styles.desktop.css'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('Fold@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Fold></Fold>)
            });

            it('允许通过props自定义className', () => {
                const wrapper = shallow(<Fold className="test"></Fold>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许通过props自定义展开状态open', () => {
                const wrapper = shallow(<Fold open={false}></Fold>)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf04e')
                expect(wrapper.find('Expand').prop('open')).to.be.false
            });

            it('允许通过props自定义标题label', () => {
                const wrapper = shallow(<Fold label="test"></Fold>)
                expect(wrapper.find(`.${styles['label']}`).childAt(0).text()).to.equal('test');
            });

            it('正确渲染UIIcon', () => {
                const wrapper = shallow(<Fold></Fold>)
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf04c')
            });

            it('open props改变时改变UIIcon的code', () => {
                const wrapper = shallow(<Fold></Fold>)
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf04c')
                wrapper.setProps({ open: false })
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf04e')
            });

            it('正确渲染Expand', () => {
                const wrapper = shallow(<Fold></Fold>)
                expect(wrapper.find('Expand')).to.have.lengthOf(1)
                expect(wrapper.find('Expand').prop('open')).to.be.true
            });

            it('open props改变时Expand子组件的open props改变', () => {
                const wrapper = shallow(<Fold></Fold>)
                expect(wrapper.find('Expand').prop('open')).to.be.true
                wrapper.setProps({ open: false })
                expect(wrapper.find('Expand').prop('open')).to.be.false
            });
        });

        describe('#event', () => {
            it('点击标题切换点击状态，调用toggle事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<Fold onToggle={spy}></Fold>);
                wrapper.find(`.${styles['label']}`).simulate('click');
                expect(spy.calledOnce).to.be.true
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf04e')
                expect(wrapper.find('Expand').prop('open')).to.be.false
            });
        });
    });
});