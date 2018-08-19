import * as React from 'react';
import { noop } from 'lodash';
import __ from './locale';
import * as styles from './styles.client';

const View: React.StatelessComponent<Components.Attributes.ApprovalMessage.Props> = function View({
    doApprovalCheck = noop
}) {
    return (
        <div>
            <div>{__('您的操作已提交审核，可在“共享申请”中查看。')}</div>
            <a
                className={styles.apvDialog}
                onClick={() => { doApprovalCheck() }}
            >
                {__('点此进入共享申请')}
            </a>
        </div>
    )
}

export default View