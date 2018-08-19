import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PanelMain from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('PanelMain@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PanelMain></PanelMain>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<PanelMain><div>test</div></PanelMain>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});