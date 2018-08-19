import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DateBox from '../ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('DateBox@desktop', () => {
        describe('#render', () => {
            it('渲染正确', () => {
                const wrapper = shallow(<DateBox format='yyyy/MM/dd' />);
                expect(wrapper.name()).to.equal('DropBox')
                expect(wrapper.children().name()).to.equal('DatePicker')
            });
        });
        describe('#lifcycle', () => {
            it('正确触发componentWillReceiveProps', () => {
                const spy = sinon.spy(DateBox.prototype, 'componentWillReceiveProps');
                const wrapper = shallow(<DateBox format='yyyy/MM/dd' />);
                const testDate = new Date(2016, 6, 17)
                wrapper.setProps({ value: testDate })
                expect(spy.args[0][0].value).to.equal(testDate)
                spy.restore();
            });
        });
        describe('#事件处理', () => {
            it('改变选中日期', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DateBox onChange={spy} format='yyyy/MM/dd' />);
                const testDate = new Date(2016, 6, 17)
                wrapper.setProps({ value: testDate })
                expect(wrapper.state()).to.deep.equal({ value: testDate, active: false })
                expect(spy.calledWith(testDate)).to.be.true
            });
        });
    });
});