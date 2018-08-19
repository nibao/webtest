import * as React from 'react'
import WebComponent from '../webcomponent';
import { setCsfLevelAuditStatus, getCsfLevelAuditStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import __ from './locale';

interface State {
    Status: boolean // 是否开启改密状态
    errorStatus: any
}

export default class CsfCheckBase extends WebComponent<any, any> {

    state = {
        status: false,
        errorInfo: null
    }

    async componentWillMount() {
        this.setState({
            status: await getCsfLevelAuditStatus()
        })
    }

    async setCsfLevelStatus(status) {
        try {
            await setCsfLevelAuditStatus(status);
            this.setState({ status })
            if (status) {
                manageLog(ManagementOps.SET, __('启用 文件改密审核机制 成功'), null, Level.WARN);
            } else {
                manageLog(ManagementOps.SET, __('禁用 文件改密审核机制 成功'), null, Level.WARN);
            }

        } catch (ex) {
            this.setState({
                errorInfo: ex
            })
        }
    }

}