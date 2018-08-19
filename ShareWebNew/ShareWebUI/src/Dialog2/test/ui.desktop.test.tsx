import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Dialog from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('Dialog2@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                mount(<Dialog></Dialog>);
            });

            it('渲染遮罩层', () => {
                const wrapper = mount(<Dialog></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.true
            });

            it('props传入自定义宽度,container宽度设置为自定义宽度', () => {
                const wrapper = mount(<Dialog width={500}></Dialog>);
                expect(wrapper.find(`.${styles['container']}`).prop('style').width).to.equal(500);
            });

            it('正确渲染title', () => {
                const wrapper = mount(<Dialog title='test'></Dialog>);
                expect(wrapper.contains(<h1 className={styles['title']}>test</h1>)).to.be.true
            });

            it('渲染关闭按钮', () => {
                const wrapper = mount(<Dialog></Dialog>);
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1);
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf014');
            });

            it('不渲染关闭按钮', () => {
                const wrapper = mount(<Dialog buttons={[]}></Dialog>);
                expect(wrapper.find('UIIcon')).to.have.lengthOf(0);
            });

            it('正确渲染子组件', () => {
                const wrapper = mount(<Dialog><div>test</div></Dialog>);
                expect(wrapper.contains(<div>test</div>)).to.be.true;
            });

            it('通过hide props正确实现隐藏', () => {
                const wrapper = mount(<Dialog hide={true}></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.false
                expect(wrapper.find(`.${styles['container']}`).prop('style')).to.deep.equal({ top: '100%', left: '100%' })
            });
        });

        describe('#event', () => {
            it('点击关闭按钮调用onclose props进行处理', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Dialog close={['close']} onClose={spy}></Dialog>);
                wrapper.find('UIIcon').first().simulate('click')
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});