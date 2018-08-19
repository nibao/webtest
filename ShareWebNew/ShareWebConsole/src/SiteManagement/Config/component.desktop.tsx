import * as React from 'react';
import { includes } from 'lodash'
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import { getErrorMessage } from '../../../core/exception/exception';
import ConfigBase from './component.base';
import { ValidateMessage } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css'

export default class Config extends ConfigBase {

    render() {
        let { site, errorID, loading } = this.state;
        return (
            this.state.errorID === 10010 ?
                <ConfirmDialog
                    onConfirm={this.onErrorConfirm.bind(this, errorID)}
                    onCancel={this.onErrorCancel.bind(this, errorID)}
                >
                    {getErrorMessage(errorID)}
                </ConfirmDialog>
                :
                <div className={styles['container']} >
                    <Dialog
                        title={!this.props.site ? __('添加分站点') : __('编辑站点')}
                        onClose={this.props.onSiteConfigCancel}
                    >
                        <Panel>
                            <Panel.Main>
                                <div className={styles['container']}>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label align="middle">
                                                {__('站点名称：')}
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['form-data']}>
                                                    <ValidateBox
                                                        align="right"
                                                        autoFocus={true}
                                                        validateState={this.state.defaultNameValidateState}
                                                        validateMessages={{ [ValidateMessage.EMPTY_VALIDATE]: __('此输入项不允许为空'), [ValidateMessage.INVALID_NAME]: __('站点名不能包含 \ / : * ? " < > | 特殊字符，请重新输入。') }}
                                                        value={site.name}
                                                        onFocus={this.handleFocusName.bind(this)}
                                                        onChange={(value) => this.setState({ site: { ...site, name: value }, errorID: null })}
                                                    />
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label align="middle">
                                                <label>{__('访问地址：')}</label>
                                            </Form.Label>
                                            <Form.Field>
                                                {
                                                    this.props.site === null ?
                                                        <div className={styles['form-data']}>
                                                            <ValidateBox
                                                                align="right"
                                                                validateState={this.state.defaultIpValidateState}
                                                                validateMessages={{ [ValidateMessage.EMPTY_VALIDATE]: __('此输入项不允许为空'), [ValidateMessage.INVALID_DOMAIN]: __('域名只能包含 英文、数字 及 -. 字符，长度范围 3~100 个字符，请重新输入。'), [ValidateMessage.INVALID_IP]: __('IP地址只能包含数字及.字符，格式形如：XXX.XXX.XXX.XXX，每段必须是0~255之间的整数，请重新输入。') }}
                                                                value={site.ip}
                                                                onFocus={this.handleFocusIp.bind(this)}
                                                                onChange={(value) => this.setState({ site: { ...site, ip: value }, errorID: null })}
                                                            />
                                                        </div>
                                                        :
                                                        <Text>
                                                            {site.ip}
                                                        </Text>
                                                }

                                            </Form.Field>
                                        </Form.Row>
                                        {
                                            this.props.site === null ?
                                                <Form.Row>
                                                    <Form.Label align="middle">
                                                        <label>{__('站点密钥：')}</label>
                                                    </Form.Label>
                                                    <Form.Field>
                                                        <div className={styles['form-data']}>
                                                            <ValidateBox
                                                                align="right"
                                                                validateState={this.state.defaultKeyValidateState}
                                                                validateMessages={{ [ValidateMessage.EMPTY_VALIDATE]: __('此输入项不允许为空') }}
                                                                value={site.siteKey}
                                                                onFocus={this.handleFocusKey.bind(this)}
                                                                onChange={(value) => this.setState({ site: { ...site, siteKey: value }, errorID: null })}
                                                            />
                                                        </div>
                                                    </Form.Field>

                                                </Form.Row>
                                                :
                                                null
                                        }
                                    </Form>
                                    {
                                        loading ?
                                            <div className={styles['loading']}>
                                                {__('正在连接站点，请稍候...')}
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        errorID && !includes([10014, 10020, 10009, 10002, 10005], errorID) ?
                                            <div className={styles['red']}>
                                                {this.getErrorMessage(errorID)}
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Panel.Main >
                            <Panel.Footer>
                                <Panel.Button type="submit" onClick={this.submit.bind(this, site)} disabled={loading}>{__('确定')}</Panel.Button>
                                <Panel.Button onClick={() => this.props.onSiteConfigCancel()} >{__('取消')}</Panel.Button>
                            </Panel.Footer>
                        </Panel>
                    </Dialog >
                    {
                        includes([10014, 10020, 10009, 10002, 10005], errorID) ?
                            <ConfirmDialog
                                onConfirm={this.onErrorConfirm.bind(this, errorID)}
                                onCancel={this.onErrorCancel.bind(this, errorID)}
                            >
                                {getErrorMessage(errorID)}
                            </ConfirmDialog>
                            :
                            null
                    }
                </div >
        )
    }

    getErrorMessage(errorID) {
        if (includes([10001, 10003, 10007, 10019], errorID)) {
            return getErrorMessage(errorID)
        } else {
            return __('不能添加本站点。')
        }
    }
}