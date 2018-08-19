import * as React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Form from '../ui.desktop';
import FormRow from '../../Form.Row/ui.desktop';
import FormLabel from '../../Form.Label/ui.desktop';
import FormField from '../../Form.Field/ui.desktop';
import * as sinon from 'sinon';

describe('ShareWebUI', () => {
    describe('Form@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Form></Form>)
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<Form className="test"></Form>);
                expect(wrapper.hasClass('test')).to.be.true
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

        describe('#event', () => {
            it('提交时触发提交onSubmit处理函数', () => {
                const spy = sinon.spy();
                const wrapper = mount(<Form onSubmit={spy}><Form.Row></Form.Row></Form>);
                wrapper.simulate('submit')
                expect(spy.calledOnce).to.be.true
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