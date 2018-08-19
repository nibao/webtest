import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FlexBoxItem from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('FlexBoxItem@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FlexBoxItem></FlexBoxItem>)
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<FlexBoxItem><div>test</div></FlexBoxItem>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('允许自定义宽度', () => {
                const wrapper = shallow(<FlexBoxItem width={500}></FlexBoxItem>);
                expect(wrapper.prop('style').width).to.equal(500)
            });

            describe('自定义对齐', () => {
                it('默认水平居左，垂直居中对齐', () => {
                    const wrapper = shallow(<FlexBoxItem></FlexBoxItem>);
                    expect(wrapper.hasClass(styles['alignLeft'])).to.be.true
                    expect(wrapper.hasClass(styles['alignMiddle'])).to.be.true
                    
                });
                it('传入对齐关键词，允许自定义对齐', () => {
                    const wrapper = shallow(<FlexBoxItem align="right top"></FlexBoxItem>);
                    expect(wrapper.hasClass(styles['alignRight'])).to.be.true
                    expect(wrapper.hasClass(styles['alignTop'])).to.be.true
                });
            });
        });
    });
});