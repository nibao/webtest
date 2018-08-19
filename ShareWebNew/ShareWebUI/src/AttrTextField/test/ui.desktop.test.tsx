import * as React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import AttrTextField from '../ui.desktop'
import * as styles from '../styles.desktop.css';


describe('ShareWebUI', () => {
    describe.skip('AttrTextField(问题太多，建议重写)', () => {
        describe('#render', () => {
            describe('正常显示属性名', () => {
                it('属性名长度大于11个字符时，超出部分显示...', () => {
                    const testName = '中文字符abcd'
                    const wrapper = shallow(
                        <AttrTextField
                            attr={{
                                name: testName,
                                type: 3,
                                value: 'test'
                            }}
                        />
                    )
                    expect(wrapper.find('label').prop('title')).to.equal(testName)
                    expect(wrapper.find('label').text()).to.equal('中文字符...：')
                })

                it('属性名长度小于11个字符时正常显示', () => {
                    const testName = '中文字符abc'
                    const wrapper = shallow(
                        <AttrTextField
                            attr={{
                                name: testName,
                                type: 3,
                                value: 'test'
                            }}
                        />
                    )
                    expect(wrapper.find('label').prop('title')).to.equal(testName)
                    expect(wrapper.find('label').text()).to.equal('中文字符abc：')
                })
            })

            describe('属性为文本类型时', () => {
                const testValue1 = new Array(26).fill('中').join('')
                const testValue2 = testValue1 + 'a' // 26*2+1=53个字符长度
                it('超过52个字符长度，显示下拉显示按钮', () => {

                    const wrapper = shallow(
                        <AttrTextField
                            attr={{
                                name: 'testName',
                                type: 3,
                                value: testValue2
                            }}
                        />
                    )
                    expect(wrapper.find(`.${styles['val']} p`).text()).to.equal(testValue1)
                    expect(wrapper.find(`.${styles['val']} span`).contains('▼')).to.be.true
                })

                it('不超过52个字符时，不显示下拉提示按钮', () => {
                    const wrapper = shallow(
                        <AttrTextField
                            attr={{
                                name: 'testName',
                                type: 3,
                                value: 'testValue1'
                            }}
                        />
                    )
                    expect(wrapper.find(`.${styles['val']} p`).prop('title')).to.equal(testValue1)
                    expect(wrapper.find(`.${styles['val']} p`).text()).to.equal(testValue1)
                    expect(wrapper.find(`.${styles['val']} span`).exists()).to.be.false
                })

            });

            it('属性为时间类型，格式化后显示', () => {
                const time = 4788
                const wrapper = shallow(
                    <AttrTextField
                        attr={{
                            name: 'time',
                            type: 4,
                            value: time
                        }}
                    />
                )
                expect(wrapper.find(`.${styles['val']} p`).prop('title')).to.equal(time)
                expect(wrapper.find(`.${styles['val']} p`).text()).to.equal('01:19:48')
            })

            it('属性为数字类型，正确显示', () => {
                const wrapper = shallow(
                    <AttrTextField
                        attr={{
                            name: 'number',
                            type: 2,
                            value: 0
                        }}
                    />
                )
                expect(wrapper.find(`.${styles['val']} p`).prop('title')).to.equal(0)
                expect(wrapper.find(`.${styles['val']} p`).text()).to.equal('0')
            })

            it('属性为枚举类型时，正确显示', () => {
                const wrapper = shallow(
                    <AttrTextField
                        attr={{
                            name: 'number',
                            type: 1,
                            value: { 0: 'test0', 1: 'test1' }
                        }}
                    />
                )
                expect(wrapper.find(`.${styles['val']} p`).prop('title')).to.deep.equal({ 0: 'test0', 1: 'test1' })
                expect(wrapper.find(`.${styles['val']} p`).text()).to.equal('test0')
            })

            it('属性为层级类型时，正确显示', () => {
                
            });

        })
    })
})