import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TabsNavigator from '../ui.desktop';
import TabsTab from '../../Tabs.Tab/ui.desktop'
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('TabsNavigator@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(
                    <TabsNavigator>
                        {[<TabsTab></TabsTab>]}
                    </TabsNavigator>
                )
            })

            it('允许自定义className', () => {
                const wrapper = shallow(
                    <TabsNavigator className="test">
                        {[<TabsTab></TabsTab>]}
                    </TabsNavigator>
                )
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('默认激活第一个tab', () => {
                const wrapper = shallow(
                    <TabsNavigator className="test">
                        {[<TabsTab></TabsTab>, <TabsTab></TabsTab>]}
                    </TabsNavigator>
                )
                expect(wrapper.find('TabsTab')).to.have.lengthOf(2)
                expect(wrapper.find('TabsTab').at(0).prop('active')).be.true
                expect(wrapper.find('TabsTab').at(1).prop('active')).be.false
            });

            it('调用navigate处理函数时，正确切换激活tab，触发onNavigate回调', () => {
                const onNavigateSpy = sinon.spy();
                const wrapper = shallow(
                    <TabsNavigator className="test" onNavigate={onNavigateSpy}>
                        {[<TabsTab></TabsTab>, <TabsTab></TabsTab>]}
                    </TabsNavigator>
                )
                wrapper.instance().navigate(1); // 激活第二个tab
                wrapper.update();

                expect(wrapper.find('TabsTab').at(0).prop('active')).be.false
                expect(wrapper.find('TabsTab').at(1).prop('active')).be.true

                expect(onNavigateSpy.calledWith(1)).to.be.true
            });
        })
    });
});