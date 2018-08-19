import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormRow from '../ui.desktop';
import { spawn } from 'child_process';

describe('ShareWebUI', () => {
    describe('FormRow@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FormRow></FormRow>)
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<FormRow><span>test</span></FormRow>);
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });
        });
    });
});