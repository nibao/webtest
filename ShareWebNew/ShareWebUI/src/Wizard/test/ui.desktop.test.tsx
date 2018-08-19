import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Wizard from '../ui.desktop';
import * as sinon from 'sinon';
import * as styles from '../styles.desktop.css';
import __ from '../locale';



describe('ShareWebUI', () => {
    describe('Wizard@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<Wizard></Wizard>)
            })

            it('允许自定义弹窗title', () => {
                const wrapper = shallow(<Wizard title="test"></Wizard>)
                expect(wrapper.find('Dialog').prop('title')).to.equal('test')
            });

            it('正确设置onCancel回调到Dialog的onClose中', () => {
                const onCancelSpy = sinon.spy();
                const wrapper = shallow(<Wizard onCancel={onCancelSpy}></Wizard>)
                expect(wrapper.find('Dialog').prop('onClose')).to.equal(onCancelSpy)
            });

            it('正确渲染引导区', () => {
                const wrapper = shallow(
                    <Wizard
                        title="test"
                        onCancel={() => { }}
                    >
                        <Wizard.Step title="stepTitle0">
                            stepContent0
                        </Wizard.Step>
                        <Wizard.Step title="stepTitle1">
                            stepContent1
                        </Wizard.Step>
                        <Wizard.Step title="stepTitle2">
                            stepContent2
                        </Wizard.Step>
                    </Wizard>
                )

                /* 正确渲染标题栏 */
                const crumbs = wrapper.find(`.${styles['crumbs']}`)
                expect(crumbs.children()).to.have.lengthOf(3)
                crumbs.children().forEach((node, index) => {
                    if (index === 0) {
                        expect(node.hasClass(styles['active'])).to.be.true
                    } else {
                        expect(node.hasClass(styles['active'])).to.be.false
                    }
                    expect(node.text()).to.equal(`stepTitle${index}`)
                })

                /* 正确渲染内容区 */
                const WizardStepList = wrapper.find('PanelMain > div > WizardStep')
                expect(WizardStepList).to.have.lengthOf(3)
                WizardStepList.forEach((node, index) => {
                    if (index === 0) {
                        expect(node.prop('active')).to.be.true
                    } else {
                        expect(node.prop('active')).to.be.false
                    }
                    expect(node.contains(`stepContent${index}`)).to.be.true
                })

            });


            describe('正确渲染引导按钮', () => {
                const wrapper = shallow(
                    <Wizard
                        title="test"
                        onCancel={() => { }}
                    >
                        <Wizard.Step title="stepTitle0">
                            stepContent0
                        </Wizard.Step>
                        <Wizard.Step title="stepTitle1">
                            stepContent1
                        </Wizard.Step>
                        <Wizard.Step title="stepTitle2">
                            stepContent2
                        </Wizard.Step>
                    </Wizard>
                )
                it('处于第一步时，渲染“下一步”和“取消”按钮', () => {
                    const PanelButtons = wrapper.find('PanelButton')
                    expect(PanelButtons).to.have.lengthOf(2)
                    expect(PanelButtons.at(0).childAt(0).text()).to.equal(__('下一步'))
                    expect(PanelButtons.at(1).childAt(0).text()).to.equal(__('取消'))
                });

                it('当处于中间步骤时，渲染“上一步”和“下一步”和“取消”按钮', () => {
                    wrapper.setState({ activeIndex: 1 })
                    wrapper.update()
                    const PanelButtons = wrapper.find('PanelButton')
                    expect(PanelButtons).to.have.lengthOf(3)
                    expect(PanelButtons.at(0).childAt(0).text()).to.equal(__('上一步'))
                    expect(PanelButtons.at(1).childAt(0).text()).to.equal(__('下一步'))
                    expect(PanelButtons.at(2).childAt(0).text()).to.equal(__('取消'))
                });

                it('处于最后步骤时，渲染“上一步”和“完成”和“取消”按钮', () => {
                    wrapper.setState({ activeIndex: 2 })
                    wrapper.update()
                    const PanelButtons = wrapper.find('PanelButton')
                    expect(PanelButtons).to.have.lengthOf(3)
                    expect(PanelButtons.at(0).childAt(0).text()).to.equal(__('上一步'))
                    expect(PanelButtons.at(1).childAt(0).text()).to.equal(__('完成'))
                    expect(PanelButtons.at(2).childAt(0).text()).to.equal(__('取消'))
                });
            });
        })

        describe('#event', () => {
            describe('点击上一步', () => {
                it('正确触发事件并改变state.activeIndex', (done) => {
                    const onBeforeLeaveSpy = sinon.stub()
                    onBeforeLeaveSpy.resolves(false)
                    const onLeaveSpy = sinon.spy()
                    const onEnterSPy = sinon.spy()
                    const wrapper = shallow(
                        <Wizard
                            title="test"
                            onCancel={() => { }}
                        >
                            <Wizard.Step
                                title="stepTitle0"
                                onEnter={onEnterSPy}
                            >
                                stepContent0
                            </Wizard.Step>
                            <Wizard.Step
                                title="stepTitle1"
                                onBeforeLeave={onBeforeLeaveSpy}
                                onLeave={onLeaveSpy}
                            >
                                stepContent1
                            </Wizard.Step>
                            <Wizard.Step title="stepTitle2">
                                stepContent2
                            </Wizard.Step>
                        </Wizard>
                    )
                    /* 设置当前在第二页 */
                    wrapper.setState({ activeIndex: 1 })
                    wrapper.update()
                    wrapper.find('PanelButton').at(0).simulate('click')
                    setTimeout(() => {
                        expect(onBeforeLeaveSpy.called).to.be.false
                        expect(onLeaveSpy.called).to.be.true
                        expect(onEnterSPy.called).to.be.true
                        expect(wrapper.state('activeIndex')).to.equal(0)
                        done()
                    }, 0);

                });
            });

            describe('点击下一步', () => {
                it('如果beforeLeaveEvent返回false则不能进入下一步', (done) => {
                    const onBeforeLeaveSpy = sinon.stub()
                    onBeforeLeaveSpy.resolves(false)
                    const onLeaveSpy = sinon.spy()
                    const onEnterSPy = sinon.spy()
                    const wrapper = shallow(
                        <Wizard
                            title="test"
                            onCancel={() => { }}
                        >
                            <Wizard.Step
                                title="stepTitle0"
                                onBeforeLeave={onBeforeLeaveSpy}
                                onLeave={onLeaveSpy}
                            >
                                stepContent0
                            </Wizard.Step>
                            <Wizard.Step
                                title="stepTitle1"
                                onEnter={onEnterSPy}
                            >
                                stepContent1
                            </Wizard.Step>
                            <Wizard.Step title="stepTitle2">
                                stepContent2
                            </Wizard.Step>
                        </Wizard>
                    )
                    wrapper.find('PanelButton').at(0).simulate('click')
                    setTimeout(() => {
                        expect(onBeforeLeaveSpy.called).to.be.true
                        expect(onLeaveSpy.called).to.be.false
                        expect(onEnterSPy.called).to.be.false
                        expect(wrapper.state('activeIndex')).to.equal(0)
                        done()
                    }, 0);

                });

                it('如果beforeLeaveEvent未阻止，则进入下一步', (done) => {
                    const onBeforeLeaveSpy = sinon.stub()
                    onBeforeLeaveSpy.resolves(true)
                    const onLeaveSpy = sinon.spy()
                    const onEnterSPy = sinon.spy()
                    const wrapper = shallow(
                        <Wizard
                            title="test"
                            onCancel={() => { }}
                        >
                            <Wizard.Step
                                title="stepTitle0"
                                onBeforeLeave={onBeforeLeaveSpy}
                                onLeave={onLeaveSpy}
                            >
                                stepContent0
                            </Wizard.Step>
                            <Wizard.Step
                                title="stepTitle1"
                                onEnter={onEnterSPy}
                            >
                                stepContent1
                            </Wizard.Step>
                            <Wizard.Step title="stepTitle2">
                                stepContent2
                            </Wizard.Step>
                        </Wizard>
                    )

                    wrapper.find('PanelButton').at(0).simulate('click')
                    setTimeout(() => {
                        expect(onBeforeLeaveSpy.called).to.be.true
                        expect(onLeaveSpy.called).to.be.true
                        expect(onEnterSPy.called).to.be.true
                        expect(wrapper.state('activeIndex')).to.equal(1)
                        done()
                    }, 0);

                });
            });

            it('点击完成时，触发props.onFinish()', () => {
                const onFinishSpy = sinon.spy()
                const wrapper = shallow(
                    <Wizard
                        title="test"
                        onFinish={onFinishSpy}
                    >
                        <Wizard.Step
                            title="stepTitle0"
                        >
                            stepContent0
                            </Wizard.Step>
                    </Wizard>
                )
                wrapper.find('PanelButton').at(0).simulate('click')
                expect(onFinishSpy.called).to.be.true
            });

            it('点击取消时触发this.props.onCancel()', () => {
                const onCancelSpy = sinon.spy()
                const wrapper = shallow(
                    <Wizard
                        title="test"
                        onCancel={onCancelSpy}
                    >
                        <Wizard.Step
                            title="stepTitle0"
                        >
                            stepContent0
                            </Wizard.Step>
                    </Wizard>
                )
                wrapper.find('PanelButton').at(1).simulate('click')
                expect(onCancelSpy.called).to.be.true
            });

        });
    });
});