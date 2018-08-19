import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Dialog from '../ui.client';
import * as styles from '../styles.client.css';


describe('ShareWebUI', () => {
    describe('Dialog2@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                mount(<Dialog></Dialog>);
            });

            it('不渲染遮罩层', () => {
                const wrapper = mount(<Dialog width={500}></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.false
            });
            
            it('props传入自定义宽度,最外层div为自定义宽度', () => {
                const wrapper = mount(<Dialog width={500}></Dialog>);
                expect(wrapper.find(`.${styles['dialog']}`).prop('style').width).to.equal(500);
            });

            it('正确渲染子组件', () => {
                const wrapper = mount(<Dialog><div>test</div></Dialog>);
                expect(wrapper.contains(<div>test</div>)).to.be.true;
            });
        });

    });
});