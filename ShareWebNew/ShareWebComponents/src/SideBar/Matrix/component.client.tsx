import * as React from 'react'
import * as classnames from 'classnames'
import { noop, isFunction } from 'lodash'
import { Pane, PopMenu, UIIcon } from '../../../ui/ui.desktop'
import { isDir } from '../../../core/docs/docs'
import { getConfig } from '../../../core/config/config'
import { getUnreadMessageCount, getExplorerSelection } from '../../../core/client/client'
import { PureComponent } from '../../../ui/decorators'
import { Module } from '../helper'
import __ from './locale'
import * as styles from './styles.desktop.css'

@PureComponent
export default class Matrix extends React.Component<Components.Matrix.Props, any> {

    static defaultProps = {
        docs: [],

        onTriggerComponent: noop
    }

    state = {
        enabledPanes: [],
        unReadMsgNum: 0,
        auditMsgCount: 0,
        msgStatus: true,
        /**
         * 首条未读消息是否为共享审核消息
         */
        isPending: true

    }

    stopGetUnreadMessageCount: () => void | null;

    async componentDidMount() {
        // 如果消息关闭，则隐藏消息中心以及消息数。后端未整合接口前，返回undefined
        const msgStatus = await getConfig('enable_message_notify');
        this.setState({
            msgStatus: msgStatus === undefined ? true : msgStatus
        })

        this.stopGetUnreadMessageCount = getUnreadMessageCount(([{ unReadMsgNum, }, { unReadAuditNum, isPending }]) => {
            this.setState({
                unReadMsgNum,
                auditMsgCount: unReadAuditNum,
                isPending
            })
        })
    }

    componentWillReceiveProps({ docs, directory }) {
        this.setState({ enabledPanes: this.getEnabledPanes(docs, directory) })
    }

    componentWillUnmount() {
        if (isFunction(this.stopGetUnreadMessageCount)) {
            this.stopGetUnreadMessageCount();
            this.stopGetUnreadMessageCount = null
        }
    }

    getEnabledPanes(docs = [], directory) {
        // 未选中文件
        if (docs.length === 0) {
            // 在顶层视图或虚拟目录下
            if (!directory || !directory.docid) {
                return [];
            } else {
                return [
                    Module.InnerLink,
                    Module.ShareLink,
                    Module.Cache,
                    Module.CleanCache,
                ]
            }
        }
        // 选中单个文件
        else if (docs.length === 1) {
            // 选中顶层视图或虚拟目录
            if (!docs[0].docid) {
                return [];
            }
            // 选中目录
            else if (isDir(docs[0])) {
                return [
                    Module.InnerLink,
                    Module.ShareLink,
                    Module.Cache,
                    Module.CleanCache,
                ]
            }
            // 选中文件
            else {
                return [
                    Module.InnerLink,
                    Module.ShareLink,
                    Module.Cache,
                    Module.CleanCache,
                ]
            }
        }
        // 多选
        else {
            // 选中的文件中有入口文档
            if (docs.some(info => (!info.docid))) {
                return []
            } else {
                return [
                    Module.Cache,
                    Module.CleanCache,
                ]
            }
        }
    }

    render() {
        let { enabledPanes } = this.state;

        return (
            <div className={styles['container']}>
                <div className={classnames(styles['matrix-pad'], styles['glob-ops'])} style={{ height: 60 }}>
                    <table className={classnames(styles['matrix'])}>
                        <tbody>
                            <tr>
                                <td className={styles['matrix-cell']}>
                                    {
                                        this.state.msgStatus ?
                                            <Pane
                                                type="global"
                                                icon="\uf023"
                                                color="#757575"
                                                label={__('消息中心')}
                                                msgNum={this.state.unReadMsgNum}
                                                onClick={this.props.onTriggerComponent.bind(null, Module.Message)}
                                            />
                                            :
                                            <Pane
                                                type="global"
                                                icon="\uf023"
                                                color="#757575"
                                                label={__('消息中心')}
                                                onClick={this.props.onTriggerComponent.bind(null, Module.Message)}
                                                disabled={true}
                                            />
                                    }
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf094"
                                        color="#757575"
                                        label={__('我的收藏')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.MyFavorites)}
                                    />
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf000"
                                        color="#757575"
                                        label={__('回收站')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.Recycle)}
                                    />
                                </td>

                                {/* <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf02d"
                                        color="#757575"
                                        label={__('群组管理')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.GroupManage)}
                                    />
                                </td> */}
                                {/* <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf02c"
                                        color="#757575"
                                        label={__('审核管理')}
                                        msgNum={this.state.auditMsgCount}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.AuditManage)}
                                    />
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf02d"
                                        color="#757575"
                                        label={__('群组管理')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.GroupManage)}
                                    />
                                </td> 
                            */}
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="global"
                                        icon="\uf024"
                                        color="#757575"
                                        label={__('其它')}
                                        triggerEvent={'mouseover'}
                                        menuItems={
                                            [
                                                <PopMenu.Item
                                                    icon={
                                                        <div className={styles['approval-icon']}>
                                                            <UIIcon
                                                                className={styles['menu-icon']}
                                                                code={'\uf02c'}
                                                                color={'#757575'}
                                                                size={24}
                                                            />
                                                            {
                                                                this.state.auditMsgCount !== 0 ?
                                                                    <div className={classnames(styles['badge'], { [styles['circles']]: this.state.auditMsgCount < 10, [styles['oval']]: this.state.auditMsgCount > 99 })}>
                                                                        {this.state.auditMsgCount > 99 ? '99+' : this.state.auditMsgCount}
                                                                    </div>
                                                                    : null
                                                            }
                                                        </div>
                                                    }
                                                    label={__('审核管理')}
                                                    size={10}
                                                    onClick={this.props.onTriggerComponent.bind(null, Module.AuditManage, { isPending: this.state.isPending })}
                                                >
                                                </PopMenu.Item>,
                                                <PopMenu.Item
                                                    icon={
                                                        <UIIcon
                                                            className={styles['menu-icon']}
                                                            code={'\uf02d'}
                                                            color={'#757575'}
                                                            size={24}
                                                        />
                                                    }
                                                    size={10}
                                                    label={__('群组管理')}
                                                    onClick={this.props.onTriggerComponent.bind(null, Module.GroupManage, {})}
                                                >
                                                </PopMenu.Item>,
                                                <PopMenu.Item
                                                    icon={
                                                        <UIIcon
                                                            className={styles['menu-icon']}
                                                            code={'\uf05d'}
                                                            color={'#757575'}
                                                            size={24}
                                                        />
                                                    }
                                                    size={10}
                                                    label={__('我的共享')}
                                                    onClick={this.props.onTriggerComponent.bind(null, Module.MyShare, {})}
                                                >
                                                </PopMenu.Item>,
                                            ]
                                        }
                                    >
                                    </Pane>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div >
                <div className={classnames(styles['matrix-pad'], styles['local-ops'])} style={{ height: 150 }}>
                    <table className={classnames(styles['matrix-local'])}>
                        <tbody>
                            <tr>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="local"
                                        icon="\uf025"
                                        color="#5a8cb4"
                                        label={__('内链共享')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.InnerLink, this.props.docs.length ? { doc: this.props.docs[0] } : { doc: this.props.directory })}
                                        disabled={!enabledPanes.includes(Module.InnerLink)}
                                    />
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="local"
                                        icon="\uf026"
                                        color="#5a8cb4"
                                        label={__('外链共享')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.ShareLink, this.props.docs.length ? { doc: this.props.docs[0] } : { doc: this.props.directory })}
                                        disabled={!enabledPanes.includes(Module.ShareLink)}
                                    />
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="local"
                                        icon="\uf02a"
                                        color="#5a8cb4"
                                        label={__('下载')}
                                        onClick={this.props.onTriggerComponent.bind(this, Module.Cache, { directory: this.props.directory, docs: this.props.docs })}
                                        disabled={!enabledPanes.includes(Module.Cache)}
                                    />
                                </td>
                                <td className={styles['matrix-cell']}>
                                    <Pane
                                        type="local"
                                        icon="\uf027"
                                        color="#5a8cb4"
                                        label={__('清除缓存')}
                                        onClick={this.props.onTriggerComponent.bind(null, Module.CleanCache, { docs: getExplorerSelection({ directory: this.props.directory, docs: this.props.docs }) })}
                                        disabled={!enabledPanes.includes(Module.CleanCache)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div >
        )
    }
}
