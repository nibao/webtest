import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LayerGroup from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('LayerGroup', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<LayerGroup></LayerGroup>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<LayerGroup><div>test</div></LayerGroup>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});