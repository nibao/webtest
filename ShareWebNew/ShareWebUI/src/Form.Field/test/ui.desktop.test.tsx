import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormField from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('FormField@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FormField></FormField>)
            });
            it('正确渲染子组件', () => {
                const wrapper = shallow(<FormField><input type="text" /></FormField>)
                expect(wrapper.contains(<input type="text" />)).to.be.true
            });
        });
    });
});