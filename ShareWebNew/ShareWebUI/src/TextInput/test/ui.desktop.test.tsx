import * as React from 'react';
import { noop } from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import TextInput from '../ui.desktop';

declare const { describe, it };

describe('ShareWebUI', () => {
    describe('TextInput@desktop', () => {
        describe('#render', () => {
            describe('#render-text', () => {
                const wrapper = shallow(
                    <TextInput
                        type="text"
                        value="初始值"
                    />
                );

                it('#渲染textinput', () => {
                    expect(wrapper.prop('type')).equal('text');
                });

                it('#初始值检查', () => {
                    expect(wrapper.prop('value')).equal('初始值');
                });
            });

            describe('#render-password', () => {
                const spy = sinon.spy();
                const wrapper = shallow(
                    <TextInput
                        type="password"
                        placeholder="Please enter your password."
                        onClick={ spy }
                    />
                );

                it('#渲染password组件', () => {
                    expect(wrapper.prop('type')).equal('password');
                });

                it('#placeholder', () => {
                    expect(wrapper.prop('placeholder')).to.equal('Please enter your password.');
                });

                it('#clickEvent', () => {
                    wrapper.simulate('click', { stopPropagation: noop });
                    expect(spy.calledOnce).to.equal(true);
                });
            });

            describe('#onChange', () => {
                it('#输入字符', () => {
                    const onChange = (value, wrapper) => {
                        wrapper.update();
                        expect(value).to.equal('a');
                        expect(wrapper.find('input').prop('value')).to.equal('a');
                    };

                    const wrapper = shallow(
                        <TextInput
                            type="text"
                            value="初始值"
                            onChange={ (value) => onChange(value, wrapper) }
                        />
                    );

                    wrapper.find('input').simulate('change', { target: { value: 'a' } });

                });
            });
        });
    });
});