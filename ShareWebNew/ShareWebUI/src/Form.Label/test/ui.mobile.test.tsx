import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FormLabel from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('FormLabel@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<FormLabel></FormLabel>)
            });

            it('渲染正确的子组件', () => {
                const wrapper = shallow(<FormLabel><span>test</span></FormLabel>);
                expect(wrapper.contains(<span>test</span>)).to.be.true
            });

            it('props align为top时className正确', () => {
                const wrapper = shallow(<FormLabel align="top"></FormLabel>);
                expect(wrapper.hasClass(styles['align-top'])).to.be.true
            });
        });
    });
});