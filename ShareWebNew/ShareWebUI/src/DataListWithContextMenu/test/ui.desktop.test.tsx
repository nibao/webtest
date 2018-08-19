import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DataListWithContextMenu from '../ui.desktop';
import * as sinon from 'sinon';

function ContextMenu({ open, selections, position, onClose }) {
    return (<div></div>)
}
describe('ShareWebUI', () => {
    describe('DataListWithContextMenu@desktop', () => {
        describe('#render', () => {
            it('正确渲染DataList和ContextMenu', () => {
                const wrapper = shallow(<DataListWithContextMenu contextMenu={ContextMenu} />);
                expect(wrapper.find('DataList')).have.lengthOf(1);
                expect(wrapper.find('ContextMenu')).have.lengthOf(1);
            });
        });

        describe('#事件处理', () => {

            it('正确处理handleContextMenu', () => {
                const spy = sinon.spy();
                const wrapper = shallow(<DataListWithContextMenu multiple={true} onSelectionChange={spy} contextMenu={ContextMenu} />);
                wrapper.instance().handleContextMenu({ preventDefault: () => null, clientX: 0, clientY: 0 })
                wrapper.update();
                expect(spy.calledWith(wrapper.state('selections'), true)).to.be.true // onSelectionChange被正确调用               
                expect(wrapper.find('ContextMenu').prop('open')).to.be.true; // contextMenu的open被置为true
            });

            it('正确处理closeContextMenu', () => {
                const wrapper = shallow(<DataListWithContextMenu contextMenu={ContextMenu} />);
                wrapper.instance().closeContextMenu();
                wrapper.update();
                expect(wrapper.find('ContextMenu').prop('open')).to.be.false; // contextMenu的open被置为false
            });
        });
    });
});