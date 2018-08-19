import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Control from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('Control@desktop', () => {
        describe('#render', () => {
            it('禁用样式渲染正确', () => {
                const wrapper = shallow(<Control disabled={true}></Control>);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
            });

            it('聚焦样式渲染正确', () => {
                const wrapper = shallow(<Control focus={true}></Control>);
                expect(wrapper.hasClass(styles['focus'])).to.be.true
            });

            it('渲染正确的盒模型', () => {
                const wrapperBorder = shallow(<Control></Control>);
                expect(wrapperBorder.hasClass(styles['box-sizing-border-box'])).to.be.false
                const wrapperContent = shallow(<Control width={400}></Control>);
                expect(wrapperContent.hasClass(styles['box-sizing-border-box'])).to.be.true
            });

            it('正确设置宽高', () => {
                const wrapper = shallow(<Control width={200} height={200}></Control>);
                expect(wrapper.prop('style')).to.deep.equal({ width: 200, height: 200, maxHeight: undefined, minHeight: undefined })
            });

            it('正确设置自定义style', () => {
                const wrapper = shallow(<Control style={{ color: 'red' }}></Control>);
                expect(wrapper.prop('style')).to.have.property('color', 'red');
            });

            it('正确渲染子元素', () => {
                const wrapper = shallow(<Control><div>test</div></Control>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        });

        describe('#onClick', () => {
            it('正确处理点击事件', () => {
                const spy = sinon.spy()
                const wrapper = mount(<Control onClick={spy}><div>test</div></Control>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.true;
            });
        });

    });
});