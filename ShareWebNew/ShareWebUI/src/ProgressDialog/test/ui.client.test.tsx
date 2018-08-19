import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ProgressDialog from '../ui.client';

describe('ShareWebUI', () => {
    describe('ProgressDialog@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<ProgressDialog />)
            })

            it('Dialog默认宽度440', () => {
                const wrapper = shallow(<ProgressDialog />)
                expect(wrapper.find('Dialog').prop('width')).to.equal(440)
            });
        })

    });
});