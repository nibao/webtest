import * as React from 'react';
import { Dialog2 as Dialog, Panel, Overlay } from '../../ui/ui.desktop'
import { ReqStatus, getErrorMessage } from '../../core/tag/tag'
import TagAdderConfig from '../TagAdder.Config/component.desktop';
import ExceptionStrategy from '../ExceptionStrategy/component.desktop'
import TagAdderBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class TagAdder extends TagAdderBase {
    render() {
        const { warningCode, tags, reqStatus, showSuccessMessage, exception, strategies, processingDoc } = this.state;

        return (
            <div>
                {
                    reqStatus === ReqStatus.Pending ?
                        this.renderTagAdder({ warningCode, tags })
                        : null
                }
                {
                    showSuccessMessage ?
                        <Overlay position="top center">{__('添加标签成功。')}</Overlay>
                        : null
                }
                {
                    exception ?
                        <ExceptionStrategy
                            exception={exception}
                            doc={processingDoc}
                            handlers={this.handlers}
                            strategies={strategies}
                            onConfirm={this.updateStrategies.bind(this)}
                            />
                        : null
                }
            </div>
        )
    }

    renderTagAdder({warningCode, tags}) {
        return (
            <Dialog
                title={__('添加标签')}
                width={436}
                onClose={this.props.onCloseDialog}
                >
                <Panel>
                    <Panel.Main>
                        <div>{__('你可以对选中的这些文件，批量添加标签。')}</div>
                        <div className={styles['message']}>{__('(多个标签使用“Enter”键分隔)')}</div>
                        <TagAdderConfig
                            ref="tagconfig"
                            maxTags={this.maxTags}
                            onWarning={this.handleWarning.bind(this)}
                            onUpdateTags={this.updateTags.bind(this)}
                            />
                        <div className={styles['warning']}>
                            {
                                warningCode ?
                                    getErrorMessage(warningCode, this.maxTags)
                                    : ''
                            }
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            type="submit"
                            disabled={(tags && tags.length) ? false : true}
                            onClick={() => this.addTags()}
                            >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button onClick={this.props.onCloseDialog}>
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }
}