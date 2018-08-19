import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import ExportLogBase from './component.base';
import { ValidateState, ExportStatus } from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';
export default class ExportLog extends ExportLogBase {
    render() {
        return (
            <div>
                {
                    this.state.exportStatus === ExportStatus.SWITCH_OPEN ?
                        <div>
                            <Dialog
                                title={__("提示")}
                                onClose={this.cancelExport.bind(this)}
                            >
                                <div className={styles['input-tips']}>
                                    {__('您导出的日志将会加密打包,请输入密码：')}
                                </div>
                                <Panel>
                                    <Panel.Main>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    {__('密码：')}
                                                </Form.Label>
                                                <Form.Field>
                                                    <ValidateBox
                                                        placeholder={__('请输入密码')}
                                                        type={'password'}
                                                        value={this.state.password}
                                                        onChange={(value) => { this.onPasswordInputFirstChange(value) }}
                                                        validateState={this.state.validateState}
                                                        validateMessages={{ [ValidateState.Diff]: __('密码必须同时包含 大小写英文字母 与 数字，允许包含 ~!%#$@-_. 字符，长度范围 10~100 个字符，请重新输入') }}
                                                    />
                                                </Form.Field>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label>
                                                    {__('确认密码：')}
                                                </Form.Label>
                                                <Form.Field>
                                                    <TextBox
                                                        value={this.state.passwordAgain}
                                                        onChange={(value) => { this.onpasswordAgainChange(value) }}
                                                        placeholder={__('请再次输入密码')}
                                                        type={'password'}
                                                    />
                                                </Form.Field>
                                            </Form.Row>
                                            {
                                                !this.state.isSamePassword ?
                                                    <Form.Row>
                                                        <Form.Label>
                                                        </Form.Label>
                                                        <Form.Field>
                                                            <div className={styles['warn-font']}>
                                                                {__('两次输入的密码不一致，请重新输入')}
                                                            </div>
                                                        </Form.Field>
                                                    </Form.Row>
                                                    : null
                                            }
                                        </Form>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button disabled={!(this.state.password && this.state.passwordAgain)} onClick={this.submitExport.bind(this)}>{__('确定')}</Panel.Button>
                                        <Panel.Button onClick={this.cancelExport.bind(this)}>{__('取消')}</Panel.Button>
                                    </Panel.Footer>
                                </Panel>
                            </ Dialog>
                        </div>
                        : null
                }
                {
                    this.state.exportStatus === ExportStatus.LOADING ?
                        <ProgressCircle detail={__('正在打包，请稍候…')} />
                        : null
                }
            </div>
        )
    }
}