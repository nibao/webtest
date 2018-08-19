import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import SecondAuthBase from './component.base';
import TextBox from '../../ui/TextBox/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import __ from './locale';

export default class SecondAuth extends SecondAuthBase {

    render() {
        return (
            <div>
                <Dialog
                    title={__('输入验证码')}
                    onClose={() => { this.props.onCancel() }}
                >
                    <Panel>
                        <Panel.Main>
                            <div>
                                <label htmlFor="secondauthKey">{__('请输入令牌验证码：')}</label>
                                <TextBox type="password" id="secondauthKey" value={this.state.secondauthKey} onChange={(key) => { this.getAuthKey(key) }} />
                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button onClick={() => {this.saveSeacondAuth()}}>
                                {__('确定')}
                            </Panel.Button>
                            <Panel.Button onClick={() => {this.props.onCancel()}}>
                                {__('取消')}
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>

                {
                    this.state.authError ?
                        <MessageDialog onConfirm={() => { this.closeErrorDialog() }}>
                            <div>
                                <label>{ __('令牌验证码错误！')}</label>
                            </div>
                        </MessageDialog> :
                        null
                }
            </div>
        )
    }

}