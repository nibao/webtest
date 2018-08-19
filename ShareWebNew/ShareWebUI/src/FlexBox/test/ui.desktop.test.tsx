import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FlexBox from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('FlexBox@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FlexBox></FlexBox>);
            });
            it('正确渲染子组件', () => {
                const wrapper = shallow(<FlexBox><div>test</div></FlexBox>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        });
    });
});