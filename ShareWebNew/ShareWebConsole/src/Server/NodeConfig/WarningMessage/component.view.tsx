import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import Panel from '../../../../ui/Panel/ui.desktop';
import CheckBoxOption from '../../../../ui/CheckBoxOption/ui.desktop';
import __ from './locale';
import * as styles from './styles.view';

/**
 * 显示确认弹窗
 */
const WarnginMessage: React.StatelessComponent<Components.Server.NodeConfig.WarnginMessage.Props> = function WarnginMessage({
    operation,
    onMessageCancel = noop,
    onMessageConfirm = noop,
    onUnInstallIndexChange = noop
}) {
    return (
        <Dialog
            title={__('提示')}
            onClose={onMessageCancel}
        >
            <Panel>
                <Panel.Main>
                    {
                        operation.setHaMaster ?
                            <div className={styles['item']}>
                                {__('设置当前节点为高可用主节点后需要重新登录控制台。')}
                            </div>
                            : null
                    }
                    {
                        operation.setHaMasterBasic ?
                            <div className={styles['item']}>
                                {__('设置当前节点为高可用主节点（全局）后需要重新登录控制台。')}
                            </div>
                            : null
                    }
                    {
                        operation.setHaMasterApp ?
                            <div className={styles['item']}>
                                {__('设置当前节点为高可用主节点（应用）后需要重新登录控制台。')}
                            </div>
                            : null
                    }
                    {
                        operation.cancelHaMaster ?
                            <div className={styles['item']}>
                                {__('取消高可用主节点将导致系统高可用及负载均衡特性失效。')}
                            </div>
                            : null
                    }
                    {
                        operation.cancelHaSlave ?
                            <div className={styles['item']}>
                                {__('取消高可用从节点将导致系统主从切换的高可用特性失效。')}
                            </div>
                            : null
                    }
                    {
                        operation.cancelDbSlave ?
                            <div className={styles['item']}>
                                {__('取消数据库从节点将导致数据库的主备特性失效。')}
                            </div>
                            : null
                    }
                    {
                        operation.cancelIndex ?
                            <div className={styles['item']}>
                                {__('取消文档索引节点将导致搜索和快速定位服务无法使用。')}
                            </div>
                            : null
                    }
                    {
                        operation.cancelIndex ?
                            <div className={styles['uninstall-index']}>
                                <CheckBoxOption
                                    onChange={onUnInstallIndexChange}
                                    checked={false}
                                >
                                    {__('卸载过程中删除索引目录')}
                                </CheckBoxOption>
                            </div>
                            : null
                    }
                    <div className={styles['confirm-message']}>{__('您确定要执行此操作吗？')}</div>
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button onClick={onMessageConfirm}>{__('确定')}</Panel.Button>
                    <Panel.Button onClick={onMessageCancel}>{__('取消')}</Panel.Button>
                </Panel.Footer>
            </Panel>
        </Dialog>
    )
}

export default WarnginMessage
