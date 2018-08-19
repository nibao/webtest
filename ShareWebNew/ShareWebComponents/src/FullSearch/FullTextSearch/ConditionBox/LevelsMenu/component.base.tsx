import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { assign, isEqual } from 'lodash';
import * as _ from 'lodash';
import WebComponent from '../../../../webcomponent';


export default class LevelMenuBase extends WebComponent<Components.FullSearch.FullTextSearch.LevelsMenu.Props, Components.FullSearch.FullTextSearch.LevelsMenu.State> {

    static defaultProps = {

    }

    static refList = null;

    state = {
        enablelevelMenu: false,
        candidateItems: this.props.candidateItems,
        clickStatus: false,
        titleNode: this.props.candidateItems.child[0]
    }


    componentDidMount() {
        let { candidateItems } = this.state;
        candidateItems['anchor'] = this.refs['levelMenuBtn'];
        candidateItems['parent'] = null;

        this.setState({
            candidateItems
        }, () => {
            // this.selectNode.expand = true;
            // let parentNode = this.selectNode['parent'];
            // while (parentNode) {
            //     parentNode.expand = true
            //     parentNode = parentNode['parent']
            // }
            // this.forceUpdate();
            this.nextNode = {};
            this.pastNode = {};
        })


    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps.titleNode, this.props.titleNode)) {
            let { candidateItems } = this.state;
            candidateItems['anchor'] = this.refs['levelMenuBtn'];
            candidateItems['parent'] = null;
            this.setState({
                titleNode: nextProps.titleNode,
                candidateItems
            }, () => {
                this.nextNode = {};
                this.pastNode = {};
            })
        }
    }

    // 延迟触发收缩的定时器
    expandTimeout: number | null = null;

    leaveTimeout: number | null = null;

    closeTimeout: number | null = null;

    // 鼠标即将移入的下一个节点
    nextNode = {};

    // 当前节点
    pastNode = {};

    // 选中的节点
    selectNode = {};

    // 节点顺序
    indexList = [];

    // 控制面板关闭优先级的锁
    lock = true

    /**
     * 点击范围菜单按钮
     */
    protected handleClickLevelMenuBtn(e) {

        this.setState({
            enablelevelMenu: !this.state.enablelevelMenu,
            clickStatus: !this.state.clickStatus
        }, () => {
            if (this.state.enablelevelMenu) {
                this.pastNode.expand = false;
                this.selectNode.expand = true;
                this.forceUpdate();
                let parentNode = this.selectNode['parent'];
                while (parentNode) {
                    parentNode.expand = true
                    this.forceUpdate();
                    parentNode = parentNode['parent']
                }

                setTimeout(() => {
                    this.selectNode.expand = true;
                    let parentNode = this.selectNode['parent'];
                    while (parentNode) {
                        parentNode.expand = true
                        this.forceUpdate();
                        parentNode = parentNode['parent']
                    }
                }, 10)

            } else {
                this.pastNode.expand = false;
                this.forceUpdate();
            }


        })
    }

    /**
     * 鼠标移出范围菜单按钮
     */
    protected handleLeaveMenuBtn() {
        // if (this.state.clickStatus) {
        //     if (this.leaveTimeout) {
        //         clearTimeout(this.leaveTimeout);
        //     }

        //     this.leaveTimeout = setTimeout(() => {
        //         if (_.keys(this.nextNode).length === 0) {
        //             this.setState({
        //                 clickStatus: false,
        //                 enablelevelMenu: false
        //             })
        //             this.forceUpdate();
        //         }

        //     }, 300);

        // }
    }

    /**
     * 鼠标移入新节点
     */
    protected handleExpandTreeNode(e, node) {

        this.nextNode = node;
        // 将node同级其他node的expand置为false
        node.parent.child.map(item => {
            item.expand = false
        })

        // node子节点的expand置为false
        node.child.map(item => {
            item.expand = false
        })
        assign(node, {
            expand: true
        })
        this.forceUpdate();
    }

    protected handleExpandTreePanel(e, node) {
        node.expand = true;
        this.forceUpdate();
    }

    /**
     * 鼠标移出新节点
     */
    protected handleCollapseTreeNode(e, node) {

        // 由于事件触发顺序是： 鼠标移出当前区域，鼠标移入另一个区域，因此在鼠标移出时，等待100ms，先执行鼠标移入操作，再执行鼠标移出操作。
        if (this.expandTimeout) {
            clearTimeout(this.expandTimeout);
        }

        let currentNode = this.nextNode;
        this.expandTimeout = setTimeout(() => {
            if (_.keys(this.nextNode).length === 0 || this.nextNode === currentNode) { // 等待100 ms后没有下一节点,或者移出的节点没有变化，则代表移出了菜单范围
                // 如果移出了所有菜单的范围，遍历当前节点的父元素，然后追溯到根节点，全部expand置为false

                // let parentNode = node['parent'];
                // while (parentNode && parentNode.expand) {
                //     parentNode.expand = false
                //     parentNode = parentNode['parent']
                // }
                // this.setState({
                //     enablelevelMenu: false,
                //     clickStatus: false
                // })
                // this.forceUpdate();
            } else {
                // 如果下一节点存在，且当前节点与下一节点存在父->子关系，当前节点的expand保持为true
                if (this.nextNode['parent'] === this.pastNode) {
                    this.pastNode.expand = true;
                    this.forceUpdate();
                } else if (this.pastNode['parent'] === this.nextNode) {
                    this.nextNode.expand = true;
                    this.forceUpdate();
                } else {
                    // 如果下一节点存在，且下一节点的兄弟节点的子孙内包含当前节点，当前节点的父节点的expand为false， 父节点任意子节点的父节点expand为false，直到根节点
                    // 通过当前节点追溯父节点
                    let parentNode = this.pastNode['parent'];

                    // 如果当前节点与下一节点为兄弟节点，当前节点的expand为false
                    if (parentNode === this.nextNode['parent']) {
                        this.pastNode.expand = false;
                        this.forceUpdate();
                    } else {
                        // 否则追溯父节点，找到血缘关系
                        while (parentNode) {
                            // 如果父节点与下一节点为兄弟节点，父节点的expand为false，结束遍历
                            if (parentNode['parent'] && this.nextNode['parent'] && parentNode['parent'].id === this.nextNode['parent'].id) {
                                parentNode.expand = false;
                                this.forceUpdate();
                                break;
                            } else {
                                // 如果不是兄弟节点，父节点的expand为false,继续遍历
                                parentNode.expand = false;
                                parentNode = parentNode['parent'];
                                this.forceUpdate();
                            }
                        }
                    }
                }
            }

            // 置空下一节点
            this.pastNode = this.nextNode;
            this.nextNode = {};
        }, 500);

    }



    /**
     * 点击某个节点
     */
    protected handleClickTreeNode(node) {
        this.setState({
            enablelevelMenu: false,
            clickStatus: false
        }, () => {
            node.expand = false;
            let parentNode = node['parent'];
            while (parentNode) {
                parentNode.expand = false
                parentNode = parentNode['parent']
            }
            this.forceUpdate();
            this.selectNode = node;
            this.props.onChange(node);
            this.lock = false;
        })


    }

    /**
     * 点击外部
     */
    protected handleCloseLevelMenu(close) {


        // 如果当面面板是打开状态
        if (this.closeTimeout) {
            clearTimeout(this.closeTimeout);
        }

        this.closeTimeout = setTimeout(() => {
            if (this.state.enablelevelMenu) {
                this.setState({
                    enablelevelMenu: false,
                    clickStatus: false
                }, () => {
                    this.pastNode.expand = false;
                    this.forceUpdate();
                })

            }

        }, 200)
    }
}