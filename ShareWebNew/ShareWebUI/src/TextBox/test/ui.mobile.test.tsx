import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TextBox from '../ui.mobile';
import * as styles from '../styles.mobile.css';


describe('ShareWebUI', () => {
    describe('TextBox@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TextBox />)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<TextBox className="test" />)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('正确设置禁用', () => {
                const wrapper = shallow(<TextBox disabled={true} />)
                expect(wrapper.hasClass(styles['disabled'])).to.be.true
                expect(wrapper.find('TextInput').prop('disabled')).to.be.true
            });
        })
    });
});