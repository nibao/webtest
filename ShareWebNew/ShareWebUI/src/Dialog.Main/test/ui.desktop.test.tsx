import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DialogMain from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('DialogMain@desktop', () => {
        describe('#render', () => {
            it('正确渲染子组件', () => {
                const wrapper = shallow(<DialogMain><span>test</span></DialogMain>);
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });
        });
    });
});