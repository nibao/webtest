import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import Overlay from '../../../ui/Overlay/ui.desktop';
import SendSuccessMessage from './component.desktop';

declare const { describe, it };

describe('ShareWebComponents', () => {
    describe('<LinkShare />', () => {
        describe('<SendSuccessMessage />', () => {
            describe('component.desktop.tsx', () => {
                it('正确渲染浮动提示', () => {
                    const wrapper = shallow(
                        <SendSuccessMessage />
                    );

                    expect(wrapper.equals(<Overlay position="top center">Emails have been sent successfully</Overlay>)).equals(true)
                })
            })
        })
    })
})