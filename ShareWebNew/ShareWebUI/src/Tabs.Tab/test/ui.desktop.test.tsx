import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TabsTab from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import { ClassName } from '../../helper';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('TabsTab@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TabsTab></TabsTab>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<TabsTab className="test"></TabsTab>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许自定义style', () => {
                const wrapper = shallow(<TabsTab style={{ width: 200, height: 200, color: 'red' }}></TabsTab >)
                expect(wrapper.prop('style')).to.deep.equal({ width: 200, height: 200, color: 'red' })
            });

            it('激活时，正确添加className', () => {
                const wrapper = shallow(<TabsTab active={true}></TabsTab>)
                expect(wrapper.hasClass(styles['active'])).to.be.true
                expect(wrapper.hasClass(ClassName.BorderBottomColor)).to.be.true
                expect(wrapper.hasClass(ClassName.Color)).to.be.true
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<TabsTab active={true}><span>tab</span></TabsTab>)
                expect(wrapper.contains(<span>tab</span>)).to.be.true
            });
        })

        describe('#event', () => {
            it('点击时，调用props.onActive回调函数', () => {
                const onActiveSpy = sinon.spy()
                const wrapper = shallow(<TabsTab onActive={onActiveSpy}></TabsTab>)
                wrapper.simulate('click')
                expect(onActiveSpy.calledOnce).to.be.true
            });
        });
    });
});