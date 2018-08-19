import * as React from 'react';
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/ECMSAgent_types';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import __ from './locale';


export default class ExternalDBConfigBase extends React.Component<any, any>{

    state = {
        externalDBInfo: {
            db_host: '',
            db_port: '',
            db_user: '',
            db_password: ''
        },
        defaultHostValidateState: undefined,
        defaultPortValidateState: undefined,
        testResult: undefined,
        saveResult: undefined
    }

    originExternalDBInfo: Readonly<Core.DatabaseSubsystem.ncTExternalDBInfo>;

    async componentWillMount() {
        let externalDBInfo = await ECMSManagerClient.get_external_db_info();
        this.originExternalDBInfo = externalDBInfo;
        this.setState({
            externalDBInfo
        })
    }

    /**
     * 测试
     */
    async test(externalDBInfo) {
        const success = await ECMSManagerClient.is_available_external_db(new ncTExternalDBInfo(externalDBInfo));
        if (success) {
            this.setState({
                testResult: true
            })
        } else {
            this.setState({
                testResult: false
            })
        }
    }

    /**
     * 保存
     */
    async save(externalDBInfo) {
        try {
            await ECMSManagerClient.update_external_db_info(new ncTExternalDBInfo(externalDBInfo));
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('设置 第三方数据库配置 成功'),
                exMsg: __('数据库服务器地址："${host}"，端口："${port}"', { 'host': externalDBInfo.db_host, 'port': externalDBInfo.db_port })
            })
            this.setState({
                saveResult: true
            })
        } catch (ex) {
            this.setState({
                saveResult: false
            })
        }

    }

    /**
     * 取消
     */
    cancel() {
        this.setState({
            externalDBInfo: {
                ...this.state.externalDBInfo,
                db_user: this.originExternalDBInfo ? this.originExternalDBInfo.db_user : '',
                db_password: this.originExternalDBInfo ? this.originExternalDBInfo.db_password : ''
            }
        })
    }
}