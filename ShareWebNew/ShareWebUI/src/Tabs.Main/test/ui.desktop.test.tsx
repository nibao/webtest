import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TabsMain from '../ui.desktop';
import TabsContent from '../../Tabs.Content/ui.desktop'
describe('ShareWebUI', () => {
    describe('TabsMain@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TabsMain></TabsMain>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<TabsMain className="test"></TabsMain>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('传入TabsContent组件构成的数组，只渲染数组下标为activeIndex的组件', () => {
                const wrapper = shallow(<TabsMain activeIndex={1}>{[<TabsContent></TabsContent>,<TabsContent className="test"></TabsContent>]}</TabsMain>)
                expect(wrapper.find('TabsContent')).to.have.lengthOf(1)
                expect(wrapper.find('TabsContent').hasClass('test')).to.be.true
            });
        })
    });
});