import * as React from 'react';
import * as classnames from 'classnames';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import MSGConfigBase, { Provider, ValidateState, TestErrorType } from './component.base';
import { getErrorMessage } from '../../core/exception/exception';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class MSGConfig extends MSGConfigBase {
    render() {
        const { statusCode: { test, save }, provider, isFormChanged, testing, } = this.state
        const { appSDK: appSDKVal, appKEY: appKEYVal, modelID: modelIDVal } = this.state.configInfo
        const { appSDK: appSDKState, appKEY: appKEYState, modelID: modelIDState } = this.state.validateState
        const validateMessages = { [ValidateState.Empty]: __('此输入项不允许为空。') }

        return (
            this.state.configInfo ?
                <div className={styles['container']}>
                    <ToolBar>
                        <span className={styles['tool-bar']}>
                            <UIIcon className={styles['toolbar-icon']} size="18" code={'\uf016'} />
                            {__('短信服务器配置')}
                        </span>
                    </ToolBar>
                    <Panel>
                        <Panel.Main>
                            <Form>
                                <Form.Row>
                                    <Form.Label>
                                        <div className={styles['form-font']}>{__('短信服务商：')}</div>
                                    </Form.Label>
                                    <Form.Field>
                                        <Select
                                            value={provider}
                                            onChange={this.selectChangeHandler.bind(this)}
                                        >
                                            <Select.Option
                                                value={Provider.Default}
                                                selected={provider === Provider.Default}
                                            >
                                                {__('请选择第三方短信服务商')}
                                            </Select.Option>
                                            <Select.Option
                                                value={Provider.Tecent}
                                                selected={provider === Provider.Tecent}
                                            >
                                                {__('腾讯云')}
                                            </Select.Option>
                                        </Select>
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        <div className={styles['form-font']}>{__('SDK AppID：')}</div>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            value={appSDKVal}
                                            disabled={provider === Provider.Default}
                                            onChange={this.changeHandler.bind(this, 'appSDK')}
                                            validateMessages={validateMessages}
                                            validateState={appSDKState}
                                        />
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Label>
                                        <div className={styles['form-font']}>{__('App Key：')}</div>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            type="password"
                                            value={appKEYVal}
                                            disabled={provider === Provider.Default}
                                            onChange={this.changeHandler.bind(this, 'appKEY')}
                                            validateMessages={validateMessages}
                                            validateState={appKEYState}
                                        />
                                    </Form.Field>
                                </Form.Row>
                                <Form.Row>

                                    <Form.Label>
                                        <div className={styles['form-font']}>{__('短信正文模板ID：')}</div>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            value={modelIDVal}
                                            disabled={provider === Provider.Default}
                                            onChange={this.changeHandler.bind(this, 'modelID')}
                                            validateMessages={validateMessages}
                                            validateState={modelIDState}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Button
                                            className={styles['btn-test']}
                                            disabled={provider === Provider.Default}
                                            onClick={this.testHandler.bind(this)}
                                        >
                                            {__('测试')}
                                        </Button>
                                        {
                                            testing
                                                ? <span className={classnames(styles['test'], {
                                                    [styles['test-success']]: (test === 0),
                                                    [styles['test-failed']]: (test !== 0)
                                                })}>
                                                    {
                                                        !test && !appSDKState && !appKEYState && !modelIDState ?
                                                            __('测试成功。') :
                                                            this.renderSetConfigError(test)
                                                    }
                                                </span>
                                                : null
                                        }
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                        </Panel.Main>
                        {
                            isFormChanged
                                ? (provider !== Provider.Default) ?
                                    <div className={styles['footer']}>
                                        <Panel.Button onClick={this.saveHandler.bind(this)}>{__('保存')}</Panel.Button>
                                        <Panel.Button onClick={this.cancalHandler.bind(this)}>{__('取消')}</Panel.Button>
                                    </div> :
                                    null
                                : null
                        }
                    </Panel>
                    {
                        save
                            ? <MessageDialog onConfirm={this.confirmConfigErrorHandler.bind(this)}>
                                {
                                    getErrorMessage(save)
                                }
                            </MessageDialog >
                            : null
                    }
                </div>
                : null
        )
    }

    renderSetConfigError(test) {
        switch (test) {
            case TestErrorType.InvalidConfig:
                return __('短信服务器配置不合法。')
            case TestErrorType.NotSupportServer:
                return __('不支持的短信服务器类型。')
            case TestErrorType.ConnectServerError:
                return __('连接短信服务器失败。')
        }
    }

}