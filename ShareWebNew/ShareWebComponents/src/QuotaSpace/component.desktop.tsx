import * as React from 'react';
import * as classnames from 'classnames';
import StackBar from '../../ui/StackBar/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import { formatSize } from '../../util/formatters/formatters';
import QuitSpaceBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';

export default class QuitSpace extends QuitSpaceBase {
    render() {
        const { totalUsed, totalQuota, totalStackDatas, quotaStackDatas } = this.state;
        return (
            <div className={styles['container']}>
                <div className={styles['quota-part']}>
                    <span className={styles['quota-space-title']}>{__('账户总体配额空间： 已用')} {formatSize(totalUsed)}/{formatSize(totalQuota)} </span>
                    <StackBar width="100%" className={styles['stack-bar']}>
                        {
                            totalUsed > totalQuota ? (
                                <StackBar.Stack
                                    className={styles['stack']}
                                    background="#e82828"
                                    rate={1}>
                                </StackBar.Stack>
                            ) :
                                totalStackDatas.map(function ({ docname, background, value }) {
                                    return (
                                        <StackBar.Stack
                                            className={styles['stack']}
                                            key={docname}
                                            background={background}
                                            rate={value / totalQuota}>
                                            {
                                                docname ? (
                                                    <span className={styles['stack-bar-info']}>{docname} {formatSize(value)}</span>
                                                ) : null
                                            }
                                        </StackBar.Stack>
                                    )
                                }, this)
                        }
                    </StackBar>
                </div>
                {
                    quotaStackDatas.map(function ({ doctype, docname, used, quota, background }) {
                        return (
                            <div className={styles['quota-part']}>
                                <div className={styles['quota-space-title']}>
                                    <span>
                                        {
                                            doctype === 'userdoc' ?
                                                __('个人配额空间') : __('群组配额空间')
                                        } (
                                    </span>
                                    <span title={docname}>
                                        {
                                            docname.length > 45 ? `${docname.slice(0, 45)}...` : docname
                                        }
                                    </span>
                                    <span> ) {__('已用')} : </span>
                                    <span>{formatSize(used)}/{formatSize(quota)}</span>
                                </div>

                                {
                                    used > quota ? (
                                        <StackBar width="100%" className={styles['stack-bar']}>
                                            <StackBar.Stack
                                                className={styles['stack']}
                                                background="#e82828"
                                                rate={1}>
                                            </StackBar.Stack>
                                        </StackBar>
                                    ) : (
                                            <StackBar width="100%" className={styles['stack-bar']}>
                                                <StackBar.Stack
                                                    className={styles['stack']}
                                                    background={background}
                                                    rate={used / quota}>
                                                    {
                                                        docname ? (
                                                            <span className={styles['stack-bar-info']}>{docname} {formatSize(used)}</span>
                                                        ) : null
                                                    }
                                                </StackBar.Stack>
                                                <StackBar.Stack
                                                    className={styles['stack']}
                                                    background="#fff"
                                                    rate={(quota - used) / quota}>
                                                </StackBar.Stack>
                                            </StackBar>
                                        )
                                }

                            </div>

                        );
                    })
                }
            </div>
        )
    }
}