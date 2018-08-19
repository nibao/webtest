import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SelectOption from '../ui.mobile';
import * as styles from '../styles.mobile';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('SelectOption@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<SelectOption></SelectOption>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<SelectOption className="test"></SelectOption>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('选项内容文字正确', () => {
                const wrapper = shallow(<SelectOption>test</SelectOption>)
                expect(wrapper.childAt(0).text()).to.equal('test')
            });

            it('设置选中时，样式正确', () => {
                const wrapper = shallow(<SelectOption selected={true}></SelectOption>)
                expect(wrapper.hasClass(styles['selected'])).to.be.true
            });
        })

        describe('#event', () => {
            it('未禁用时，按下鼠标时，调用onSelect，并且传入正确的value和text', () => {
                const onSelectSpy = sinon.spy(),
                    wrapper = shallow(<SelectOption value="testValue" onSelect={onSelectSpy}>testText</SelectOption>)
                wrapper.simulate('mousedown')
                expect(onSelectSpy.calledWith({ value: 'testValue', text: 'testText' })).to.be.true
            });

            it('禁用时，按下鼠标不调用onSelect', () => {
                const onSelectSpy = sinon.spy(),
                    wrapper = shallow(<SelectOption disabled={true} value="testValue" onSelect={onSelectSpy}>testText</SelectOption>)
                wrapper.simulate('mousedown')
                expect(onSelectSpy.called).to.be.false
            });
        });
    });
});