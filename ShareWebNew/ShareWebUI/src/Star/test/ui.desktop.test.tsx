import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Star from '../ui.desktop';
import __ from '../locale'
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('Start@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Star />)
            })

            describe('当可评分时，即传入onStar回调时', () => {
                it('渲染5个FontIcon', () => {
                    const wrapper = shallow(<Star onStar={() => { }} />)
                    expect(wrapper.find('FontIcon')).to.have.lengthOf(5)
                });

                it('默认5个FontIcon未高亮(默认当前分数为0)', () => {
                    const wrapper = shallow(
                        <Star
                            size={10}
                            color="#ddd"
                            dashed="dashed"
                            solid="solid"
                            solidFallback="solidFallback"
                            dashedFallback="dashedFallback"
                            onStar={() => { }}
                        />
                    )
                    wrapper.find('FontIcon').forEach((FontIcon, index) => {
                        expect(FontIcon.prop('color')).to.equal('#aaa')
                        expect(FontIcon.prop('code')).to.equal('dashed')
                        expect(FontIcon.prop('fallback')).to.equal('dashedFallback')
                        expect(FontIcon.prop('title')).to.equal(__('${score}分', { score: index + 1 }))
                    })
                });

                it('当前分数为1分时，高亮第一个FontIcon', () => {
                    const wrapper = shallow(
                        <Star
                            score={1}
                            size={10}
                            color="#ddd"
                            dashed="dashed"
                            solid="solid"
                            solidFallback="solidFallback"
                            dashedFallback="dashedFallback"
                            onStar={() => { }}
                        />
                    )
                    wrapper.find('FontIcon').forEach((FontIcon, index) => {
                        if (index === 0) {
                            expect(FontIcon.prop('color')).to.equal('#ddd')
                            expect(FontIcon.prop('code')).to.equal('solid')
                            expect(FontIcon.prop('fallback')).to.equal('solidFallback')
                        } else {
                            expect(FontIcon.prop('color')).to.equal('#aaa')
                            expect(FontIcon.prop('code')).to.equal('dashed')
                            expect(FontIcon.prop('fallback')).to.equal('dashedFallback')
                        }
                        expect(FontIcon.prop('title')).to.equal(__('${score}分', { score: index + 1 }))
                    })
                });

                it('当分数为5分时，高亮所有的FontIcon', () => {
                    const wrapper = shallow(
                        <Star
                            score={5}
                            size={10}
                            color="#ddd"
                            dashed="dashed"
                            solid="solid"
                            solidFallback="solidFallback"
                            dashedFallback="dashedFallback"
                            onStar={() => { }}
                        />
                    )
                    wrapper.find('FontIcon').forEach((FontIcon, index) => {
                        expect(FontIcon.prop('color')).to.equal('#ddd')
                        expect(FontIcon.prop('code')).to.equal('solid')
                        expect(FontIcon.prop('fallback')).to.equal('solidFallback')
                        expect(FontIcon.prop('title')).to.equal(__('${score}分', { score: index + 1 }))
                    })
                });
            });
        })

        describe('#event', () => {
            it('onMouseOver的时候正确改变高亮显示，onMouseLeave时还原高亮', () => {
                const wrapper = shallow(
                    <Star
                        score={1}
                        size={10}
                        color="#ddd"
                        dashed="dashed"
                        solid="solid"
                        solidFallback="solidFallback"
                        dashedFallback="dashedFallback"
                        onStar={() => { }}
                    />
                )
                /* 模拟鼠标移入第4个 */
                wrapper.find('FontIcon').at(3).simulate('mouseOver')
                wrapper.find('FontIcon').forEach((FontIcon, index) => {
                    if (index <= 3) {
                        expect(FontIcon.prop('color')).to.equal('#ddd')
                        expect(FontIcon.prop('code')).to.equal('solid')
                        expect(FontIcon.prop('fallback')).to.equal('solidFallback')
                    } else {
                        expect(FontIcon.prop('color')).to.equal('#aaa')
                        expect(FontIcon.prop('code')).to.equal('dashed')
                        expect(FontIcon.prop('fallback')).to.equal('dashedFallback')
                    }
                    expect(FontIcon.prop('title')).to.equal(__('${score}分', { score: index + 1 }))
                })
                /* 模拟鼠标移出第4个 */
                wrapper.find('FontIcon').at(3).simulate('mouseLeave')
                wrapper.find('FontIcon').forEach((FontIcon, index) => {
                    if (index === 0) {
                        expect(FontIcon.prop('color')).to.equal('#ddd')
                        expect(FontIcon.prop('code')).to.equal('solid')
                        expect(FontIcon.prop('fallback')).to.equal('solidFallback')
                    } else {
                        expect(FontIcon.prop('color')).to.equal('#aaa')
                        expect(FontIcon.prop('code')).to.equal('dashed')
                        expect(FontIcon.prop('fallback')).to.equal('dashedFallback')
                    }
                    expect(FontIcon.prop('title')).to.equal(__('${score}分', { score: index + 1 }))
                })
            });

            it('点击时，正确触发onClick回调', () => {
                const onStarSpy = sinon.spy();
                const wrapper = shallow(
                    <Star
                        score={1}
                        size={10}
                        color="#ddd"
                        dashed="dashed"
                        solid="solid"
                        solidFallback="solidFallback"
                        dashedFallback="dashedFallback"
                        onStar={onStarSpy}
                    />
                )
                /* 点击第1个 */
                wrapper.find('FontIcon').at(0).simulate('click')
                expect(onStarSpy.calledWith(1)).to.be.true

                /* 点击第5个 */
                wrapper.find('FontIcon').at(4).simulate('click')
                expect(onStarSpy.calledWith(5)).to.be.true

                /* 点击中间任意一个 */
                wrapper.find('FontIcon').at(3).simulate('click')
                expect(onStarSpy.calledWith(4)).to.be.true

            });

        });
    });
});