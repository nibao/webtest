import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DataGridField from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('DataGridField@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<DataGridField></DataGridField>)
            });

            it('默认宽度100', () => {
                const wrapper = shallow(<DataGridField><td>test</td></DataGridField>);
                expect(wrapper.prop('width')).to.equal(100);
            });

            it('允许自定义宽度', () => {
                const wrapper = shallow(<DataGridField width={200}><td>test</td></DataGridField>);
                expect(wrapper.prop('width')).to.equal(200);
            });


        });
    });
});