import * as React from 'react'
import { Dialog2, Panel, Select, ConfirmDialog, SuccessDialog, ErrorDialog, ProgressCircle } from '../../../../ui/ui.desktop'
import { getApproximateNumber } from '../../../../util/data/data'
import InitAsRAIDBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class InitAsRAID extends InitAsRAIDBase {
    render() {
        const { disks } = this.props
        const { selectedRAIDType, selectedDiskNum, initDialog, confirmDialog, processingInit, initErrMsg } = this.state
        return (
            <div>
                {
                    initDialog ?
                        (
                            <Dialog2
                                title={__('初始化RAID')}
                                onClose={() => { this.closeInitRAIDDialog() }}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <div>
                                            {
                                                disks ?
                                                    (
                                                        disks.length === 1 ?
                                                            (
                                                                <div>
                                                                    <div
                                                                        className={styles['tips']}
                                                                    >
                                                                        {__('RAID级别：')}
                                                                    </div>
                                                                    <Select
                                                                        value={selectedRAIDType}
                                                                    >
                                                                        <Select.Option
                                                                            value={'RAID0'}
                                                                        >
                                                                            {'RAID0'}
                                                                        </Select.Option>
                                                                    </Select>
                                                                </div>
                                                            )
                                                            :
                                                            (
                                                                disks.length === 2 ?
                                                                    (
                                                                        <div>
                                                                            <div>
                                                                                <div
                                                                                    className={styles['tips']}
                                                                                >
                                                                                    {__('RAID级别：')}
                                                                                </div>
                                                                                <Select
                                                                                    value={selectedRAIDType}
                                                                                >
                                                                                    <Select.Option
                                                                                        value={'RAID0'}
                                                                                    >
                                                                                        {'RAID0'}
                                                                                    </Select.Option>
                                                                                </Select>
                                                                            </div>
                                                                            <div
                                                                                className={styles['strategy']}
                                                                            >
                                                                                <div
                                                                                    className={styles['tips']}
                                                                                >
                                                                                    {__('磁盘组合策略：')}
                                                                                </div>
                                                                                <Select
                                                                                    value={selectedDiskNum}
                                                                                >
                                                                                    <Select.Option
                                                                                        value={1}
                                                                                    >
                                                                                        {__('每组${item}块磁盘', { item: 1 })}
                                                                                    </Select.Option>
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    :
                                                                    (
                                                                        <div>
                                                                            <div>
                                                                                <div
                                                                                    className={styles['tips']}
                                                                                >
                                                                                    {__('RAID级别：')}
                                                                                </div>
                                                                                <Select
                                                                                    value={selectedRAIDType}
                                                                                    onChange={(item) => { this.selectedRAIDTypeChange(item) }}
                                                                                >
                                                                                    <Select.Option
                                                                                        value={'RAID5'}
                                                                                    >
                                                                                        {'RAID5'}
                                                                                    </Select.Option>
                                                                                    <Select.Option
                                                                                        value={'RAID0'}
                                                                                    >
                                                                                        {'RAID0'}
                                                                                    </Select.Option>
                                                                                </Select>
                                                                            </div>
                                                                            <div
                                                                                className={styles['strategy']}
                                                                            >
                                                                                <div

                                                                                    className={styles['tips']}
                                                                                >
                                                                                    {__('磁盘组合策略：')}
                                                                                </div>
                                                                                <Select
                                                                                    value={selectedDiskNum}
                                                                                    onChange={(item) => { this.setState({ selectedDiskNum: item }) }}
                                                                                >
                                                                                    {
                                                                                        selectedDiskNum === 1
                                                                                            ?
                                                                                            (
                                                                                                <Select.Option
                                                                                                    value={1}
                                                                                                >
                                                                                                    {__('每组${item}块磁盘', { item: 1 })}
                                                                                                </Select.Option>
                                                                                            )
                                                                                            :
                                                                                            (
                                                                                                getApproximateNumber(disks.length, 3).map((item) => {
                                                                                                    return (
                                                                                                        <Select.Option
                                                                                                            value={item}
                                                                                                        >
                                                                                                            {__('每组${item}块磁盘', { item: item })}
                                                                                                        </Select.Option>
                                                                                                    )
                                                                                                })
                                                                                            )
                                                                                    }
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                            )
                                                    ) : null
                                            }
                                            <p
                                                className={styles['p']}
                                            >
                                                {__('注意：对磁盘进行初始化后，还需将其加入存储池内方可正常使用。')}
                                            </p>
                                        </div>
                                    </Panel.Main>

                                    <Panel.Footer>
                                        <Panel.Button
                                            type="submit"
                                            onClick={() => { this.confirmInitRAIDDialog() }}
                                        >
                                            {__('确定')}
                                        </Panel.Button>
                                        <Panel.Button
                                            onClick={() => { this.closeInitRAIDDialog() }}
                                        >
                                            {__('取消')}
                                        </Panel.Button>
                                    </Panel.Footer>

                                </Panel>
                            </Dialog2>
                        ) : null

                }

                {
                    confirmDialog ?
                        (
                            <ConfirmDialog
                                onConfirm={() => { this.InitRAID() }}
                                onCancel={() => { this.closeInitRAIDDialog() }}
                            >
                                {__('此操作将生成${groups}组逻辑设备，每组包含${num}个磁盘，并删除盘内所有数据，您确定要执行此操作吗？', { groups: (disks.length / selectedDiskNum), num: selectedDiskNum })}
                            </ConfirmDialog>
                        ) : null
                }

                {
                    processingInit ?
                        (
                            <ProgressCircle
                                detail={__('正在执行RAID初始化，请稍候......')}
                            />
                        ) : null
                }

                {
                    initErrMsg !== '' ?
                        (
                            <ErrorDialog
                                onConfirm={() => { this.initRAIDFaile() }}
                            >
                                <ErrorDialog.Title>
                                    {__('磁盘RAID初始化失败，错误信息如下：')}
                                </ErrorDialog.Title>
                                <ErrorDialog.Detail>
                                    {initErrMsg}
                                </ErrorDialog.Detail>
                            </ErrorDialog>
                        ) : null
                }
            </div>
        )
    }
}

