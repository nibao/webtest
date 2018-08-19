import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UIIcon from '../ui.desktop';
import * as f000 from '../assets/fallback/f000.png';


describe('ShareWebUI', () => {
    describe('UIIcon@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<UIIcon />)
            })
            
            describe('组件为FontIcon的高阶组件,检查FontIcon默认参数', () => {
                it('font为“anyshare”', () => {
                    const wrapper = shallow(<UIIcon />);
                    expect(wrapper.prop('font')).to.equal('AnyShare')
                });

                it('将接收到的code参数直接传给FontIcon的code参数', () => {
                    const wrapper = shallow(<UIIcon code="\uf002"/>);
                    expect(wrapper.prop('code')).to.equal('\uf002')
                });

                it('将接收到的fallback参数直接传给FontIcon的fallback参数', () => {
                    const wrapper = shallow(<UIIcon fallback="testFallBack"/>);
                    expect(wrapper.prop('fallback')).to.equal('testFallBack')
                });

                it('如果没有传递fallback，则通过code映射设置callback', () => {
                    const wrapper = shallow(<UIIcon code="\uf000"/>);
                    expect(wrapper.prop('fallback')).to.equal(f000)
                });

                it('除code和fallback之外的其他参数直接传给FontIcon', () => {
                    const wrapper = shallow(<UIIcon otherProps="test"/>);
                    expect(wrapper.prop('otherProps')).to.equal('test')
                });
            });
        })
    });
});