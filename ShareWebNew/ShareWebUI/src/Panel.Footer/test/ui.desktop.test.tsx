import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PanelFooter from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('PanelFooter@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PanelFooter></PanelFooter>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<PanelFooter><div>test</div></PanelFooter>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});