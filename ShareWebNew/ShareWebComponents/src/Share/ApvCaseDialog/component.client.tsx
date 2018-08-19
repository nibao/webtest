import * as React from 'react';
import { noop } from 'lodash'
import SimpleDialog from '../../../ui/SimpleDialog/ui.client';
import __ from './locale';
import * as styles from './styles.desktop';

const ApvCaseDialog: React.StatelessComponent<Components.Share.ApvCaseDialog.Props> = function ApvCaseDialog({
    onConfirm = noop,
    doApvJump = noop,
    onResize = noop
}) {
    return (
        <SimpleDialog
            onConfirm={onConfirm}
            onResize={onResize}
        >
            <div className={styles['apv-wrapper']}>
                {__('您的操作已提交审核，可在“共享申请”中查看。')}
                <a
                    href="javascript:void(0)"
                    onClick={doApvJump}
                    className={styles['a-link']}
                >
                    {__('点此进入共享申请')}
                </a>
            </div>
        </SimpleDialog>
    )
}

export default ApvCaseDialog