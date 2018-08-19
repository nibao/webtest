import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Mask from '../ui.client';
import * as styles from '../styles.client.css';

describe('ShareWebUI', () => {
    describe('Mask@client', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Mask />)
            })

            it('样式引用正确', () => {
                const wrapper = shallow(<Mask />)
                expect(wrapper.hasClass(styles['mask']))
            })
        })
    });
});