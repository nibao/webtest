import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import PopMenuItem from '../ui.mobile';
import * as styles from '../styles.mobile.css'


describe('ShareWebUI', () => {
    describe('PopMenuItem@mobile', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<PopMenuItem></PopMenuItem>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<PopMenuItem className="test"></PopMenuItem>);
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许传入任意属性', () => {
                const wrapper = shallow(<PopMenuItem anyProp="test"></PopMenuItem>);
                expect(wrapper.prop('anyProp')).to.equal('test')
            });

            describe('传入icon：', () => {
                it('icon为字符串时，将字符串视为UIIcon的code属性', () => {
                    const wrapper = shallow(<PopMenuItem icon="\uf123"></PopMenuItem>);
                    expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                    expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf123')
                });

                it('icon为组件时，渲染icon', () => {
                    const wrapper = shallow(<PopMenuItem icon={<span>test</span>}></PopMenuItem>);
                    expect(wrapper.contains(<span>test</span>)).to.be.true
                });
            });

            it('传入label时，正确设置label', () => {
                const wrapper = shallow(<PopMenuItem label="label"></PopMenuItem>);
                expect(wrapper.find(`.${styles['label']}`).text()).to.equal('label')
            });

            it('正确渲染传入的子组件', () => {
                const wrapper = shallow(<PopMenuItem><div>test</div></PopMenuItem>);
                expect(wrapper.contains(<div>test</div>)).to.be.true
            });

        })
    });
});