import * as React from 'react';
import { noop } from 'lodash';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import ChangePassword from './component.desktop';

declare const { describe, it }

describe('ShareWebComponents', () => {
    describe('<Login />', () => {
        describe('<ChangePassword />', () => {
            describe('component.desktop.tsx', () => {
                it('密码过期', () => {
                    const wrapper = shallow(
                        <ChangePassword errorCode={ 401012 } />
                    );

                    expect(wrapper.contains('Your password has expired, change now?')).to.equals(true);
                });

                it('密码强度系数过低', () => {
                    const wrapper = shallow(
                        <ChangePassword errorCode={ 401013 } />
                    );

                    expect(wrapper.contains('Weak password, change now?')).to.equals(true);
                });

                it('使用初始密码', () => {
                    const wrapper = shallow(
                        <ChangePassword errorCode={ 401017 } />
                    );

                    expect(wrapper.contains('You are not allowed to log in with initial password, change password now?')).to.equals(true);
                });
            })
        })
    })
})