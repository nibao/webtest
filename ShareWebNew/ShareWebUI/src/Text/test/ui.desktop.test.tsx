import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Text from '../ui.desktop';
import * as styles from '../styles.desktop.css'


describe('ShareWebUI', () => {
    describe('Text@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Text></Text>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<Text className="test"></Text>)
                expect(wrapper.find('div').hasClass('test')).to.be.true
            });

            it('正确传递文字内容到Title组件的content属性，如果子元素不是字符串，则默认传如空字符串', () => {
                let wrapper;
                wrapper = shallow(<Text>test</Text>)
                expect(wrapper.prop('content')).to.equal('test')
                wrapper = shallow(<Text><span>test</span></Text>)
                expect(wrapper.prop('content')).to.equal('')
            });

            it('正确渲染文字内容', () => {
                const wrapper = shallow(<Text>test</Text>)
                expect(wrapper.find('div').childAt(0).text()).to.equal('test')
            });

            it('允许自定义文字内容是否可选中', () => {
                let wrapper;
                wrapper = shallow(<Text selectable={true}>test</Text>)
                expect(wrapper.find('div').hasClass(styles['selectable'])).to.be.true
                wrapper = shallow(<Text selectable={false}>test</Text>)
                expect(wrapper.find('div').hasClass(styles['selectable'])).to.be.false

            });
        })
    });
});