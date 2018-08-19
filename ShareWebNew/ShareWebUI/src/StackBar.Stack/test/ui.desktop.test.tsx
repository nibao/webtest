import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import Stack from '../ui.desktop';

describe('ShareWebUI', () => {
    describe('', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Stack></Stack>)
            })

            it('允许自定义className', () => {
                const wrapper = shallow(<Stack className="test"></Stack>)
                expect(wrapper.hasClass('test')).to.be.true
            });

            it('允许自定义backgroundColor', () => {
                const wrapper = shallow(<Stack background="#fff"></Stack>)
                expect(wrapper.prop('style').backgroundColor).to.equal('#fff')
            });

            it('渲染文字内容正确', () => {
                const wrapper = shallow(<Stack>test</Stack>)
                expect(wrapper.childAt(0).text()).to.equal('test')
            });

            describe('允许通过rate自定义宽度', () => {
                it('rate大于1时，设置宽度为100%', () => {
                    const wrapper = shallow(<Stack rate={1.01}></Stack>)
                    expect(wrapper.prop('style').width).to.equal('100%')
                });

                it('rate小于0时，设置宽度为0%', () => {
                    const wrapper = shallow(<Stack rate={-0.1}></Stack>)
                    expect(wrapper.prop('style').width).to.equal('0%')
                });

                it('rate为[0,1]时，设置宽度为(rate*100)%', () => {
                    let wrapper;
                    wrapper = shallow(<Stack rate={0}></Stack>)
                    expect(wrapper.prop('style').width).to.equal('0%')

                    wrapper = shallow(<Stack rate={1}></Stack>)
                    expect(wrapper.prop('style').width).to.equal('100%')

                    wrapper = shallow(<Stack rate={0.99}></Stack>)
                    expect(wrapper.prop('style').width).to.equal('99%')
                });
            });
        })
    });
});