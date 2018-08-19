import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Dialog from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('Dialog2@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                mount(<Dialog></Dialog>);
            });

            it('渲染遮罩层', () => {
                const wrapper = mount(<Dialog width={500}></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.true
            });
            
            it('props传入自定义宽度', () => {
                const wrapper = mount(<Dialog width={500}></Dialog>);
                expect(wrapper.find(`.${styles['container']}`).prop('style').width).to.equal(500);
            });

            it('正确渲染子组件', () => {
                const wrapper = mount(<Dialog><div>test</div></Dialog>);
                expect(wrapper.contains(<div>test</div>)).to.be.true;
            });
        });

    });
});