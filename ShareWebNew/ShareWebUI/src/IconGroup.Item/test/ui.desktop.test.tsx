import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IconGroupItem from '../ui.desktop';
import * as styles from '../styles.desktop.css'

describe('ShareWebUI', () => {
    describe('', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<IconGroupItem />)
            })
            
            it('渲染结果为UIIcon子组件', () => {
                const wrapper = shallow(<IconGroupItem />);
                expect(wrapper.name()).to.equal('UIIcon')
            });

            it('允许自定义className', () => {
                const wrapper = shallow(<IconGroupItem className="test" />);
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('正确传递code', () => {
                const wrapper = shallow(<IconGroupItem code="\uf014" />);
                expect(wrapper.prop('code')).to.equal('\uf014')
            });

            it('正确处理禁用', () => {
                const wrapper = shallow(<IconGroupItem disabled={true} />);
                expect(wrapper.prop('disabled')).to.equal(true)
                expect(wrapper.hasClass(styles['enabled'])).to.be.false            
            });
        })
    });
});