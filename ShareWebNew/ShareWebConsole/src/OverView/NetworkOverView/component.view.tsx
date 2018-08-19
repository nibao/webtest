import * as React from 'react';
import { FlexBox, UIIcon, Dialog2 as Dialog, Form, Panel, ErrorDialog, ProgressCircle, HeadBar, TextBox, Card, LinkChip, ValidateBox, ConfirmDialog, MessageDialog } from '../../../ui/ui.desktop';
import NetworkOverViewBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class NetworkOverView extends NetworkOverViewBase {
    render() {
        const vipInfos = this.state.vipInfos.reduce((vips, value) => {
            return {
                ...vips, [value.sys]: value
            }
        }, {})
        return (
            <div className={styles['contain']}>
                <Card>
                    <HeadBar>
                        {
                            __('网络概况')
                        }
                    </HeadBar>
                    {
                        !(vipInfos[NetworkOverViewBase.type.System] || vipInfos[NetworkOverViewBase.type.Application] || vipInfos[NetworkOverViewBase.type.Storage]) ?
                            this.state.keepaLivedStatus ?
                                (
                                    <div className={styles['warn']}>

                                        <FlexBox>
                                            <FlexBox.Item align={'center middle'}>
                                                <div className={styles['icon-warn']}>
                                                    <UIIcon code="\uf021" size={64} />
                                                </div>
                                                <span>
                                                    {
                                                        __('当前系统无网络配置，请')
                                                    }
                                                </span>
                                                <LinkChip className={styles['set-node']} onClick={this.props.doServerRedirect}>
                                                    {
                                                        __('设置高可用节点。')
                                                    }
                                                </LinkChip>
                                            </FlexBox.Item>
                                        </FlexBox>
                                    </div>

                                ) :
                                (
                                    <div className={styles['warn']}>

                                        <FlexBox>
                                            <FlexBox.Item align={'center middle'}>
                                                <div className={styles['icon-warn']}>
                                                    <UIIcon code="\uf021" size={64} />
                                                </div>
                                                <span>
                                                    {
                                                        __('当前系统未启用高可用服务，无网络配置。')
                                                    }
                                                </span>

                                            </FlexBox.Item>
                                        </FlexBox>
                                    </div>
                                )
                            :
                            null
                    }
                    {
                        vipInfos[NetworkOverViewBase.type.System] ?
                            (
                                <div className={styles['form']}>
                                    <div className={styles['item-title']}>
                                        <div className={styles['item-message']}>
                                            {
                                                __('系统访问IP')
                                            }
                                        </div>
                                        <div className={styles['item-button']}>
                                            <UIIcon
                                                onClick={() => { this.setVipInfo(vipInfos[NetworkOverViewBase.type.System], NetworkOverViewBase.type.System) }}
                                                code="\uf091"
                                                size={20}
                                            />
                                        </div>
                                    </div>
                                    {
                                        this.getSystemVipInfoTemplate(vipInfos[NetworkOverViewBase.type.System])
                                    }

                                </div>
                            ) :
                            null
                    }

                    {
                        vipInfos[NetworkOverViewBase.type.Application] || vipInfos[NetworkOverViewBase.type.Storage] ?
                            (
                                <FlexBox>
                                    {
                                        vipInfos[NetworkOverViewBase.type.Application] ?
                                            (<FlexBox.Item align="left top">
                                                <div className={styles['form']}>
                                                    <div className={styles['item-title']}>
                                                        <div className={styles['item-message']}>
                                                            {
                                                                __('应用服务访问Ip')
                                                            }
                                                        </div>
                                                        <div className={styles['item-button']}>
                                                            <UIIcon
                                                                onClick={() => { this.setVipInfo(vipInfos[NetworkOverViewBase.type.Application], NetworkOverViewBase.type.Application) }}
                                                                code="\uf091"
                                                                size={20}
                                                            />
                                                        </div>
                                                    </div>
                                                    {
                                                        this.getSystemVipInfoTemplate(vipInfos[NetworkOverViewBase.type.Application])
                                                    }

                                                </div>

                                            </FlexBox.Item>) :
                                            (<FlexBox.Item align="left top">
                                                <div className={styles['form']}>
                                                    <div className={styles['item-title']}>
                                                        <div className={styles['item-message']}>
                                                            {
                                                                __('存储服务访问Ip')
                                                            }
                                                        </div>
                                                        <div className={styles['item-button']}>
                                                            <UIIcon
                                                                onClick={() => { this.setVipInfo(vipInfos[NetworkOverViewBase.type.Storage], NetworkOverViewBase.type.Storage) }}
                                                                code="\uf091"
                                                                size={20}
                                                            />
                                                        </div>
                                                    </div>
                                                    {
                                                        this.getSystemVipInfoTemplate(vipInfos[NetworkOverViewBase.type.Storage])
                                                    }

                                                </div>

                                            </FlexBox.Item>)

                                    }
                                    {
                                        vipInfos[NetworkOverViewBase.type.Application] && vipInfos[NetworkOverViewBase.type.Storage] ?
                                            (
                                                <FlexBox.Item align="top">
                                                    <div className={styles['split-line']}></div>
                                                </FlexBox.Item>
                                            ) :
                                            null

                                    }
                                    {
                                        vipInfos[NetworkOverViewBase.type.Application] && vipInfos[NetworkOverViewBase.type.Storage] ?
                                            (<FlexBox.Item align="left top">
                                                <div className={styles['form']}>
                                                    <div className={styles['item-title']}>
                                                        <div className={styles['item-message']}>
                                                            {
                                                                __('存储服务访问Ip')
                                                            }
                                                        </div>
                                                        <div className={styles['item-button']}>
                                                            <UIIcon
                                                                onClick={() => { this.setVipInfo(vipInfos[NetworkOverViewBase.type.Storage], NetworkOverViewBase.type.Storage) }}
                                                                code="\uf091"
                                                                size={20}
                                                            />
                                                        </div>
                                                    </div>
                                                    {
                                                        this.getSystemVipInfoTemplate(vipInfos[NetworkOverViewBase.type.Storage])
                                                    }

                                                </div>

                                            </FlexBox.Item>) :
                                            null
                                    }
                                </FlexBox>
                            ) :
                            null
                    }
                </Card>
                {
                    this.state.editingVipInfo && this.state.editingVipInfo.vipInfo ?
                        this.editVipInfoTemplate(this.state.editingVipInfo) :
                        null
                }

                {
                    this.state.errorInfo ?
                        this.getErrorTemplate(this.state.errorInfo) :
                        null

                }

                {
                    this.state.progressStatus ?
                        this.getProgressTemplate(this.state.progressStatus) :
                        null
                }

                {
                    this.state.warning ?
                        (
                            <ConfirmDialog
                                onConfirm={this.confirmWarningDialog.bind(this)}
                                onCancel={this.cancelWarningDialog.bind(this)}
                            >
                                {
                                    __('系统将自动对选定网卡参数进行重新配置，您确定要执行本次操作吗？')
                                }
                            </ConfirmDialog>
                        ) :
                        null
                }
            </div>
        )
    }


    getSystemVipInfoTemplate(vipInfo) {
        return (
            <Form>
                <Form.Row>
                    <Form.Label>
                        {
                            __('IP地址：')
                        }
                    </Form.Label>
                    <Form.Field>
                        {
                            vipInfo.vip
                        }
                    </Form.Field>
                </Form.Row>

                <Form.Row>
                    <Form.Label>
                        {
                            __('子网掩码：')
                        }
                    </Form.Label>
                    <Form.Field>
                        {
                            vipInfo.mask
                        }
                    </Form.Field>
                </Form.Row>

                <Form.Row>
                    <Form.Label>
                        {
                            __('网卡：')
                        }
                    </Form.Label>
                    <Form.Field>
                        {
                            vipInfo.nic
                        }
                    </Form.Field>
                </Form.Row>
            </Form>
        )
    }


    editVipInfoTemplate(vipInfo) {
        const title = {
            [NetworkOverViewBase.type.System]: __('修改系统访问IP'),
            [NetworkOverViewBase.type.Application]: __('修改应用服务访问IP'),
            [NetworkOverViewBase.type.Storage]: __('修改存储服务访问IP')
        }

        return (
            <Dialog
                title={title[vipInfo.type]}
                onClose={this.cancelEditVipInfo.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    {
                                        __('IP地址：')
                                    }
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={vipInfo.vipInfo.vip}
                                        onChange={(value) => { this.editVip(value) }}
                                        validateState={this.state.IPValidateResult}
                                        validateMessages={
                                            { [NetworkOverViewBase.ValidateStatus.IPValidate]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数。') }
                                        }
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    {
                                        __('子网掩码：')
                                    }
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={vipInfo.vipInfo.mask}
                                        onChange={(value) => { this.editMask(value) }}
                                        validateState={this.state.maskValidateResult}
                                        validateMessages={
                                            { [NetworkOverViewBase.ValidateStatus.IPValidate]: __('子网掩码格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数。') }
                                        }
                                    />
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    {
                                        __('网卡：')
                                    }
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={vipInfo.vipInfo.nic}
                                        onChange={(value) => { this.editNic(value) }}
                                        validateState={this.state.nicValidateResult}
                                        validateMessages={
                                            { [NetworkOverViewBase.ValidateStatus.NicValidate]: __('网卡名称只能包含英文和数字。') }
                                        }
                                    />
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            onClick={this.confirmEditVipInfo.bind(this)}
                            disabled={!vipInfo.vipInfo.nic || !vipInfo.vipInfo.mask || !vipInfo.vipInfo.vip}
                        >
                            {
                                __('确定')
                            }
                        </Panel.Button>
                        <Panel.Button onClick={this.cancelEditVipInfo.bind(this)}>
                            {
                                __('取消')
                            }
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }

    getProgressTemplate(type) {
        const message = {
            [NetworkOverViewBase.type.System]: __('正在修改系统访问IP，请稍候……'),
            [NetworkOverViewBase.type.Application]: __('正在修改应用服务访问IP，请稍候……'),
            [NetworkOverViewBase.type.Storage]: __('正在修改存储服务访问IP，请稍候……')
        }
        return (
            this.state.progressStatus ?
                (
                    <div className={styles['warn']}>
                        <ProgressCircle detail={message[type]} />
                    </div>
                ) :
                null
        )
    }


    /**
     * 获取错误提示
     */
    getErrorTemplate(errorInfo) {
        switch (errorInfo.errID) {
            case 10003:
                return (
                    <MessageDialog onConfirm={this.confirmErrorDialog.bind(this)}>
                        {
                            __('网卡不存在。')
                        }
                    </MessageDialog>
                )
            default:
                return (
                    <ErrorDialog onConfirm={this.confirmErrorDialog.bind(this)}>
                        {
                            errorInfo.expMsg
                        }
                    </ErrorDialog>
                )
        }
    }

}