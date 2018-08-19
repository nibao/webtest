import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import InlineTextBox from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('InlineTextBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<InlineTextBox />)
            })
            it('允许自定义className', () => {
                const wrapper = shallow(<InlineTextBox className="test" />);
                expect(wrapper.hasClass('test')).to.be.true
            });
        })
    });
});