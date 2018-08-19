import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ToolBarButton from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ToolBar.Button@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ToolBarButton></ToolBarButton>)
            })

            it('渲染结果为PlainButton组件，包含正确的按钮文字', () => {
                const wrapper = shallow(<ToolBarButton>Button</ToolBarButton>)
                expect(wrapper.name()).to.equal('PlainButton')
                expect(wrapper.find('PlainButton').childAt(0).text()).to.equal('Button')
            });

            it('传入任意参数将直接传递给PlainButton', () => {
                const wrapper = shallow(<ToolBarButton otherProps="otherProps">Button</ToolBarButton>)
                expect(wrapper.find('PlainButton').prop('otherProps')).to.equal('otherProps')
            });
        })
    });
});