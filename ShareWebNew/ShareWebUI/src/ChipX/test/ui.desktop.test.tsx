import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import ChipX from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('ChipX@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ChipX />)
            });

            it('渲染结果为a标签，文字内容为X', () => {
                const wrapper = shallow(<ChipX />)
                expect(wrapper.find('a')).to.have.lengthOf(1)
                expect(wrapper.find('a').contains('X')).to.be.true
            });
        });
        describe('#onClick', () => {
            it('正确处理点击事件', () => {
                const spy = sinon.spy()
                const wrapper = shallow(<ChipX onClick={spy} />);
                wrapper.simulate('click');
                expect(spy.calledOnce).to.be.true;
            });
        });
    });
});