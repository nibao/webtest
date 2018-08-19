import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import MenuItem from '../ui.mobile';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('MenuItem@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<MenuItem onClick={() => { }}></MenuItem>)
            })
            it('正确渲染子组件', () => {
                const wrapper = shallow(
                    <MenuItem onClick={() => { }}>
                        <span>test</span>
                    </MenuItem>
                )
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });
        })
        describe('#event', () => {
            it('触发点击事件时调用onClick事件回调', () => {
                const spy = sinon.spy();
                const wrapper = shallow(
                    <MenuItem onClick={spy}>
                        <span>test</span>
                    </MenuItem>
                )
                wrapper.simulate('click')
                expect(spy.calledOnce).to.be.true
            });

        });
    });
});