import * as React from 'react';
import * as classnames from 'classnames';
import { trim } from 'lodash';
import { ReqStatus, getErrorMessage } from '../../core/tag/tag'
import { Panel, Text, Button, Form, Icon, AutoComplete, AutoCompleteList, Chip } from '../../ui/ui.desktop'
import { Dialog2 as Dialog, SuccessDialog, NWWindow } from '../../ui/ui.client'
import ExceptionStrategy from '../ExceptionStrategy/component.client'
import { ClientComponentContext } from '../helper'
import Mounting from '../Mounting/component.client'
import TagAdderBase from './component.base'
import __ from './locale';
import * as styles from './styles.client.css';

export default class TagAdder extends TagAdderBase {

    render() {
        const { onOpenAddTagDialog, onCloseDialog, fields, id } = this.props
        const { results, value, tags, warningCode, showBorder, showSuccessMessageClient, exception, processingDoc, strategies, reqStatus } = this.state;

        return (
            <NWWindow
                id={id}
                title={__('添加标签')}
                onOpen={onOpenAddTagDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            reqStatus === ReqStatus.Pending ?
                                this.renderTagAdder({ results, warningCode, showBorder, tags, value })
                                : null
                        }
                        {
                            showSuccessMessageClient ?
                                <SuccessDialog
                                    onConfirm={this.props.onCloseDialog}
                                >
                                    {__('添加标签成功。')}
                                </SuccessDialog>
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
                        {
                            (reqStatus !== ReqStatus.Pending && !showSuccessMessageClient && !exception) ?
                                <Mounting />
                                : null
                        }
                    </div>
                </ClientComponentContext.Consumer>

            </NWWindow>
        )
    }

    renderTagAdder({ results, warningCode, showBorder, tags, value }) {
        return (
            <Dialog
                width={436}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['title']}>{__('点击“确定”后，您可以对选中的这些文件，批量添加标签。')}</div>
                        <div className={styles['edit-tag-dialog']}>
                            <Form>
                                <Form.Row>
                                    <Form.Label>
                                        {__('标签：')}
                                    </Form.Label>
                                    <Form.Field>
                                        <AutoComplete
                                            ref="autocomplete"
                                            icon={null}
                                            width={212}
                                            value={value}
                                            autoFocus={true}
                                            missingMessage={__('未找到匹配的结果')}
                                            loader={this.loader.bind(this)}
                                            onLoad={this.handleLoad.bind(this)}
                                            onChange={this.updateValue.bind(this)}
                                            validator={(value) => this.validator(value)}
                                            onEnter={(e, selectIndex) => this.addOneTagChip(e, selectIndex, 'client')}
                                        >
                                            {
                                                (results && results.length) ? (
                                                    <AutoCompleteList>
                                                        {
                                                            results.map((data) => (
                                                                <AutoCompleteList.Item key={data}>
                                                                    <div onClick={this.handleClick.bind(this, data)}>
                                                                        <Text className={styles['item']}>
                                                                            {data}
                                                                        </Text>
                                                                    </div>
                                                                </AutoCompleteList.Item>
                                                            ))
                                                        }
                                                    </AutoCompleteList>
                                                ) : null
                                            }
                                        </AutoComplete>
                                        <Button
                                            className={styles['btn']}
                                            disabled={!trim(value)}
                                            onClick={this.addOneTagChip.bind(this)}
                                        >
                                            {__('添加')}
                                        </Button>
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                            <div className={styles['warning']}>
                                {
                                    warningCode ?
                                        getErrorMessage(warningCode, this.maxTags)
                                        : ''
                                }
                            </div>
                            <div
                                className={classnames(styles['tags'], showBorder ? styles['border'] : null)}
                                ref="tags"
                            >
                                {
                                    (tags && tags.length)
                                        ? tags.map((tag) => (
                                            <div className={styles['chip']}>
                                                <Chip removeHandler={() => this.removeTag(tag)}>
                                                    {tag}
                                                </Chip>
                                            </div>
                                        ))
                                        : null
                                }
                            </div>
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
            </Dialog>
        )
    }
}