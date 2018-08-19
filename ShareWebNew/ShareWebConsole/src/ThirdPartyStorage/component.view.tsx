import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import { Link } from 'react-router';
import Button from '../../ui/Button/ui.desktop';
import LinkButton from '../../ui/LinkButton/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import ThirdPartyStorageBase from './component.base';
import { LoadingStatus, ErrorStatus, ValidateMessages, StorageMode } from './helper';
import __ from './locale';
import * as styles from './styles.view.css';


export default class ThirdPartyStorage extends ThirdPartyStorageBase {

    render() {

        const thirdProvider = [
            { name: '请选择第三方服务商', value: 'empty' },
            { name: 'Ceph', value: 'CEPH' },
            { name: '阿里云', value: 'OSS' },
            { name: '百度开放云', value: 'BOS' },
            { name: '七牛云存储', value: 'QINIU' },
            { name: '亚马逊', value: 'AWS' },
            { name: '亚马逊中国', value: 'AWSCN' },
            { name: '微软Azure', value: 'AZURE' },

        ]
        let { serverName, errMsg, lockProvider, loadingStatus, thirdPartyOSSInfo, providerSelection, isAnyInputChange, errorStatus, validateState } = this.state;

        let inputSettings = [
            { name: __('Bucket：'), value: 'bucket' },
            { name: __('账号：'), value: 'accessId' },
            { name: __('密码：'), value: 'accessKey' },
            { name: __('服务器地址：'), value: 'serverName' },
            { name: __('内部服务器地址：'), value: 'internalServerName' },
            { name: __('http端口：'), value: 'httpPort' },
            { name: __('https端口：'), value: 'httpsPort' },
        ]


        return (

            <div className={classnames(styles['storage-third'])} >
                {
                    this.renderLoadingContent(loadingStatus)
                }
                {
                    this.props.storageMode === StorageMode.THIRD ?
                        null
                        :
                        <div className={classnames(styles['storage-third-title'])} >
                            {
                                __('本地Ceph存储服务配置')
                            }
                        </div>
                }
                <div className={classnames(styles['storage-third-service'])}>
                    <Form>
                        {
                            this.props.storageMode === StorageMode.THIRD ?

                                <Form.Label>
                                    <div>
                                        {__('服务商：')}
                                    </div>
                                </Form.Label>
                                :
                                null
                        }
                        {
                            this.props.storageMode === StorageMode.THIRD ?
                                <Form.Field>
                                    <Select
                                        disabled={lockProvider}
                                        value={providerSelection}
                                        className={styles['storage-third-provider']}
                                        onChange={(item) => { this.handleSelectThirdProviderMenu(item) }}
                                        menu={{ width: 420, maxHeight: 600 }}
                                    >
                                        {
                                            thirdProvider.map((provider) =>
                                                <Select.Option
                                                    selected={_.isEqual(provider, providerSelection)}
                                                    value={provider}
                                                >
                                                    {
                                                        provider.name
                                                    }
                                                </Select.Option>
                                            )
                                        }
                                    </Select>
                                </Form.Field>

                                :
                                null

                        }

                        {
                            providerSelection.value !== 'empty' ?
                                inputSettings.map((setting) =>
                                    this.renderParamsInput(thirdPartyOSSInfo, setting, validateState)
                                )
                                :
                                null
                        }
                    </Form>

                </div>



                <div className={classnames(styles['storage-third-info-container'])} >
                    {
                        isAnyInputChange ?
                            <div className={classnames(styles['storage-third-footer'])}>
                                <Button
                                    className={classnames(styles['storage-test-button'])}
                                    onClick={() => this.handleTestSetting()}
                                >
                                    {__('测试')}
                                </Button>
                                <Button
                                    className={classnames(styles['storage-cancel-button'])}
                                    onClick={() => this.handleCancelSave()}
                                >
                                    {__('取消')}
                                </Button>
                                <Button
                                    className={classnames(styles['storage-save-button'])}
                                    onClick={() => this.handleConfirmSave()}
                                >
                                    {__('保存')}
                                </Button>

                            </div>
                            :
                            null
                    }

                    {
                        this.props.storageMode !== StorageMode.THIRD && serverName ?
                            <div className={styles['storage-third-controlLink']}>
                                <LinkButton onClick={this.handleClickControlLink.bind(this)}>
                                    {__('进入存储管理控制台')}
                                </LinkButton>
                            </div>
                            :
                            null
                    }

                </div >


                {
                    this.renderErrorContent(errorStatus, errMsg)
                }
            </div >
        )
    }
    /**
     * 根据provider不同进而渲染不同的参数input
     */
    renderParamsInput(thirdPartyOSSInfo, setting, validateState) {
        let show = false;
        let mark = false;
        let validate = false;
        switch (setting.value) {
            case 'bucket':
            case 'accessId':
            case 'accessKey':
            case 'serverName':
                show = true;
                mark = true;
                break;
            case 'internalServerName':
                show = thirdPartyOSSInfo.provider === 'OSS' ? true : false;
                break;
            case 'httpPort':
            case 'httpsPort':
                validate = true;
                show = (thirdPartyOSSInfo.provider === 'ASU' || thirdPartyOSSInfo.provider === 'CEPH') ? true : false
                break;

            default:
                break;

        }

        if (show) {
            return (
                <Form.Row>
                    <Form.Label>
                        <div>
                            {setting.name}
                        </div>
                    </Form.Label>
                    <Form.Field>
                        {
                            validate ?
                                <ValidateBox
                                    className={classnames(styles['storage-third-input'])}
                                    validateMessages={ValidateMessages}
                                    validateState={setting.value === 'httpPort' ? validateState.httpPort : validateState.httpsPort}
                                    value={thirdPartyOSSInfo[setting.value]}
                                    onChange={(value) => this.handleInputChange(value, setting.value)}
                                >
                                </ValidateBox>
                                :
                                <ValidateBox
                                    className={classnames(styles['storage-third-input'])}
                                    value={thirdPartyOSSInfo[setting.value]}
                                    onChange={(value) => this.handleInputChange(value, setting.value)}
                                    type={setting.value === 'accessKey' ? 'password' : 'text'}
                                >
                                </ValidateBox>
                        }
                    </Form.Field>
                </Form.Row>
            )
        }
    }

    /**
    * 渲染等待提示
    */
    renderLoadingContent(loadingStatus) {
        let loadingMsg = '';
        switch (loadingStatus) {
            case LoadingStatus.NOVISIBLE:
                return;
            case LoadingStatus.LOADING:
                loadingMsg = __('正在加载，请稍候......')
                break;
            default:
                return;
        }

        return (
            <div className={styles['loading']}>
                <ProgressCircle
                    detail={loadingMsg}
                />
            </div>

        )
    }

    /**
     * 渲染错误提示框
     */
    renderErrorContent(errorStatus, errMsg) {
        let errorTip = '';
        switch (errorStatus) {
            case ErrorStatus.NOVISIBLE:
                return;
            case ErrorStatus.UNACCESS_SETTING:
                errorTip = __('连接失败，对象存储配置不可用。')
                break;
            case ErrorStatus.SAVE_FAILED:
                errorTip = errMsg
                break
            default:
                return;
        }

        return (
            <ErrorDialog
                onConfirm={() => { this.handleConfirmErrorDialog() }}
            >
                <ErrorDialog.Detail>
                    <span>
                        {errorTip}
                    </span>
                </ErrorDialog.Detail>
            </ErrorDialog>
        )
    }



}
