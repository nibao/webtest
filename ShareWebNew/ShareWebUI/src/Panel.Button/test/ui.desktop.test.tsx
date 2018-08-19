import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PanelButon from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('PanelButon@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PanelButon></PanelButon>)
            })

            it('渲染结果为Button组件，minWidth设置为80', () => {
                const wrapper = shallow(<PanelButon></PanelButon>)
                expect(wrapper.name()).to.equal('Button')
                expect(wrapper.prop('minWidth')).to.equal(80)
            });

            it('正确渲染按钮文字内容', () => {
                const wrapper = shallow(<PanelButon>test</PanelButon>)
                expect(wrapper.childAt(0).text()).to.equal('test')
            });
        })
    });
});