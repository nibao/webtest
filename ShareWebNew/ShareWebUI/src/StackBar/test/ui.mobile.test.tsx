import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import StackBar from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('StackBar@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<StackBar></StackBar>)
            })

            it('默认宽度100%', () => {
                const wrapper = shallow(<StackBar></StackBar>)
                expect(wrapper.prop('style')).to.deep.equal({ width: '100%' })
            });

            it('允许自定义width', () => {
                const wrapper = shallow(<StackBar width={50}></StackBar>)
                expect(wrapper.prop('style')).to.deep.equal({ width: 50 })
            });
            it('文字内容正确', () => {
                const wrapper = shallow(<StackBar>test</StackBar>)
                expect(wrapper.childAt(0).text()).to.equal('test')
            });
        })
    });
});