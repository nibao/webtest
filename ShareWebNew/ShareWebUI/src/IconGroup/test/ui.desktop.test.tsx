import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IconGroup from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('IconGroup', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<IconGroup></IconGroup>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<IconGroup className="test"></IconGroup>);
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<IconGroup><span>test</span></IconGroup>);
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });
        })
    });
});