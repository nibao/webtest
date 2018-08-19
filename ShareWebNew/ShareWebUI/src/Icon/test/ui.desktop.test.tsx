import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Icon from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Icon@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Icon />)
            })

            it('渲染结果为img标签', () => {
                const wrapper = shallow(<Icon />);
                expect(wrapper.type()).to.equal('img');
            });

            it('自定义Icon url', () => {
                const wrapper = shallow(<Icon url="test" />);
                expect(wrapper.prop('src')).to.equal('test')
            });

            it('自定义Icon size', () => {
                const wrapper = shallow(<Icon size={16} />);
                expect(wrapper.prop('style')).to.deep.equal({ width: 16, height: 16 })
            });

        })
    });
});