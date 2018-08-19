import * as React from 'react'
import * as classnames from 'classnames'
import { formatTime } from '../../../util/formatters/formatters'
import { getRoleName, getNodeInfos, ConfirmStatus } from '../../../core/siteupgrade/siteupgrade'
import { DataGrid, Text, Form, Button, ConfirmDialog } from '../../../ui/ui.desktop'
import ErrorDetail from '../ErrorDetail/component.desktop'
import NodeInfosBase from './component.base'
import __ from './locale'
import * as styles from './styles.view'

export default class NodeInfos extends NodeInfosBase {
    render() {
        const { currentVersion, upgradeStatusArray, confirmStatus, currentNode } = this.state
        const { startTime, endTime, nodeNums, doneNums, upgradingNums } = getNodeInfos(upgradeStatusArray)

        return (
            <div>
                <div className={styles['top-area']}>
                    <div className={styles['form-area']}>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('当前版本：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {currentVersion || '---'}
                                    </div>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('总节点数：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {nodeNums}
                                    </div>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </div>
                    <div className={styles['form-area']}>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('开始时间：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {
                                            startTime ? formatTime(startTime) : '---'
                                        }
                                    </div>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('已完成：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {doneNums}
                                    </div>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </div>
                    <div className={styles['form-area']}>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('完成时间：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {
                                            endTime ? formatTime(endTime) : '---'
                                        }
                                    </div>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['text']}>
                                        {__('升级中：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={classnames(styles['text'], styles['text-color'])}>
                                        {upgradingNums}
                                    </div>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </div>
                    <Button
                        className={styles['clear-btn']}
                        disabled={upgradingNums}
                        onClick={() => this.setState({ confirmStatus: ConfirmStatus.ClearUpgradStatus })}
                    >
                        {__('清空升级状态')}
                    </Button>
                </div>
                <DataGrid
                    height={400}
                    data={upgradeStatusArray}
                >
                    <DataGrid.Field
                        field="node_ip"
                        width="90"
                        label={__('节点IP')}
                        formatter={(node_ip, record) => (
                            <Text className={styles['text']}>
                                {node_ip}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="role"
                        width="150"
                        label={__('节点角色')}
                        formatter={(role, record) => (
                            <Text className={styles['text']}>
                                {getRoleName(record)}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="status"
                        width="70"
                        label={__('升级状态')}
                        formatter={(status, record) => (
                            <Text className={styles['text']}>
                                {status === 'done' ? __('已完成') : __('升级中')}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="comment"
                        width="120"
                        label={__('进度描述')}
                        formatter={(comment, record) => (
                            <Text className={styles['text']}>
                                {comment}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="errors"
                        width="50"
                        label={__('升级异常')}
                        formatter={(errors, record) => (
                            errors.length ?
                                <a
                                    className={styles['error-text']}
                                    href="javascript:void(0)"
                                    onClick={() => this.onViewUpgradeErrorDetail(record)}
                                >
                                    {errors.length}
                                </a>
                                :
                                <Text className={styles['text']}>
                                    {errors.length}
                                </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="last_time"
                        width="90"
                        label={__('状态更新时间')}
                        formatter={(last_time, record) => (
                            <Text className={styles['text']}>
                                {
                                    formatTime(last_time)
                                }
                            </Text>
                        )}
                    />
                </DataGrid>
                {
                    confirmStatus === ConfirmStatus.ClearUpgradStatus ?
                        <ConfirmDialog
                            onConfirm={this.clearUpgradeStatus.bind(this)}
                            onCancel={() => this.setState({ confirmStatus: ConfirmStatus.None })}>
                            {__('确定要清空升级状态吗？')}
                        </ConfirmDialog>
                        : null
                }
                {
                    currentNode ?
                        <ErrorDetail
                            node={currentNode}
                            onClose={() => this.setState({ node: null })}
                        />
                        : null
                }
            </div >
        )
    }
}