import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Panel from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Panel@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Panel></Panel>)
            })

            it('正确渲染子节点', () => {
                const wrapper = shallow(<Panel><div>test</div></Panel>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });
        })
    });
});