import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Expand from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Expand@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                mount(<Expand></Expand>)
            });
            it('渲染正确的子组件', () => {
                const wrapper = mount(<Expand><div>test</div></Expand>)
                expect(wrapper.contains(<div>test</div>))
            });
        });

    });
});