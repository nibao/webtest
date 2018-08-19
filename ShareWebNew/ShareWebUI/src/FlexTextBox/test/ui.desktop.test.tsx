import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import FlexTextBox from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('FlexTextBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FlexTextBox></FlexTextBox>);
            });

            it('默认placeholder为空', () => {
                const wrapper = shallow(<FlexTextBox></FlexTextBox>);
                expect(wrapper.state('placeholder')).to.equal('')
            });

            it('设置自定义placeholder', () => {
                const wrapper = shallow(<FlexTextBox placeholder="test"></FlexTextBox>);
                expect(wrapper.state('placeholder')).to.equal('test')
                expect(wrapper.prop('placeholder')).to.equal('test')
            });

            it('placeholder不为空时className正确', () => {
                const wrapper = shallow(<FlexTextBox placeholder="test"></FlexTextBox>);
                expect(wrapper.hasClass(styles['placeholder'])).to.be.true
            });

            it('允许禁用', () => {
                const wrapper = shallow(<FlexTextBox disabled={true}></FlexTextBox>);
                expect(wrapper.prop('contentEditable')).to.be.false
            });

            it('禁用时className正确', () => {
                const wrapper = shallow(<FlexTextBox disabled={true}></FlexTextBox>);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
            });

        });

        describe('#event', () => {
            it('按下按键时调用onKeyDown事件处理', (done) => {
                const spy = sinon.spy();
                const wrapper = mount(<FlexTextBox onKeyDown={spy}></FlexTextBox>);
                wrapper.simulate('keyDown');
                /* onKeyDown会在下一个时钟被调用，因此需要使用异步 */
                setTimeout(() => {
                    expect(spy.calledOnce).to.be.true
                    done()
                })
            });

            it('粘贴事件发生时调用onPaste事件处理函数', () => {
                const spy = sinon.spy();
                const wrapper = mount(<FlexTextBox onPaste={spy}></FlexTextBox>);
                wrapper.simulate('paste');
                expect(spy.calledOnce).to.be.true
            });
        });
    });
});