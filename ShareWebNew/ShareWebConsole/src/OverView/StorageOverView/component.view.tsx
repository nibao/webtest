import * as React from 'react';
import { Card, FlexBox, UIIcon, Form, Dialog2 as Dialog, Panel, Button, StackBar, Select, HeadBar, ProgressCircle, LinkChip, ConfirmDialog, ErrorDialog, ProgressBar } from '../../../ui/ui.desktop';
import StorageOverViewBase from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';
import { getErrorMessage } from '../../../core/errcode/errcode';

export default class StorageOverView extends StorageOverViewBase {
    render() {
        if (this.state.storagePool) {
            const { ring, logical_used_size_gb, physical_used_size_gb } = this.state.storagePool
        }

        return (
            <div className={styles['contain']}>
                <Card>
                    <HeadBar>
                        {
                            __('存储概况')
                        }
                    </HeadBar>
                    {
                        this.state.storageStatus === StorageOverViewBase.StorageStatus.ThirdStorage || this.state.storageStatus === StorageOverViewBase.StorageStatus.ASUStorage ?
                            (
                                <div className={styles['warn']}>

                                    <FlexBox>
                                        <FlexBox.Item align={'center middle'}>
                                            <div className={styles['icon-warn']}>
                                                <UIIcon code="\uf021" size={64} />
                                            </div>
                                            <span>
                                                {
                                                    __('当前系统采用')
                                                }
                                            </span>
                                            <LinkChip className={styles['set-node']} onClick={this.props.doStorageRedirect}>
                                                {
                                                    this.state.storageStatus === StorageOverViewBase.StorageStatus.ASUStorage ?
                                                        __('本地Ceph存储') :
                                                        __('第三方存储')
                                                }
                                            </LinkChip>
                                            <span>
                                                {
                                                    __('。')
                                                }
                                            </span>
                                        </FlexBox.Item>
                                    </FlexBox>
                                </div>
                            ) :
                            null

                    }

                    {
                        this.state.storageStatus === StorageOverViewBase.StorageStatus.NotHasApplication ?
                            (
                                <div className={styles['warn']}>

                                    <FlexBox>
                                        <FlexBox.Item align={'center middle'}>
                                            <div className={styles['icon-warn']}>
                                                <UIIcon code="\uf021" size={64} />
                                            </div>
                                            <span>
                                                {
                                                    __('未设置应用节点，请')
                                                }
                                            </span>
                                            <LinkChip className={styles['set-node']} onClick={this.props.doServerRedirect}>
                                                {
                                                    __('设置应用节点')
                                                }
                                            </LinkChip>
                                            <span>
                                                {
                                                    __('。')
                                                }
                                            </span>
                                        </FlexBox.Item>
                                    </FlexBox>
                                </div>
                            ) :
                            null

                    }
                    {
                        this.state.storageStatus === StorageOverViewBase.StorageStatus.UnInited ?
                            (
                                <div className={styles['warn']}>

                                    <FlexBox>
                                        <FlexBox.Item align={'center middle'}>
                                            <div className={styles['icon-warn']}>
                                                <UIIcon code="\uf021" size={64} />
                                            </div>
                                            <span>
                                                {
                                                    __('存储池尚执行未初始化，请前往')
                                                }
                                            </span>
                                            <LinkChip className={styles['set-node']} onClick={this.props.doStorageRedirect}>
                                                {
                                                    __('存储子系统')
                                                }
                                            </LinkChip>
                                            <span>
                                                {
                                                    __('进行初始化设置。')
                                                }
                                            </span>
                                        </FlexBox.Item>
                                    </FlexBox>
                                </div>
                            ) :
                            null

                    }

                    {
                        this.state.storageStatus === StorageOverViewBase.StorageStatus.Loading ?
                            (
                                <div className={styles['load']}>
                                    <ProgressCircle showMask={false} fixedPositioned={false} detail={__('正在加载，请稍后……')} />
                                </div>
                            ) :
                            null
                    }

                    {
                        this.state.storageStatus === StorageOverViewBase.StorageStatus.Inited ?
                            (
                                <div className={styles['form']}>
                                    <Form >
                                        <Form.Row>
                                            <Form.Label>
                                                {
                                                    __('系统存储策略：')
                                                }
                                            </Form.Label>
                                            <Form.Field>
                                                <span className={styles['model']}>
                                                    {
                                                        ring.replicas === 1 ?
                                                            __('1 副本模式') :
                                                            __('3 副本模式')
                                                    }
                                                </span>
                                            </Form.Field>
                                            <Form.Field>
                                                <UIIcon
                                                    code="\uf044"
                                                    size={13}
                                                    onClick={this.openReplicasSetPanel.bind(this)}
                                                    className={styles['model-set']}
                                                />
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label>
                                                {
                                                    __('副本健康度：')
                                                }
                                            </Form.Label>
                                            <Form.Field>
                                                <span>
                                                    {
                                                        this.state.replicasHealth === -1 ?
                                                            '---' :
                                                            `${this.state.replicasHealth.toFixed(2)}%`
                                                    }
                                                </span>

                                            </Form.Field>
                                            <Form.Field>
                                                <span className={styles['model-status']}>
                                                    {
                                                        this.state.replicasHealth === 100 && __('最佳')
                                                    }
                                                </span>
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label>
                                                {
                                                    __('负载均衡状态：')
                                                }
                                            </Form.Label>
                                            <Form.Field>
                                                <span>
                                                    {
                                                        ring.balance
                                                    }
                                                </span>

                                            </Form.Field>
                                            <Form.Field>
                                                {
                                                    ring.balance === 0 ?
                                                        (
                                                            <span className={styles['model-status']}>
                                                                {
                                                                    __('最佳')
                                                                }
                                                            </span>)
                                                        : (
                                                            <Button className={styles['model-set']} onClick={this.resetBalance.bind(this)}>
                                                                {
                                                                    __('重载均衡')
                                                                }
                                                            </Button>
                                                        )
                                                }
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                {
                                                    __('逻辑空间使用率：')
                                                }
                                            </Form.Label>
                                            <Form.Field>
                                                {
                                                    logical_used_size_gb === -1 ?
                                                        (
                                                            <div className={styles['quota-not-exist']}>
                                                                {
                                                                    __('无法读取')
                                                                }
                                                            </div>
                                                        ) :
                                                        (
                                                            <div className={styles['quota']}>
                                                                <div className={styles['quota-num']}>
                                                                    {
                                                                        ring.logical_capacity_gb ?
                                                                            `${(logical_used_size_gb / ring.logical_capacity_gb * 100).toFixed(2)}%` :
                                                                            '0%'
                                                                    }
                                                                </div>
                                                                <div className={styles['quota-bar']}>
                                                                    {
                                                                        ring.logical_capacity_gb ?
                                                                            (<ProgressBar
                                                                                width={280}
                                                                                value={ring.logical_capacity_gb ? logical_used_size_gb / ring.logical_capacity_gb : 0}
                                                                                renderValue={value => this.progressBarValue(logical_used_size_gb, ring.logical_capacity_gb)}
                                                                            />) :
                                                                            null
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                }
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label>
                                                {
                                                    __('物理空间使用率：')
                                                }
                                            </Form.Label>
                                            <Form.Field>
                                                {
                                                    physical_used_size_gb === -1 ?
                                                        (
                                                            <div className={styles['quota-not-exist']}>
                                                                {
                                                                    __('无法读取')
                                                                }
                                                            </div>
                                                        ) :
                                                        (
                                                            <div className={styles['quota']}>
                                                                <div className={styles['quota-num']}>
                                                                    {
                                                                        ring.physical_capacity_gb ?
                                                                            `${(physical_used_size_gb / ring.physical_capacity_gb * 100).toFixed(2)}%` :
                                                                            '0%'
                                                                    }
                                                                </div>
                                                                <div className={styles['quota-bar']}>
                                                                    {
                                                                        ring.physical_capacity_gb ?
                                                                            (<ProgressBar
                                                                                width={280}
                                                                                value={ring.physical_capacity_gb ? physical_used_size_gb / ring.physical_capacity_gb : 0}
                                                                                renderValue={(value) => this.progressBarValue(physical_used_size_gb, ring.physical_capacity_gb)}
                                                                            />) :
                                                                            null
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                }
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                </div>
                            ) :
                            null

                    }
                    {
                        this.state.showEditReplicas ?
                            (
                                <Dialog
                                    title={__('存储策略配置')}
                                    width={500}
                                    onClose={this.cancelReplicas.bind(this)}
                                >
                                    <Panel>
                                        <Panel.Main>
                                            <div className={styles['replicas-panel']}>
                                                <label>
                                                    {
                                                        __('系统存储策略：')
                                                    }
                                                </label>
                                                <Select value={this.state.editReplicas} onChange={this.setReplicas.bind(this)} >
                                                    {
                                                        [1, 3].filter((value) => {
                                                            if (ring.replicas === 3 && value === 1) {
                                                                return false
                                                            } else {
                                                                return true
                                                            }
                                                        }).map(value => {
                                                            return (
                                                                <Select.Option
                                                                    value={value}
                                                                    selected={ring.replicas === value}
                                                                >
                                                                    {
                                                                        ({
                                                                            1: __('1 副本模式'),
                                                                            3: __('3 副本模式')
                                                                        })[value]
                                                                    }

                                                                </Select.Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                            <FlexBox>
                                                <FlexBox.Item align="top">
                                                    <label className={styles['replicas-panel-title']} >
                                                        {__('注意：')}
                                                    </label>
                                                </FlexBox.Item>
                                                <FlexBox.Item>
                                                    {
                                                        __('副本数量越多，数据安全性越高，但会导致池内逻辑可用空间减少。只允许更改为更高级的副本模式，无法退回到更低级的副本模式。')
                                                    }
                                                </FlexBox.Item>
                                            </FlexBox>
                                        </Panel.Main>
                                        <Panel.Footer>
                                            <Panel.Button onClick={this.confirmReplicas.bind(this)}>
                                                {
                                                    __('确定')
                                                }
                                            </Panel.Button>
                                            <Panel.Button onClick={this.cancelReplicas.bind(this)}>
                                                {
                                                    __('取消')
                                                }
                                            </Panel.Button>
                                        </Panel.Footer>
                                    </Panel>
                                </Dialog>
                            ) :
                            null
                    }
                    {
                        this.state.resetBalanceWarn ?
                            (
                                <ConfirmDialog
                                    onConfirm={this.confirmResetBalance.bind(this)}
                                    onCancel={this.cancelResetBalance.bind(this)}
                                >
                                    {
                                        __('此操作可能会导致集群系统内数据迁移，该过程可能会影响系统性能，您确定要执行此操作吗？')
                                    }
                                </ConfirmDialog>
                            ) :
                            null
                    }
                </Card>

                {
                    this.state.error ?
                        this.getErrorTemplate(this.state.error) :
                        null
                }

                {
                    this.state.changingStorageModel ?
                        (
                            <ProgressCircle detail={__('正在修改存储策略，请稍候……')} />
                        ) :
                        null
                }

                {
                    this.state.resetingBalance ?
                        (
                            <ProgressCircle detail={__('正在重载，请稍候……')} />
                        ) :
                        null
                }
            </div>
        )
    }

    getErrorTemplate(error) {
        const errorMessages = {
            [StorageOverViewBase.ErrorReason.GetStorageInfoError]: __('获取存储配置失败，错误信息如下：'),
            [StorageOverViewBase.ErrorReason.GetStoragePoolFail]: __('获取存储池状态失败，错误信息如下：'),
            [StorageOverViewBase.ErrorReason.InitStoragePoolFail]: __('初始化存储池失败，错误信息如下：'),
            [StorageOverViewBase.ErrorReason.ResetBalanceFail]: __('重载均衡失败，错误信息如下：')
        }

        return (
            <ErrorDialog onConfirm={this.closeErrorDialog.bind(this)} >
                <ErrorDialog.Title>
                    {
                        errorMessages[error.errorReason]
                    }
                </ErrorDialog.Title>
                <ErrorDialog.Detail>
                    {
                        error.errorInfo.expMsg ?
                            error.errorInfo.expMsg :
                            error.errorInfo
                    }
                </ErrorDialog.Detail>
            </ErrorDialog>
        )

    }

}