import * as React from 'react';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import Panel from '../../../../ui/Panel/ui.desktop';
import Icon from '../../../../ui/Icon/ui.desktop';
import * as waiting from '../assets/waiting.gif';
import __ from './locale';
import * as styles from './styles.view';

/**
 * 显示确认弹窗
 */
const ProgressDialog: React.StatelessComponent<Components.Server.NodeConfig.ProgressDialog.Props> = function ProgressDialog({
    node,
    requestInProgress
}) {
    return (
        <Dialog
            title={node ? __('设置') : __('添加节点')}
            width={530}
            buttons={[]}
        >
            <Panel>
                <Panel.Main>
                    <div className={styles['progress-description']}>
                        <Icon url={waiting} size={48} />
                        <span className={styles['progress-text']}>
                            {
                                `${renderDescription(requestInProgress)}`
                            }
                        </span>
                    </div>
                </Panel.Main>
            </Panel >
        </Dialog>
    )
}

const renderDescription = (request) => {
    switch (request) {
        case 'addNode':
            return __('正在添加节点......')
        case 'setHaMaster':
            return __('正在配置高可用主节点......')
        case 'setHaSlave':
            return __('正在配置高可用从节点......')
        case 'addApplicationNode':
            return __('正在配置应用节点......')
        case 'setNodeAlias':
            return __('正在配置节点名称......')
        case 'setDbMaster':
            return __('正在配置数据库主节点......')
        case 'setDbSlave':
            return __('正在配置数据库从节点......')
        case 'addStorageNode':
            return __('正在配置存储节点......')
        case 'addSingleApplicationNode':
            return __('正在安装文档索引......')
        case 'delApplicationNode':
            return __('正在删除应用节点......')
        case 'delSingleApplicationNode':
            return __('正在卸载文档索引......');
        case 'cancelDbNode':
            return __('正在删除数据库节点......');
        case 'cancelHaNode':
            return __('正在删除高可用节点......')
        case 'delStorageNode':
            return __('正在删除存储节点......')
        default:
            return ''
    }
}

export default ProgressDialog
