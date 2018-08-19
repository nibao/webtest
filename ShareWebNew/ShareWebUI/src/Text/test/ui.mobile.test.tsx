import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Text from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('Text', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Text></Text>)
            })

            it('允许通过props.className自定义className', () => {
                const wrapper = shallow(<Text className="test"></Text>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许通过props.selectable设置文字可选中', () => {
                const wrapper = shallow(<Text selectable={true}></Text>)
                expect(wrapper.hasClass(styles['selectable'])).to.be.true
            });

            it('正确渲染文字内容', () => {
                const wrapper = shallow(<Text>test</Text>)
                expect(wrapper.contains('test')).to.be.true
            });
        })
    });
});