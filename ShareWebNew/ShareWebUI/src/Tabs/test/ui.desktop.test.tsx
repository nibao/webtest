import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Tabs from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('Tabs@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(
                    <Tabs>
                        <Tabs.Navigator></Tabs.Navigator>
                        <Tabs.Main></Tabs.Main>
                    </Tabs>)
            })

            it('默认高度100%', () => {
                const wrapper = shallow(
                    <Tabs>
                        <Tabs.Navigator></Tabs.Navigator>
                        <Tabs.Main></Tabs.Main>
                    </Tabs>
                )
                expect(wrapper.prop('style').height).to.equal('100%')
            });

            it('允许自定义高度', () => {
                const wrapper = shallow(
                    <Tabs height={500}>
                        <Tabs.Navigator></Tabs.Navigator>
                        <Tabs.Main></Tabs.Main>
                    </Tabs>
                )
                expect(wrapper.prop('style').height).to.equal(500)
            });
        })
    });
});