/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop, every, sum, filter } from 'lodash';
import { convertDocByInfo, getDocNameByPath } from '../../../core/client/client';
import Button from '../../../ui/Button/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import InlineButton from '../../../ui/InlineButton/ui.desktop';
import ProgressBar from '../../../ui/ProgressBar/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import { formatSize, formatRate } from '../../../util/formatters/formatters';
import Thumbnail from '../../Thumbnail/component.desktop'
import { ncTaskStatus } from '../helper';
import * as styles from '../styles.client.css';
import __ from '../locale';

/**
 * 显示错误弹窗
 * @param onConfrim  // 确定事件
 * @param Message // 提示信息 
 */
export default function Syncing({ detail = [],
    total = 0,
    resumeAllTask = noop,
    pauseAllTask = noop,
    cancelAllTask = noop,
    pause = noop,
    resume = noop,
    cancel = noop,
    showTaskIcon = noop,
    showTextByStatus = noop }: Components.Sync.Syncing.Props) {

    return (
        <div className={styles['head']}>
            <div className={styles['left']}>
                {
                    __('共有 ${total} 个任务正在同步', { total: total === 0 ? '0' : total })
                }
            </div>
            <div className={styles['right']} >
                <span className={styles['total-rate']}>
                    {
                        total === 0 || every(detail, info => info.taskStatus === ncTaskStatus.NC_TS_PAUSED) ? null : formatRate(detail.reduce((prevs, cur) => (
                            cur.taskStatus === ncTaskStatus.NC_TS_EXECUTING ? cur.rate + prevs : prevs
                        ), 0))
                    }
                </span>
                {
                    total === 0 ?
                        <Button disabled={total === 0}
                            className={styles['button']}
                            onClick={pauseAllTask}
                        >
                            {__('全部暂停')}
                        </Button>
                        : every(detail, info => info.taskStatus === ncTaskStatus.NC_TS_PAUSED)
                            ?
                            <Button disabled={total === 0}
                                className={styles['button']}
                                onClick={resumeAllTask}
                            >
                                {__('全部开始')}
                            </Button>
                            :
                            <Button disabled={total === 0}
                                className={styles['button']}
                                onClick={pauseAllTask}
                            >
                                {__('全部暂停')}
                            </Button>
                }

                <Button disabled={total === 0}
                    className={styles['button']}
                    onClick={cancelAllTask}
                >
                    {__('全部取消')}
                </Button>
            </div>

            <div className={styles['content']}>
                {
                    detail.map(info => {
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
                                    <Thumbnail
                                        doc={convertDocByInfo(info)}
                                        size={32}
                                    />
                                </div>
                                <div className={styles['name']}>
                                    <Text className={styles['text']}>{getDocNameByPath(info.relPath)}</Text>
                                </div>
                                <div className={styles['size']}>
                                    {
                                        info.size !== -1 ?
                                            <Text>{formatSize(info.size)}</Text>
                                            :
                                            null
                                    }
                                </div>
                                <div className={styles['ratios']}>
                                    <ProgressBar value={info.ratios}>
                                    </ProgressBar>
                                </div>
                                <div className={styles['status']}>
                                    {showTextByStatus(info.taskType, info.taskStatus, info.rate)}
                                </div>
                                <div className={styles['right']}>
                                    {
                                        info.taskStatus === ncTaskStatus.NC_TS_EXECUTING || info.taskStatus === ncTaskStatus.NC_TS_WAITING
                                            ?
                                            <InlineButton
                                                code={'\uf050'}
                                                title={__('暂停')}
                                                onClick={() => pause(info.taskId)}
                                            />
                                            :
                                            <InlineButton
                                                code={'\uf04f'}
                                                title={__('开始')}
                                                onClick={() => resume(info.taskId)}
                                            />
                                    }
                                    <InlineButton
                                        code={'\uf046'}
                                        title={__('取消')}
                                        onClick={() => cancel(info.taskType, info.taskId)}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )


}