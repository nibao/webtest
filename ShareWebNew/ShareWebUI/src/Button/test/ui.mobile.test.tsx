import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import Button from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Button@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Button></Button>)
            });

            it('正确渲染按钮文字', () => {
                const wrapper = shallow(<Button>Click Me</Button>);
                expect(wrapper.text()).to.equal('Click Me');
            });

            it('默认类型为button', () => {
                const wrapper = shallow(<Button>Click Me</Button>);
                expect(wrapper.prop('type')).to.be.equal('button');
            });

            it('正确设置宽度', () => {
                const wrapper = shallow(<Button minWidth={400} >Click Me</Button>);
                expect(wrapper.find('button').prop('style')).to.deep.equal({ minWidth: 400 });
            });

        });

        describe('#onClick', () => {
            it('正确触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Button onClick={spy}>Click Me</Button>);
                wrapper.simulate('click');
                expect(spy.calledOnce).equal(true);
            });

            it('按钮禁用后点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Button disabled={true} onClick={spy}>Click Me</Button>);
                wrapper.simulate('click');
                expect(spy.calledOnce).equal(false);
            })
        });

        describe('#onMouseDown', () => {
            it('正确触发onMouseDown事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Button onMouseDown={spy}>Click Me</Button>);
                wrapper.simulate('mouseDown');
                expect(spy.calledOnce).equal(true);
            });

            it('按钮禁用后不触发onMouseDown事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Button disabled={true} onMouseDown={spy}>Click Me</Button>);
                wrapper.simulate('mouseDown');
                expect(spy.calledOnce).equal(false);
            });
        });

    });
});