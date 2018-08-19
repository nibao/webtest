import * as React from 'react';
import { includes } from 'lodash';
import { Dialog2 as Dialog, ErrorDialog, Panel, TextBox, ComboArea, ValidateBox, Button, Form, ProgressCircle } from '../../../../ui/ui.desktop';
import { getErrorMessage, getErrorTemplate } from '../../../../core/exception/exception';
import AddConfigBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class AddConfig extends AddConfigBase {

    render() {
        return (
            <div>
                {
                    !this.state.errorID ?
                        <Dialog title={__('添加授权码')} onClose={this.props.oAddCancel}>
                            <Panel>
                                <Panel.Main>
                                    <div>
                                        {__('请输入您要添加的授权码，如果同时输入多个，请用回车键隔开：')}
                                    </div>
                                    <div className={styles['add']}>
                                        <div className={styles['add-input']}>
                                            <div className={styles['add-size']}>
                                                <ComboArea
                                                    minHeight={150}
                                                    placeholder={__('授权码形如 XXXXX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX，且每段子码位数为 5，只能包含数字和大写字母')}
                                                    width={'100%'}
                                                    value={this.state.licenses}
                                                    onChange={value => { this.changeLicenses(value) }}
                                                    validator={this.isLicense}
                                                    spliter={['\r\n']}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button disabled={!this.state.licenses.length} onClick={this.onConfirm.bind(this, this.state.licenses)}>
                                        {
                                            __('确定')
                                        }
                                    </Panel.Button>
                                    <Panel.Button onClick={this.props.oAddCancel}>
                                        {
                                            __('取消')
                                        }
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        :
                        <ErrorDialog
                            onConfirm={this.onErrorConfim.bind(this)}
                        >
                            <ErrorDialog.Title>
                                {this.getErrorMsgTitle(this.state.errorID)}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {
                                    this.getErrorMsg(this.state.errorID)
                                }
                            </ErrorDialog.Detail>

                        </ErrorDialog>
                }
                {
                    this.state.loading ?
                        <ProgressCircle
                            detail={__('正在添加......')}
                        />
                        :
                        null
                }

            </div>
        )
    }

    protected getErrorMsgTitle(errorID) {
        return includes([20504, 20517, 20515], errorID) ? __('授权码校验失败。错误原因：') : __('添加授权码失败。错误原因：')
    }

    protected getErrorMsg(errorID) {
        return errorID === 20501 || errorID === 20502 ?
            getErrorTemplate(errorID)({ licenseCode: this.state.licenseCode }) :
            getErrorMessage(errorID)
    }


}