import * as React from 'react'
import { Dialog2, Panel, Select, ConfirmDialog, SuccessDialog, ErrorDialog, ProgressCircle } from '../../../../ui/ui.desktop'
import SetAsHotSpareBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class SetAsHotSpare extends SetAsHotSpareBase {
    render() {
        const { setDialog, lgDiskList, selectedLgDisk, confirmDialog, processingSet, setErrMsg } = this.state

        return (
            <div>
                {
                    setDialog ?
                        (
                            <Dialog2
                                title={__('设为热备盘')}
                                onClose={() => { this.closeSetAsHotSpareDialog() }}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <div
                                            className={styles['wrapper']}
                                        >
                                            <div
                                                className={styles['tips']}
                                            >
                                                {__('可关联逻辑设备：')}
                                            </div>
                                            <Select
                                                value={selectedLgDisk}
                                                onChange={(item) => { this.setState({ selectedLgDisk: item }) }}
                                            >
                                                {
                                                    lgDiskList.map((item) => {
                                                        return (
                                                            <Select.Option
                                                                value={item}
                                                            >
                                                                {
                                                                    item === SetAsHotSpareBase.GLOBAL_HOT_SPARE ?
                                                                        __('服务器全局')
                                                                        :
                                                                        item
                                                                }
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </Panel.Main>

                                    <Panel.Footer>
                                        <Panel.Button
                                            type="submit"
                                            onClick={() => { this.confirmSetAsHotSpareDialog() }}
                                        >
                                            {__('确定')}
                                        </Panel.Button>
                                        <Panel.Button
                                            onClick={() => { this.closeSetAsHotSpareDialog() }}
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
                                onConfirm={() => { this.setAsHotSpare() }}
                                onCancel={() => { this.closeSetAsHotSpareDialog() }}
                            >
                                {__('设为热备盘将删除盘内所有数据，您确定要执行此操作吗？')}
                            </ConfirmDialog>
                        ) : null
                }

                {
                    processingSet ?
                        (
                            <ProgressCircle
                                detail={__('正在设置，请稍候......')}
                            />
                        ) : null
                }

                {
                    setErrMsg !== '' ?
                        (
                            <ErrorDialog
                                onConfirm={() => { this.setAsHotSpareFail() }}
                            >
                                <ErrorDialog.Title>
                                    {__('设置热备盘失败，错误信息如下：')}
                                </ErrorDialog.Title>
                                <ErrorDialog.Detail>
                                    {setErrMsg}
                                </ErrorDialog.Detail>
                            </ErrorDialog>

                        ) : null
                }

            </div>
        )
    }
}

