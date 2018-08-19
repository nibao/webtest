import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import WizardStep from '../ui.desktop';
import * as styles from '../styles.desktop.css';

describe('ShareWebUI', () => {
    describe('WizardStep@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<WizardStep></WizardStep>)
            })

            it('正确渲染子元素', () => {
                const wrapper = shallow(<WizardStep><div>test</div></WizardStep>)
                expect(wrapper.contains(<div>test</div>)).to.be.true

            });

            it('active为false时，正确设置className隐藏组件', () => {
                const wrapper = shallow(<WizardStep active={false}></WizardStep>)
                expect(wrapper.hasClass(styles['active'])).to.be.false
            });

            it('active为false时，正确设置className显示组件', () => {
                const wrapper = shallow(<WizardStep active={true}></WizardStep>)
                expect(wrapper.hasClass(styles['active'])).to.be.true
            });
        })
    });
});