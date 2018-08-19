import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import List2 from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('List2@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<List2></List2>)
            })

            it('正确渲染div包裹的子组件', () => {
                const wrapper = shallow(<List2><div>test</div></List2>);
                expect(wrapper.type()).to.equal('div')
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});