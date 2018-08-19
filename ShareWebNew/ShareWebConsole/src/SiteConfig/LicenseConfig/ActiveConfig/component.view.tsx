import * as React from 'react';
import { Dialog2 as Dialog, Panel, ValidateBox, ProgressCircle, ErrorDialog, MessageDialog } from '../../../../ui/ui.desktop';
import ActiveConfigBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

const ValidError = 0

export default class ActiveConfig extends ActiveConfigBase {

    render() {
        return (
            <div>
                <Dialog title={__('激活授权码')} onClose={this.props.onActiveCancel}>
                    <Panel>
                        <Panel.Main>
                            <div className={styles['item']}>
                                {__('授权码：')}
                                {this.props.activeLicense.value}
                            </div>
                            <div className={styles['item']}>
                                {__('机器码：')}
                                {this.props.machineCode}
                            </div>
                            <div className={styles['text']}>
                                <div>{__('请输入授权码对应的激活码：')}</div>
                            </div>
                            <div>
                                <ValidateBox
                                    className={styles['validatebox']}
                                    validateState={this.state.defaultValState}
                                    validateMessages={{ [ValidError]: __('您的输入有误，激活码只包含数字和大写字母，请重新输入。') }}
                                    value={this.state.activeCode}
                                    onChange={value => { this.setActiveCode(value) }}
                                />
                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button disabled={!this.state.activeCode} onClick={this.onConfirm.bind(this, this.state.activeCode)}>
                                {
                                    __('确定')
                                }
                            </Panel.Button>
                            <Panel.Button onClick={this.props.onActiveCancel}>
                                {
                                    __('取消')
                                }
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
                {
                    this.state.errorID ?
                        <ErrorDialog
                            onConfirm={this.onErrorConfim.bind(this)}
                        >
                            <ErrorDialog.Title>
                                {__('激活授权码失败，错误原因：')}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {
                                    this.getErrorMsg(this.state.errorID, this.state.errorMessage)
                                }
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        :
                        null
                }
                {
                    this.state.message ?
                        <MessageDialog
                            onConfirm={this.onMessageConfim.bind(this)}
                        >
                            {
                                this.state.message
                            }
                        </MessageDialog>
                        :
                        null
                }
                {
                    this.state.loading ?
                        <ProgressCircle
                            detail={__('正在激活......')}
                        />
                        :
                        null
                }
            </div>
        )
    }

}