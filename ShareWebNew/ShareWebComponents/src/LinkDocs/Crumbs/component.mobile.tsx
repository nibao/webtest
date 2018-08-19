import * as React from 'react'
import * as classnames from 'classnames'
import { last } from 'lodash'
import { docname } from '../../../core/docs/docs'
import { AppBar, UIIcon } from '../../../ui/ui.mobile'
import UploadPicker from '../../Upload/Picker/component.mobile'
import CrumbsBase from './component.base'
import * as styles from './styles.mobile'
import __ from './locale'

export default class Crumbs extends CrumbsBase {
    render() {
        const { crumbs, uploadEnable, className } = this.props
        const currentDir = last(crumbs)

        return (
            <AppBar className={classnames(styles['container'], className)}>
                <div className={styles['left']}>
                    <UIIcon
                        code={'\uf04d'}
                        size={30}
                        color={'#d70000'}
                        className={styles['icon']}
                        onClick={this.loadParent.bind(this)}
                    />
                </div>
                <div className={styles['title']}>{docname(currentDir)}</div>
                <div className={styles['right']}>
                    {
                        !!uploadEnable && (
                            <UploadPicker
                                dest={currentDir}
                                className={styles['upload-picker']}
                                multiple={false}
                            >
                                {__('上传')}
                            </UploadPicker>
                        )
                    }
                </div>
            </AppBar>
        )
    }
}