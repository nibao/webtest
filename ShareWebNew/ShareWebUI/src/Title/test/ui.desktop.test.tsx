import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon'
import Title from '../ui.desktop';


describe('ShareWebUI', () => {
    describe('Title@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Title></Title>)
            })

            it('正确渲染子组件', () => {
                const wrapper = shallow(<Title><span>test</span></Title>)
                expect(wrapper.childAt(0).equals(<span>test</span>)).to.be.true
            });

            it('使用PopOver弹出提示框', () => {
                const wrapper = shallow(<Title content="test"></Title>)
                expect(wrapper.find('PopOver')).to.have.lengthOf(1)
            });

            it('默认不弹出提示框', () => {
                const wrapper = shallow(<Title content="test"></Title>)
                expect(wrapper.find('PopOver').prop('open')).to.equal(false)
            });

            it('如果content是字符串，允许自定义提示框className', () => {
                const wrapper = shallow(
                    <Title
                        content="test"
                        className="testClassName"
                    >
                    </Title>
                )

                expect(wrapper.find('PopOver div').hasClass('testClassName')).to.be.true
            });

            it('传入的content为非字符串，直接渲染', () => {
                const wrapper = shallow(
                    <Title
                        content={<span>test</span>}
                        className="testClassName"
                    >
                    </Title>
                )

                expect(wrapper.find('PopOver').contains(<span>test</span>)).to.be.true
            });
        })

        describe('#event', () => {
            describe('鼠标移入移出，正确改变state状态', () => {
                it('移入时，默认延时300ms，设置state.open为true，设置position为鼠标位置;鼠标移出时，设置state.open为false', () => {
                    const wrapper = shallow(<Title content="test"></Title>)

                    const clock = sinon.useFakeTimers()

                    /* 鼠标移入 */
                    wrapper.simulate('mouseEnter', { clientX: 20, clientY: 30 })
                    clock.tick(299) // 时间为299ms时
                    expect(wrapper.state('open')).to.equal(false)
                    expect(wrapper.state('position')).to.deep.equal([0, 0])
                    clock.tick(1) // 时间为300ms时
                    expect(wrapper.state('open')).to.equal(true)
                    expect(wrapper.state('position')).to.deep.equal([20, 50])

                    /* 鼠标移出 */
                    wrapper.simulate('mouseLeave')
                    expect(wrapper.state('open')).to.equal(false)

                    clock.restore()
                });

            });
        });
    });
});