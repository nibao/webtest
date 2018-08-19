import * as React from 'react'
import * as classnames from 'classnames'
import { last } from 'lodash'
import { docname } from '../../../core/docs/docs'
import { AppBar, UIIcon } from '../../../ui/ui.mobile'
import CrumbsBase from './component.base'
import * as styles from './styles.mobile'
import __ from './locale'

export default class Crumbs extends CrumbsBase {
    render() {
        const { crumbs, className, onCancel } = this.props
        const currentDir = last(crumbs)

        return (
            <AppBar className={classnames(styles['container'], className)}>
                {
                    !!currentDir && (
                        <div className={styles['left']}>
                            <UIIcon
                                code={'\uf04d'}
                                size={30}
                                color={'#d70000'}
                                className={styles['icon']}
                                onClick={this.loadParent.bind(this)}
                            />
                        </div>
                    )
                }
                <div className={styles['title']}>{currentDir ? docname(currentDir) : __('文档')}</div>
                <div
                    className={classnames(styles['right'], styles['cancel-text'])}
                    onClick={onCancel}
                >
                    {
                        __('取消')
                    }
                </div>
            </AppBar>
        )
    }
}