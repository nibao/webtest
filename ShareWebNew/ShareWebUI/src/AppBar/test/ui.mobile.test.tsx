import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import AppBar from '../ui.mobile'

describe('ShareWebUI', () => {
    describe('AppBar@mobile', () => {
        describe('#render', () => {
            it('正确渲染子节点', () => {
                const wrapper = shallow(<AppBar><div>test</div></AppBar>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
            it('允许设置ClassName', () => {
                const wrapper = shallow(<AppBar className='test'></AppBar>)
                expect(wrapper.hasClass('test')).to.be.true
            });
            it('允许设置其他自定义props', () => {
                const wrapper = shallow(<AppBar name='name' age={123}></AppBar>)
                expect(wrapper.props()).to.be.include({ name: 'name', age: 123 })
            });
        });
    });
});