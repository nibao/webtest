import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as sinon from 'sinon';
import Button from '../ui.desktop';
import * as styles from '../styles.desktop.css';

describe('ShareWebUI', () => {
    describe('Button@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Button></Button>)
            });
            it('正确渲染按钮文字', () => {
                const wrapper = shallow(<Button>Click Me</Button>);
                expect(wrapper.contains(<span>Click Me</span>)).to.equal(true);
                expect(wrapper.text()).to.equal('Click Me');
            });

            it('默认类型为button', () => {
                const wrapper = shallow(<Button>Click Me</Button>);
                expect(wrapper.prop('type')).to.be.equal('button');
            });

            it('正确设置宽度', () => {
                const wrapper = shallow(<Button minWidth={400} width={600}>Click Me</Button>);
                expect(wrapper.find('button').prop('style')).to.deep.equal({ minWidth: 400, width: 600 });
            });

            it('传入icon属性，正确渲染UIIcon', () => {
                const wrapper = shallow(<Button icon='test'>Click Me</Button>);
                expect(wrapper.find('UIIcon')).have.lengthOf(1);
            });

            it('不传入icon属性，不渲染UIIcon', () => {
                const wrapper = shallow(<Button>Click Me</Button>);
                expect(wrapper.find('UIIcon')).have.lengthOf(0);
            });

            it('正确设置禁用样式', () => {
                const wrapper = shallow(<Button disabled={true}>Click Me</Button>);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
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