import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper, mount } from 'enzyme';
import PlainButton from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('PlainButton@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(
                    <PlainButton></PlainButton>
                )
            })

            it('渲染结果最外层为button', () => {
                const wrapper = shallow(
                    <PlainButton></PlainButton>
                )
                expect(wrapper.type()).to.equal('button')
            });

            it('允许自定义className', () => {
                const wrapper = shallow(
                    <PlainButton className="test"></PlainButton>
                );
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('禁用时，设置正确的样式，设置button的disabled', () => {
                let wrapper: ShallowWrapper;
                /* 默认为非禁用 */
                wrapper = shallow(
                    <PlainButton></PlainButton>
                );
                expect(wrapper.hasClass(styles['disabled'])).to.be.false
                expect(wrapper.prop('disabled')).to.be.false

                /* 设置禁用 */
                wrapper = shallow(
                    <PlainButton disabled={true}></PlainButton>
                );
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
                expect(wrapper.prop('disabled')).to.be.true
            });

            it('允许自定义type', () => {
                let wrapper: ShallowWrapper;

                /* 默认type为button */
                wrapper = shallow(
                    <PlainButton></PlainButton>
                );

                expect(wrapper.prop('type')).to.equal('button')

                /* 自定义type */
                wrapper = shallow(
                    <PlainButton type="submit"></PlainButton>
                );
                expect(wrapper.prop('type')).to.equal('submit')
            });


            it('允许自定义minWidth', () => {
                let wrapper: ShallowWrapper;

                /* 默认minWidth为80 */
                wrapper = shallow(<PlainButton></PlainButton>);
                expect(wrapper.prop('style').minWidth).to.equal(80)
                /* 自定义minWidth */

                wrapper = shallow(<PlainButton minWidth={100}></PlainButton>);
                expect(wrapper.prop('style').minWidth).to.equal(100)

            });

            it('允许自定义width', () => {
                const wrapper = shallow(<PlainButton width={100}></PlainButton>);
                expect(wrapper.prop('style').width).to.equal(100)
            });

            it('允许传入任意自定义属性', () => {
                const wrapper = shallow(<PlainButton test="a"></PlainButton>)
                expect(wrapper.prop('test')).to.equal('a')
            });

            it('传入icon属性时，渲染对应的UIIcon', () => {
                const icon = '\uf123',
                    fallback = 'src/123.png',
                    wrapper = shallow(<PlainButton icon={icon} fallback={fallback}></PlainButton>),
                    UIIcon = wrapper.find('UIIcon')
                expect(UIIcon).to.have.lengthOf(1)
                expect(UIIcon.prop('code')).to.equal(icon)
                expect(UIIcon.prop('fallback')).to.equal(fallback)
            });

            it('正确按钮内容', () => {
                const wrapper = shallow(<PlainButton>test</PlainButton>);
                expect(wrapper.childAt(0).text()).to.equal('test')
            });
        })

        describe('#event', () => {
            it('未禁用时，点击触发onClick回调', () => {
                const spy = sinon.spy(),
                    wrapper = mount(<PlainButton onClick={spy}></PlainButton>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.true
            });

            it('禁用时，点击不触发onClick回调', () => {
                const spy = sinon.spy(),
                    wrapper = mount(<PlainButton disabled={true} onClick={spy}></PlainButton>);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.false
            });
        });
    });
});