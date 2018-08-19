import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import InlineValidateBox from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('InlineValidateBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<InlineValidateBox />)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<InlineValidateBox className="test" />);
                expect(wrapper.hasClass('test')).to.be.true
            });
        })
    });
});