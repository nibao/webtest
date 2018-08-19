import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DataGridCell from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('DataGrid.Cell@desktop', () => {
        describe('#render', () => {
            it('正确渲染', () => {
                const wrapper = shallow(<DataGridCell><span>test</span></DataGridCell>);
                expect(wrapper.type()).to.be.equal('td')               
                expect(wrapper.children().equals(<span>test</span>)).to.be.true
            });
        });
    });
});