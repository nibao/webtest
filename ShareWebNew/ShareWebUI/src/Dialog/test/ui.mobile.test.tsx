import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Dialog from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Dialog@mobile', () => {
        describe('#render', () => {
            it('正确渲染遮罩层', () => {
                /* componentDidMount 调用了Dom上的属性，必须使用mount渲染 */
                const wrapper = mount(<Dialog></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.true
            });
            it('正确隐藏遮罩层', () => {
                const wrapper = mount(<Dialog hide={true}></Dialog>);
                expect(wrapper.find('Mask').exists()).to.be.false
            });

            it('正确渲染内容', () => {
                const wrapper = mount(<Dialog><div>test</div></Dialog>);
                expect(wrapper.contains(<div>test</div>));
            });
        });
    });
});