import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ColorBox from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ColorBox@desktop', () => {
        describe('#render', () => {
            it('渲染结果为TextBox', () => {
                const wrapper = shallow(<ColorBox />);
                expect(wrapper.name()).to.equal('TextBox')
            });
            it('正确渲染初始颜色值', () => {
                const wrapper = mount(<ColorBox value={'#000000'} />);
                expect(wrapper.find('input').prop('value')).to.be.equal('#000000')
            });
        });
        describe('#event', () => {
            it('输入不合法颜色值,不改变value', () => {
                const wrapper = mount(<ColorBox value={'#000000'} />);
                wrapper.find('input').simulate('change', { target: { value: '#kkk' } })
                expect(wrapper.find('input').prop('value')).to.be.equal('#000000')
            });

            it('输入合法颜色值，value为输入颜色值', () => {
                const wrapper = mount(<ColorBox value={'#000000'} />);
                wrapper.find('input').simulate('change', { target: { value: '#kkk' } })
                expect(wrapper.find('input').prop('value')).to.be.equal('#000000')
            });
        });
    });
});