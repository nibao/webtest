import * as React from 'react';
import { noop } from 'lodash';
import SimpleDialog from '../../../ui/SimpleDialog/ui.client';
import __ from './locale';
import * as styles from './styles.client.css';

export default function ApprovalMessage({ onConfirm = noop, doApprovalCheck = noop }: Components.LinkShare.ApprovalMessage.Props) {
    return (
        <SimpleDialog onConfirm={onConfirm}>
            <p>{__('您的操作已提交审核，可在“共享申请”中查看。')}</p>
            <a
                onClick={doApprovalCheck}
                className={styles['apvDialog']}
            >
                {
                    __('点此进入共享申请')
                }
            </a>
        </SimpleDialog>
    )
}