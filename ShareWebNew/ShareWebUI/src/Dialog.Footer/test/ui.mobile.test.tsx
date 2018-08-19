import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DialogFooter from '../ui.mobile';

describe('ShareWebUI', () => {
    describe('Dialog.Footer@mobile', () => {
        describe('#render', () => {
            it('应该包含传入的子组件', () => {
                const wrapper = shallow(<DialogFooter><div>test</div></DialogFooter>);
                expect(wrapper.contains(<div>test</div>)).to.be.true;
            });
        });
    });
});