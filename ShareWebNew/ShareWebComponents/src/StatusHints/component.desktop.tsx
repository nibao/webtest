import * as React from 'react'
import * as classnames from 'classnames'
import StatusHintsBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class StatusHints extends StatusHintsBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['head-content']}>
                    <div className={styles['big-font']}>
                        {__('欢迎登录！')}
                    </div>
                    <div className={styles['sub-item']}>
                        {__('请在云盘目录下进行文档操作和共享。')}
                    </div>
                </div>
            </div>
        )
    }
}