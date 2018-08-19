import * as React from 'react';
import { isFunction } from 'lodash';
import { post } from '../../../util/http/http';
import { timer } from '../../../util/timer/timer';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import { SyncMode } from '../../../core/client/client';
import LinkChip from '../../../ui/LinkChip/ui.desktop';
import { PureComponent } from '../../../ui/decorators';
import __ from './locale';
import * as loading from './assets/images/loading.gif'
import * as styles from './styles.desktop.css';


/**
 * 正在同步
 * @param param0 
 */
const SyncingItem = ({ children }) => (
    <div className={styles['item']}>
        <Icon url={loading} />
        <div className={styles['text']}>
            <Text>
                {
                    children
                }
            </Text>
        </div>
    </div>
)

/**
 * 未同步
 * @param param0 
 */
const UnsyncingItem = ({ code, color, children }) => (
    <div className={styles['item']}>
        <UIIcon
            className={styles['icon']}
            code={code}
            size="18"
            color={color}
        />
        <div className={styles['text']}>
            <Text>
                {
                    children
                }
            </Text>
        </div>
    </div>
)

@PureComponent
export default class Synchronization extends React.Component<Components.Synchronization.Props, any> {
    static defaultProps = {
        sync: {
            mode: SyncMode.Synced,
            status: 0
        }
    }

    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['summary']}>
                    {
                        this.props.status === 2 ?
                            this.props.sync.mode === SyncMode.Syncing ? (
                                <SyncingItem>
                                    {__('正在同步 ${num} 个文档', { num: this.props.sync.num })}
                                </SyncingItem>
                            ) :
                                this.props.sync.mode === SyncMode.Synced ? (
                                    <UnsyncingItem code={'\uf063'} color={'#009e11'}>
                                        {__('所有文件都已同步完成')}
                                    </UnsyncingItem>
                                ) : (
                                        <UnsyncingItem code={'\uf065'} color={'#757575'}>
                                            {__('您有 ${num} 个文档还未同步', { num: this.props.sync.num })}
                                        </UnsyncingItem>
                                    )
                            :
                            <UnsyncingItem code={'\uf030'} color={'#757575'}>
                                {__('客户端已离线')}
                            </UnsyncingItem>

                    }
                    <LinkChip
                        className={styles['link']}
                        onClick={this.showSyncDetail.bind(this)}
                    >
                        {__('详情')}
                    </LinkChip>
                </div>
            </div>
        )
    }

    /**
     * 显示同步详情
     */
    showSyncDetail() {
        post(`http://127.0.0.1:10080/syncdetails`, { defaultActiveView: this.props.sync.mode, skipDirectTransferTip: this.props.skipDirectTransferTip }, { sendAs: 'json', readAs: 'json' })
    }
}