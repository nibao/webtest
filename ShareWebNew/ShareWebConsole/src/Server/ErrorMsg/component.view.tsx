import * as React from 'react';
import { noop } from 'lodash';
import { ErrorCode as EcmsmanagerErrcode } from '../../../core/thrift/ecmsmanager/errcode';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import { Operation } from '../helper';
import __ from './locale';

const operationDescription = {
    addNode: __('添加节点'),
    setHaMaster: __('配置高可用主节点'),
    setHaSlave: __('配置高可用从节点'),
    addApplicationNode: __('配置应用节点'),
    setNodeAlias: __('配置节点名称'),
    setDbMaster: __('配置数据库主节点'),
    setDbSlave: __('配置数据库从节点'),
    addStorageNode: __('配置存储节点'),
    addSingleApplicationNode: __('安装文档索引'),
    delApplicationNode: __('删除应用节点'),
    delSingleApplicationNode: __('卸载文档索引'),
    cancelDbNode: __('删除数据库节点'),
    cancelHaNode: __('删除高可用节点'),
    delStorageNode: __('删除存储节点')
}

/**
 * 显示错误弹窗
 */
const ErrorMsg: React.StatelessComponent<Components.Server.ErrorMsg.Props> = function ErrorMsg({
    operation,
    errorInfo,
    onConfirmErrMsg = noop
}) {
    switch (operation) {
        case Operation.AddNode:
        case Operation.SetNode:
            return (
                <ErrorDialog
                    onConfirm={() => onConfirmErrMsg(errorInfo)}
                >
                    <ErrorDialog.Title>
                        {
                            errorInfo.success.length ?
                                errorInfo.success.map(([successResult, progress]) => {
                                    return (
                                        <p>
                                            {__('${successOperation}成功。', { successOperation: operationDescription[progress] })}
                                        </p>
                                    )
                                })
                                : null
                        }
                        {
                            errorInfo.notCompleted.length ?
                                errorInfo.notCompleted.map(progress => {
                                    return (
                                        <p>
                                            {__('未执行${notCompletedOperation}。', { notCompletedOperation: operationDescription[progress] })}
                                        </p>
                                    )
                                })
                                : null

                        }
                        <p>
                            {
                                errorInfo.failed.length ?
                                    errorInfo.failed[0].errID === EcmsmanagerErrcode.SshToRemoteHostFailed ?
                                        __('配置失败，验证信息输入不正确。') :
                                        errorInfo.failed[0].errID === EcmsmanagerErrcode.NodeNumOverFlow ?
                                            __('添加节点 ${host} 失败。错误信息：', { host: errorInfo.failed[0].host }) :
                                            __('${errorOperation}失败，错误信息如下：', { errorOperation: operationDescription[errorInfo.failed[0].errorRequest] })
                                    : null
                            }
                        </p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {
                            errorInfo.failed[0].errID === EcmsmanagerErrcode.NodeNumOverFlow ?
                                __('添加的节点数已达节点授权总数上限') :
                                errorInfo.failed[0].errorMsg
                        }
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )
        case Operation.FixConsistency:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('同步系统配置失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        case Operation.DeleteNode:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('删除节点失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        case Operation.CloseLVSAppBalancing:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('关闭LVS负载均衡-应用失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        case Operation.CloseLVSStorageBalancing:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('关闭LVS负载均衡-存储失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        case Operation.OpenLVSAppBalancing:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('开启LVS负载均衡-应用失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        case Operation.OpenLVSStorageBalancing:
            return (
                <ErrorDialog onConfirm={onConfirmErrMsg}>
                    <ErrorDialog.Title>
                        <p>{__('开启LVS负载均衡-存储失败，错误信息如下：')}</p>
                    </ErrorDialog.Title>
                    <ErrorDialog.Detail>
                        {errorInfo}
                    </ErrorDialog.Detail>
                </ErrorDialog>
            )

        default:
            return <noscript />
    }
}

export default ErrorMsg
