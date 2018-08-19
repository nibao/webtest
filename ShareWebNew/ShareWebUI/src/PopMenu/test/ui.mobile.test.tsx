import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PopMenu from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('PopMenu@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PopMenu></PopMenu>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<PopMenu className="test"></PopMenu>)
                expect(wrapper.find('ul').hasClass('test')).to.be.true
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(
                    <PopMenu className="test">
                        <PopMenu.Item>test1</PopMenu.Item>
                        <PopMenu.Item>test2</PopMenu.Item>
                    </PopMenu>)
                expect(wrapper.find('ul').children()).to.have.lengthOf(2)
                expect(wrapper.find('ul').childAt(0).childAt(0).text()).to.equal('test1')
                expect(wrapper.find('ul').childAt(1).childAt(0).text()).to.equal('test2')
            });

            it('除children，className外传递其他任意属性被直接传入PopOver', () => {
                const wrapper = shallow(<PopMenu other="test"></PopMenu>)
                expect(wrapper.prop('other')).to.equal('test')
            });
        })
    });
});