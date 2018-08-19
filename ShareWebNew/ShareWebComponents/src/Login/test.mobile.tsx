import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Login from './component.mobile';

declare const { describe, it };

describe('ShareWebComponents', () => {
    describe('<Login />', () => {
        describe('component.mobile.tsx', () => {
            describe('#render', () => {
                it('渲染组件', () => {
                    const wrapper = shallow(
                        <Login />
                    );

                    expect(wrapper).not.equal(null);
                });
            });
        })
    });
});


































































































