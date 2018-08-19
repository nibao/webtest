import * as React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EmptyResult from '../ui.desktop'
import * as styles from '../styles.desktop'


describe('ShareWebUI', () => {
    describe('EmptyResult@dekstop', () => {
        describe('#render', () => {

            it('传入code时，使用UIIcon进行渲染', () => {
                const wrapper = shallow(<EmptyResult code="\uf124" />)
                expect(wrapper.find('UIIcon').exists()).to.be.true
                expect(wrapper.find('img').exists()).to.be.false
            });

            it('允许自定义UIIcon size', () => {
                const wrapper = shallow(<EmptyResult code="\uf124" size={20} />)
                expect(wrapper.find('UIIcon').prop('size')).to.equal(20)
            });

            it('未传code,传入picture，使用<img src={picture}>渲染', () => {
                const wrapper = shallow(<EmptyResult picture="pictureSrc" />)
                expect(wrapper.find('img').prop('src')).to.equal('pictureSrc')
            });

            it('当使用<img>渲染，允许自定义width height', () => {
                const wrapper = shallow(
                    <EmptyResult
                        picture="pictureSrc"
                        size={20}
                    />
                )
                expect(wrapper.find('img').prop('style')).to.deep.equal({ width: 20, height: 20 })
            });

            it('允许自定义提示文字', () => {
                const wrapper = shallow(
                    <EmptyResult
                        details="提示文字"
                    />
                )
                expect(wrapper.find(`.${styles['text']}`).contains('提示文字')).to.be.true
            });

            it('允许自定义提示文字字体名称', () => {
                const wrapper = shallow(
                    <EmptyResult
                        details="提示文字"
                        font="AnyShare"
                    />
                )
                expect(wrapper.find(`.${styles['text']}`).prop('style')).include({ fontFamily: 'AnyShare' })
            });

            it('允许自定义提示文字字体大小', () => {
                const wrapper = shallow(
                    <EmptyResult
                        details="提示文字"
                        fontSize={20}
                    />
                )
                expect(wrapper.find(`.${styles['text']}`).prop('style')).include({ fontSize: 20 })

            });

            it('允许自定义提示文字字体颜色', () => {
                const wrapper = shallow(
                    <EmptyResult
                        details="提示文字"
                        color="#ccc"
                    />
                )
                expect(wrapper.find(`.${styles['text']}`).prop('style')).include({ color: '#ccc' })
            });

        })
    })
})