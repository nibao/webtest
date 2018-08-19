import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TabsContent from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Tabs.Content@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TabsContent></TabsContent>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<TabsContent className="test"></TabsContent>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<TabsContent><div>test</div></TabsContent>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});