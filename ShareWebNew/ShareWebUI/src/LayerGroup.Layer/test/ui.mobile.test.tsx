import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LayerGroupLayer from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('LayerGroupLayer@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<LayerGroupLayer></LayerGroupLayer>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<LayerGroupLayer><div>test</div></LayerGroupLayer>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});