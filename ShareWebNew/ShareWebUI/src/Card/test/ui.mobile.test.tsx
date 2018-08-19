import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Card from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Card@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Card></Card>);
            });
            it('正确渲染', () => {
                const wrapper = shallow(<Card><div>test</div></Card>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

            it('自定义className', () => {
                const wrapper = shallow(<Card className='test'></Card>);
                expect(wrapper.hasClass('test')).to.be.true
            });
        });
    });
});