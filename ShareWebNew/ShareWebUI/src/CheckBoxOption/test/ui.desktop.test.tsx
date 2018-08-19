import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CheckBoxOption from '../ui.desktop';
import * as styles from '../styles.desktop.css';

describe('ShareWebUI', () => {
    describe('CheckBoxOption@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<CheckBoxOption></CheckBoxOption>)
                shallow(<CheckBoxOption></CheckBoxOption>)
            });

            it('渲染结果包含CheckBox子组件和一个span', () => {
                const wrapper = shallow(<CheckBoxOption>test</CheckBoxOption>);
                expect(wrapper.find('CheckBox')).have.lengthOf(1);
                expect(wrapper.find('span')).to.have.lengthOf(1);
            });

            it('默认非禁用,Checkbox未禁用，span上无禁用className', () => {
                const wrapper = shallow(<CheckBoxOption>test</CheckBoxOption>);
                expect(wrapper.find('CheckBox').prop('disabled')).to.be.undefined
                expect(wrapper.find('span').hasClass(styles['disabled'])).to.be.false;
            });

            it('允许设置禁用，禁用Checkbox，span上有禁用className', () => {
                const wrapper = shallow(<CheckBoxOption disabled={true}>test</CheckBoxOption>);
                expect(wrapper.find('CheckBox').prop('disabled')).to.be.true
                expect(wrapper.find('span').hasClass(styles['disabled'])).to.be.true;
            });
        });
    });
});