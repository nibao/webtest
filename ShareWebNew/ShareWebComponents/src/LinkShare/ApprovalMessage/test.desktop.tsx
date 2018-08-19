import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { noop } from 'lodash';
import ApprovalMessage from './component.desktop';

declare const { describe, it };

describe('ShareWebComponents', () => {
    describe('<LinkShare />', () => {
        describe('<ApprovalMessage />', () => {
            it('正确传递onConfirm事件', () => {
                const onConfirm = spy();

                const wrapper = shallow(
                    <ApprovalMessage
                        onConfirm={ onConfirm }
                        doApprovalCheck={ noop }
                    />
                );

                expect(wrapper.prop('onConfirm')).equals(onConfirm);
            });


            it('正确传递doApprovalCheck方法', () => {
                const doApprovalCheck = spy();

                const wrapper = shallow(
                    <ApprovalMessage
                        onConfirm={ noop }
                        doApprovalCheck={ doApprovalCheck }
                    />
                );

                expect(wrapper.find('a').prop('onClick')).equals(doApprovalCheck);
            })
        })
    })
})