import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Overlay from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Overlay@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Overlay></Overlay>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<Overlay><div>test</div></Overlay>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<Overlay className="test"><div>test</div></Overlay>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('不传position属性时，默认style属性为{}', () => {
                const wrapper = shallow(<Overlay><div>test</div></Overlay>)
                expect(wrapper.prop('style')).to.deep.equal({})
            });

            it('允许通过position设置位置', () => {
                /* midile 和  center关键词下需要真实挂载后进行计算，无法覆盖 */
                let wrapper;
                wrapper = shallow(<Overlay position="top"><div>test</div></Overlay>)
                expect(wrapper.prop('style')).to.deep.equal({ position: 'fixed', top: 0 })
                wrapper = shallow(<Overlay position="top left"><div>test</div></Overlay>)
                expect(wrapper.prop('style')).to.deep.equal({ position: 'fixed', top: 0, left: 0 })
            });
        })
    });
});