import * as React from 'react'
import DocSelector from '../../DocSelector2/component.mobile'
import CopyToBase, { CopyStatus } from './component.base'
import Drawer from '../../../ui/Drawer/ui.mobile'
import MessageDialog from '../../../ui/MessageDialog/ui.mobile'
import { getErrorMessage } from '../../../core/errcode/errcode'
import ProgressCircle from '../../../ui/ProgressCircle/ui.mobile';
import { docname } from '../../../core/docs/docs'
import * as fs from '../../../core/filesystem/filesystem'
import * as styles from './styles.mobile.css'

export default class CopyTo extends CopyToBase {

    renderError() {
        const { error } = this.state
        if (!error) {
            return null
        }
        const { apiError, deferred } = error
        return (
            <MessageDialog onConfirm={deferred.resolve}>
                {getErrorMessage(apiError.errcode)}
            </MessageDialog>
        )
    }

    render() {
        const { status } = this.state
        return (
            <div>
                <Drawer mask={true} open={status === CopyStatus.Pick}>
                    <DocSelector
                        title={(s, dir) => `复制到“${dir ? docname(dir) : '文档'}”`}
                        className={styles['selector']}
                        selectType={0}
                        multiple={false}
                        onConfirm={this.copy.bind(this)}
                        onCancel={this.cancel.bind(this)}
                        disabled={(selections, dir) => dir === null || fs.isVirtual(dir)}
                    />
                </Drawer>
                {
                    status === CopyStatus.Progress ?
                        <ProgressCircle detail={'正在复制...'} /> :
                        null
                }
                {
                    this.renderError()
                }
            </div>
        )
    }
}