import * as React from 'react'
import * as classnames from 'classnames';
import { trim } from 'lodash'
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop'
import Panel from '../../ui/Panel/ui.desktop'
import ExceptionStrategy from '../ExceptionStrategy/component.desktop'
import CreateFolderBase from './component.base'
import * as commonStyles from '../styles.desktop.css'
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class CreateFolder extends CreateFolderBase {
    render() {
        const { showCreateFolder, value, invalidMsg, exception, processingDoc } = this.state;
        return (
            <div>
                {
                    showCreateFolder
                        ? <Dialog
                            title={ __('新建文件夹') }
                            onClose={ () => this.props.onCancel() }
                          >
                            <Panel>
                                <Panel.Main>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                <label>{ __('文件夹名称：') }</label>
                                            </Form.Label>
                                            <Form.Field>
                                                <TextBox
                                                    value={ value }
                                                    autoFocus={ true }
                                                    onChange={ (value) => this.updateValue(value) } />
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                    <div className={ classnames(commonStyles.warningContent, styles['warning']) }>{ invalidMsg }</div>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button type="submit" disabled={ !trim(value) || invalidMsg } onClick={ () => this.confirm() }>{ __('确定') }</Panel.Button>
                                    <Panel.Button onClick={ () => this.props.onCancel() }>{ __('取消') }</Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }
                {
                    exception ? (
                        <ExceptionStrategy
                            exception={ exception }
                            doc={ processingDoc }
                            strategies={ this.strategies }
                            handlers={ this.handlers }
                            onConfirm={ this.handleConfirmError.bind(this) }
                        />
                    ) : null
                }
            </div>
        )
    }
}