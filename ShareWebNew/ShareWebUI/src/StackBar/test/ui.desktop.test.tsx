import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StackBar from '../ui.desktop';
import * as styles from '../styles.desktop.css';


describe('ShareWebUI', () => {
    describe('StackBar@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<StackBar></StackBar>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<StackBar className="test"></StackBar>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('默认宽度100%，正确设置盒模型', () => {
                const wrapper = shallow(<StackBar></StackBar>)
                expect(wrapper.prop('style')).to.deep.equal({ width: '100%' })
                expect(wrapper.hasClass(styles['box-sizing-border-box'])).to.be.true
            });

            it('允许自定义width，正确设置盒模型', () => {
                const wrapper = shallow(<StackBar width={50}></StackBar>)
                expect(wrapper.prop('style')).to.deep.equal({ width: 50 })
                expect(wrapper.hasClass(styles['box-sizing-border-box'])).to.be.true
            });

            it('文字内容正确', () => {
                const wrapper = shallow(<StackBar>test</StackBar>)
                expect(wrapper.find('span').childAt(0).text()).to.equal('test')
            });
        })
    });
});