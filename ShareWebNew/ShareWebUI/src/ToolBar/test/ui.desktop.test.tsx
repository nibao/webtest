import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ToolBar from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ToolBar', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ToolBar></ToolBar>)
            })

            it('正确渲染包裹的子元素', () => {
                const wrapper = shallow(<ToolBar><span>test</span></ToolBar>)
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });

        })
    });
});