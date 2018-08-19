import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import NWProvider from '../ui.client';

describe('ShareWebUI', () => {
    describe('NWProvider@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<NWProvider></NWProvider>)
            })

            it('渲染结果包含ToastProvider', () => {
                const wrapper = shallow(<NWProvider><div>test</div></NWProvider>)
                expect(wrapper.name()).to.equal('ToastProvider')                
            });

            it('渲染结果为子组件', () => {
                const wrapper = shallow(<NWProvider><div>test</div></NWProvider>)
                expect(wrapper.contains(<div>test</div>)).to.be.true
            })

            it('设置this.context.window为this.props.window', () => {
                const wrapper = shallow(<NWProvider window={window}><div>test</div></NWProvider>)
                expect(wrapper.instance().getChildContext().getContextWindow()).to.equal(window)
            });
        })
    });
});