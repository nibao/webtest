import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import InlineButton from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('InlineButton@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<InlineButton />);
            })

            it('渲染结果为button中包含UIIcon子组件', () => {
                const wrapper = shallow(<InlineButton />);
                expect(wrapper.type()).to.equal('button')
                expect(wrapper.childAt(0).name()).to.equal('UIIcon')
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<InlineButton className="customizeClassName" />)
                expect(wrapper.hasClass('customizeClassName')).to.be.true
            });

            it('button默认宽高24', () => {
                const wrapper = shallow(<InlineButton />);
                expect(wrapper.prop('style')).to.deep.equal({ width: 24, height: 24 })
            });

            it('允许自定义button的width,height', () => {
                const wrapper = shallow(<InlineButton size={20} />);
                expect(wrapper.prop('style')).to.deep.equal({ width: 20, height: 20 })
            });

            it('允许自定义button type', () => {
                const wrapper = shallow(<InlineButton type="submit" />);
                expect(wrapper.prop('type')).to.equal('submit')
            });

            it('默认非禁用', () => {
                const wrapper = shallow(<InlineButton />);
                expect(wrapper.hasClass(styles['disabled'])).to.be.false
            });

            it('禁用时样式正确', () => {
                const wrapper = shallow(<InlineButton disabled={true} />);
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
            });

            it('正确传递code到UIIcon的code属性', () => {
                const wrapper = shallow(<InlineButton code="\uf222" />);
                expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf222')
            });

            it('UIIcon默认inconSize16', () => {
                const wrapper = shallow(<InlineButton />);
                expect(wrapper.find('UIIcon').prop('size')).to.equal(16)
            });

            it('正确传递iconSize到UIIcon的size属性', () => {
                const wrapper = shallow(<InlineButton iconSize={18} />);
                expect(wrapper.find('UIIcon').prop('size')).to.equal(18)
            });

            it('正确传递fallback到UIIcon的fallback属性', () => {
                const wrapper = shallow(<InlineButton fallback="imgSrc" />);
                expect(wrapper.find('UIIcon').prop('fallback')).to.equal('imgSrc')
            });

            it('默认UIIcon颜色为#757575', () => {
                const wrapper = shallow(<InlineButton />);
                expect(wrapper.find('UIIcon').prop('color')).to.equal('#757575')
            });
        })

        describe('#event', () => {
            /* 禁用依赖button默认的disabled特性，即定义了disabled后不触发onClick事件，因此需要使用mount */
            it('未禁用时，点击触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<InlineButton onClick={spy} />);
                wrapper.simulate('click')
                expect(spy.called).to.be.true
            });

            it('禁用时，点击不触发点击事件', () => {
                const spy = sinon.spy();
                const wrapper = mount(<InlineButton disabled={true} onClick={spy} />);
                wrapper.simulate('click')
                expect(spy.called).to.be.false
            });
        });
    });
});