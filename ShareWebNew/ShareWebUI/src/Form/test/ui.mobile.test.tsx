import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Form from '../ui.mobile';
import FormRow from '../../Form.Row/ui.mobile';
import FormLabel from '../../Form.Label/ui.mobile';
import FormField from '../../Form.Field/ui.mobile';

describe('ShareWebUI', () => {
    describe('Form@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Form></Form>)
            });

            it('正确渲染子组件', () => {
                const wrapper = shallow(<Form><Form.Row></Form.Row></Form>);
                expect(wrapper.find('FormRow')).to.have.lengthOf(1)
            });

            it('允许传入自定义属性', () => {
                const wrapper = shallow(<Form testProps1="test1" testProps2="test2"></Form>);
                expect(wrapper.prop('testProps1')).to.equal('test1')
                expect(wrapper.prop('testProps2')).to.equal('test2')
            });
        });

        describe('#export', () => {
            it('导出正确', () => {
                expect(Form.Row).to.equal(FormRow)
                expect(Form.Label).to.equal(FormLabel)
                expect(Form.Field).to.equal(FormField)
            });
        });
    });
});