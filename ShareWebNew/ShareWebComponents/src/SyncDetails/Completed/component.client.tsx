/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { convertDocByInfo, getDocNameByPath } from '../../../core/client/client';
import Button from '../../../ui/Button/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import InlineButton from '../../../ui/InlineButton/ui.desktop';
import Icon from '../../../ui/Icon/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import Thumbnail from '../../Thumbnail/component.desktop'
import { formatSize, formatTime } from '../../../util/formatters/formatters';
import * as styles from '../styles.client.css';
import * as open from './assets/icon_open.png';
import * as cancel from './assets/icon_cancel.png';
import __ from '../locale';

/**
 * 显示错误弹窗
 * @param onConfrim  // 确定事件
 * @param Message // 提示信息 
 */
export default function Completed({ completedSyncs = [],
    completedNum = 0,
    clear = noop,
    openFileByRelPath = noop,
    openFileByAbsPath = noop,
    openDirByRelPath = noop,
    openDirByAbsPath = noop,
    deleteByLogId = noop,
    showTaskIcon = noop }: Components.Sync.Completed.Props) {
    return (
        <div className={styles['head']}>
            <div className={styles['left']}>
                {
                    __('共有 ${total} 个任务同步完成', { total: completedNum === 0 ? '0' : completedNum })
                }
            </div>
            <div className={styles['right']} >
                <Button disabled={completedNum === 0}
                    className={styles['button']}
                    onClick={clear.bind(this)}
                >
                    {__('清空记录')}
                </Button>
            </div>

            <div className={styles['content']}>
                {
                    completedSyncs.map(info => {
                        const { code, color } = showTaskIcon(info.taskType)
                        return (
                            <div className={styles['item']}>
                                <div className={styles['icon']}>
                                    <UIIcon
                                        code={code}
                                        size={24}
                                        color={color}
                                    />
                                </div>
                                <div className={styles['thumbnail-container']}>
                                    {
                                        // relPath为盘内路径,absPath为盘外路径，两者为互斥关系，一个有值，一个为''
                                    }
                                    <Thumbnail
                                        doc={convertDocByInfo(info)}
                                        size={32}
                                    />
                                </div>
                                <div className={styles['name']}>
                                    <Text className={styles['text']}>{info.relPath ? getDocNameByPath(info.relPath) : getDocNameByPath(info.absPath)}</Text>
                                </div>
                                <div className={styles['size']}>
                                    {
                                        info.size !== -1 ?
                                            <Text>{formatSize(info.size)}</Text>
                                            :
                                            null
                                    }
                                </div>
                                <div className={styles['time']}>
                                    <Text>{formatTime(info.time / 1000, 'yyyy/MM/dd HH:mm')}</Text>
                                </div>
                                <div className={styles['remark']}>
                                    <Text>{info.remark}</Text>
                                </div>
                                <div className={styles['right']}>
                                    <InlineButton
                                        code={'\uf081'}
                                        title={__('打开')}
                                        onClick={() => info.relPath ? openFileByRelPath(info.relPath, info.taskType) : openFileByAbsPath(info.absPath)}
                                    />
                                    <InlineButton
                                        code={'\uf074'}
                                        title={__('打开所在位置')}
                                        onClick={() => info.relPath ? openDirByRelPath(info.relPath) : openDirByAbsPath(info.absPath)}
                                    />
                                    <InlineButton
                                        code={'\uf046'}
                                        title={__('清除')}
                                        onClick={() => deleteByLogId(info.logId)}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}
