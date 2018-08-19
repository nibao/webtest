import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DialogButton from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('#render', () => {
        it('渲染Button子组件', () => {
            const wrapper = shallow(<DialogButton></DialogButton>);
            expect(wrapper.find('Button')).to.have.lengthOf(1);
        });

        it('正确渲染按钮文字内容', () => {
            const wrapper = shallow(<DialogButton>test button</DialogButton>);
            expect(wrapper.find('Button').childAt(0).text()).to.be.equal('test button')
        });

        it('minWidth prop默认80', () => {
            const wrapper = shallow(<DialogButton></DialogButton>);
            expect(wrapper.prop('minWidth')).to.equal(80);
        });
    });
});