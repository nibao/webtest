import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Toast from '../ui.desktop';
import * as styles from '../styles.desktop.css'
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('Toast@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Toast></Toast>)
            })

            it('传入code时，渲染内容前的UIIcon', () => {
                const wrapper = shallow(<Toast code="\uf222" otherProps="otherProps"></Toast>)
                expect(wrapper.find(`.${styles['icon']}`).exists()).to.be.true
                expect(wrapper.find(`.${styles['icon']}`).prop('code')).to.equal('\uf222')
                expect(wrapper.find(`.${styles['icon']}`).prop('otherProps')).to.equal('otherProps')
            })

            it('正确渲染toast内容', () => {
                const wrapper = shallow(<Toast>testTotast</Toast>)
                expect(wrapper.find(`.${styles['text']}`).text()).to.equal('testTotast')
            });

            it('默认closable为false，不渲染关闭UIIcon按钮', () => {
                const wrapper = shallow(<Toast></Toast>)
                expect(wrapper.find(`.${styles['close']}`).exists()).to.be.false
            });

            it('closable为true时，渲染关闭UIIcon按钮，正确传递onClose回调', () => {
                const onCloseSpy = sinon.spy()
                const wrapper = shallow(
                    <Toast
                        closable={true}
                        onClose={onCloseSpy}
                    >
                    </Toast>
                )
                expect(wrapper.find(`.${styles['close']}`).exists()).to.be.true
                expect(wrapper.find(`.${styles['close']}`).prop('code')).to.equal('\uf046')
                expect(wrapper.find(`.${styles['close']}`).prop('onClick')).to.equal(onCloseSpy)
            });

        })
    });
});