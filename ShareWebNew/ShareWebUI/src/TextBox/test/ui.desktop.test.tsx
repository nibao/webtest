import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TextBox from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('TextBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TextBox />)
            })

            it('默认为失焦状态', () => {
                const wrapper = shallow(<TextBox className="test" />)
                expect(wrapper.find('Control').prop('focus')).to.equal(false)
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<TextBox className="test" />)
                expect(wrapper.find('Control').hasClass('test')).to.be.true
            });

            it('允许自定义style', () => {
                const wrapper = shallow(<TextBox style={{ color: 'red', fontSize: 20 }} />);
                expect(wrapper.find('Control').prop('style')).to.deep.equal({ color: 'red', fontSize: 20 })
            });

            it('允许自定义宽度', () => {
                const wrapper = shallow(<TextBox width={200} />);
                expect(wrapper.find('Control').prop('width')).to.equal(200)
            });

            it('props.disabled为true时，正确设置禁用', () => {
                const wrapper = shallow(<TextBox disabled={true} />);
                expect(wrapper.find('Control').prop('disabled')).to.equal(true)
                expect(wrapper.find('TextInput').prop('disabled')).to.equal(true)
            });
        })
        describe('#event', () => {
            it('focus处理函数调用时，正确设置state，正确调用props.onFocus', () => {
                const onFocusSpy = sinon.spy()
                const wrapper = shallow(<TextBox onFocus={onFocusSpy} />);
                wrapper.instance().focus(null)
                wrapper.update()
                expect(wrapper.find('Control').prop('focus')).to.be.true
                expect(onFocusSpy.calledWith(null)).to.be.true
            });

            it('blur处理函数调用时，正确设置state，正确调用props.onBlur', () => {
                const onBlurSpy = sinon.spy();
                const wrapper = shallow(<TextBox onBlur={onBlurSpy} />)
                wrapper.setState({ focus: true })
                wrapper.instance().blur(null);
                wrapper.update()
                expect(wrapper.find('Control').prop('focus')).to.be.false
                expect(onBlurSpy.calledWith(null)).to.be.true
            });

        });
    });
});