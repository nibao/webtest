import * as React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import TreeNode from '../ui.desktop';
import * as styles from '../styles.desktop.css';
import * as collapsed from '../assets/collapsed.desktop.png';
import * as expanded from '../assets/expanded.desktop.png';
import * as sinon from 'sinon';


describe('ShareWebUI', () => {
    describe('TreeNode@desktop', () => {
        describe('#render', () => {
            it('默认渲染', () => {
                shallow(<TreeNode data={{ name: 'test' }}></TreeNode>)
            })

            it('结果中包含展开按钮UIIcon组件和LinkChip组件', () => {
                const wrapper = shallow(<TreeNode data={{ name: 'test' }}></TreeNode>);
                expect(wrapper.find('UIIcon')).to.have.lengthOf(1)
                expect(wrapper.find('LinkChip')).to.have.lengthOf(1)
            });

            it('选中时正确添加选中的class', () => {
                const wrapper = shallow(
                    <TreeNode
                        data={{ name: 'test' }}
                        selected={true}
                    >
                    </TreeNode>
                );

                expect(wrapper.find(`.${styles['detail']}`).hasClass(styles['selected'])).to.be.true

            });

            describe('正确渲染展开收起按钮组件', () => {
                it('是叶子节点时（props.isLeaf为true），通过style隐藏按钮', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                            isLeaf={true}
                        >
                        </TreeNode>
                    );
                    expect(wrapper.find('UIIcon').hasClass(styles['leaf'])).to.be.true
                });

                it('默认为收起按钮（默认不展开子节点）', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                        >
                        </TreeNode>
                    );
                    expect(wrapper.find('UIIcon').prop('code')).to.equal('\uf00c')
                    expect(wrapper.find('UIIcon').prop('fallback')).to.equal(collapsed)
                });

            });

            describe('正确渲染文字选项', () => {
                it('当前选项禁用时，正确添加禁用的className', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                            getStatus={data => { return { disabled: true } }}
                        >
                        </TreeNode>
                    );
                    expect(wrapper.find('LinkChip').hasClass(styles['disabled'])).to.be.true
                });

                it('不传formatter时，默认返回data.name', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                        >
                        </TreeNode>
                    );
                    expect(wrapper.find('LinkChip').childAt(0).text()).to.equal('test')
                });

                it('传formatter时，使用formatter格式化数据', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                            formatter={data => data.name + 'Name'}
                        >
                        </TreeNode >
                    );
                    expect(wrapper.find('LinkChip').childAt(0).text()).to.equal('testName')
                });

            });

            describe('正确渲染勾选框', () => {
                it('当传入props.checkbox为true时，selected为true时，正确渲染勾选框', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                            checkbox={true}
                            selected={true}
                        >
                        </TreeNode>
                    );

                    expect(wrapper.find('CheckBox').exists()).to.be.true
                    expect(wrapper.find('CheckBox').prop('checked')).to.equal(true)

                });

                it('当传入props.checkbox为true时，selected为true时，正确渲染勾选框', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test' }}
                            checkbox={true}
                            selected={false}
                        >
                        </TreeNode>
                    );

                    expect(wrapper.find('CheckBox').exists()).to.be.true
                    expect(wrapper.find('CheckBox').prop('checked')).to.equal(false)

                });
            });

            describe('传入子节点', () => {
                it('正确渲染子节点', () => {
                    const wrapper = shallow(
                        <TreeNode data={{ name: 'test0' }}>
                            <TreeNode data={{ name: 'test1' }}>
                            </TreeNode>
                            <TreeNode data={{ name: 'test2' }}>
                            </TreeNode>
                        </TreeNode>
                    );
                    expect(wrapper.find(`.${styles['branch']} TreeNode`)).to.have.lengthOf(2)
                });

                it('当展开时，正确显示子节点', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test0' }}
                            expanded={true}
                        >
                            <TreeNode data={{ name: 'test1' }}>
                            </TreeNode>
                        </TreeNode>
                    );
                    expect(wrapper.find(`.${styles['branch']}`).hasClass(styles['expanded'])).to.be.true
                });

                it('当收起时，正确隐藏子节点(默认为非展开状态)', () => {
                    const wrapper = shallow(
                        <TreeNode
                            data={{ name: 'test0' }}
                            expanded={false}
                        >
                            <TreeNode data={{ name: 'test1' }}>
                            </TreeNode>
                        </TreeNode>
                    );
                    expect(wrapper.find(`.${styles['branch']}`).hasClass(styles['collapsed'])).to.be.true
                });
            });
        })

        describe('#event', () => {
            it('当前状态为收起，点击展开图标时，正确更新State，正确触发props.onExpand', (done) => {
                const onExpandSpy = sinon.spy()
                const onCollapseSpy = sinon.spy()
                const wrapper = shallow(
                    <TreeNode
                        data={{ name: 'test0' }}
                        onExpand={onExpandSpy}
                        onCollapse={onCollapseSpy}
                        loader={node => Promise.resolve()}
                    >
                    </TreeNode>
                );
                /* 点击前state */
                expect(wrapper.state('loadStatus')).to.equal(0)
                expect(wrapper.state('collapsed')).to.be.true

                /* 模拟点击 */
                wrapper.find('UIIcon').simulate('click')
                expect(wrapper.state('loadStatus')).to.equal(1) // 点击立即改变加载状态为正在加载
                /* 在promise.then 中设置setState,因此需要在下一个时钟进行断言 */
                setTimeout(() => {
                    expect(wrapper.state('loadStatus')).to.equal(2)
                    done()
                }, 0)

                expect(onExpandSpy.calledWith({ name: 'test0' })).to.be.true
                expect(onCollapseSpy.called).to.be.false
                expect(wrapper.state('collapsed')).to.false
            });

            it('当前状态为展开，点击收起图标时，正确更新State，正确触发props.onCollapse', () => {
                const onExpandSpy = sinon.spy()
                const onCollapseSpy = sinon.spy()
                const wrapper = shallow(
                    <TreeNode
                        data={{ name: 'test0' }}
                        expanded={true}
                        onExpand={onExpandSpy}
                        onCollapse={onCollapseSpy}
                        loader={node => Promise.resolve()}
                    >
                    </TreeNode>
                );
                wrapper.setState({ loadStatus: 2 })

                /* 点击前state */
                expect(wrapper.state('loadStatus')).to.equal(2)
                expect(wrapper.state('collapsed')).to.be.false

                /* 模拟点击 */
                wrapper.find('UIIcon').simulate('click')
                expect(wrapper.state('loadStatus')).to.equal(2)

                expect(onCollapseSpy.calledWith({ name: 'test0' })).to.be.true
                expect(onExpandSpy.called).to.be.false
                expect(wrapper.state('collapsed')).to.true
            });

            it('当前节点可选时,点击节点文字，触发props._onSelect', () => {
                const _onSelectSpy = sinon.spy()
                const wrapper = shallow(
                    <TreeNode
                        data={{ name: 'test' }}
                        getStatus={data => { return { disabled: false } }}
                        _onSelect={_onSelectSpy}
                    >
                    </TreeNode>
                );
                wrapper.find('LinkChip').simulate('click')
                /* 参数为组件实例 */
                expect(_onSelectSpy.calledWith(wrapper.instance())).to.be.true
            });

            it('当前节点不可选时,点击节点文字，不触发props._onSelect', () => {
                const _onSelectSpy = sinon.spy()
                const wrapper = shallow(
                    <TreeNode
                        data={{ name: 'test' }}
                        getStatus={data => { return { disabled: true } }}
                        _onSelect={_onSelectSpy}
                    >
                    </TreeNode>
                );
                wrapper.find('LinkChip').simulate('click')
                /* 参数为组件实例 */
                expect(_onSelectSpy.called).to.be.false
            });
        });
    });
});