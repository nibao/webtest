import * as React from 'react';
import { docname } from '../../core/docs/docs'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getErrorMessage, ReqStatus } from '../../core/tag/tag'
import { Icon, Overlay } from '../../ui/ui.desktop'
import { MessageDialog, NWWindow } from '../../ui/ui.client'
import { ClientComponentContext } from '../helper'
import Mounting from '../Mounting/component.client'
import Config from './Config/component.client'
import TagEditorBase from './component.base'
import __ from './locale';

export default class TagEditor extends TagEditorBase {
    render() {
        const { onOpenEditTagDialog, onCloseDialog, fields, id } = this.props
        const { results, value, tags, errCode, duplicateTag, reqStatus } = this.state;

        return (
            <NWWindow
                id={id}
                title={__('编辑标签')}
                onOpen={onOpenEditTagDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            reqStatus === ReqStatus.Pending ?
                                <Mounting />
                                : null
                        }
                        {
                            reqStatus === ReqStatus.OK ?
                                <Config
                                    doc={this.doc}
                                    maxTags={this.maxTags}
                                    results={results}
                                    value={value}
                                    tags={tags}
                                    errCode={errCode}
                                    loader={this.loader.bind(this)}
                                    onLoad={this.handleLoad.bind(this)}
                                    onUpdateValue={this.updateValue.bind(this)}
                                    onEnter={this.addTag.bind(this)}
                                    onSelect={this.handleClick.bind(this)}
                                    onAddTag={this.addTag.bind(this)}
                                    onRemoveTag={this.removeTag.bind(this)}
                                />
                                : null
                        }
                        {
                            (reqStatus !== ReqStatus.OK && reqStatus !== ReqStatus.Pending) ?
                                <MessageDialog
                                    onConfirm={this.props.onCloseDialog}
                                >
                                    {
                                        reqStatus ? (
                                            reqStatus === ErrorCode.GNSInaccessible ?
                                                __('文件“${name}”不存在, 可能其所在路径发生变更。', { name: docname(this.doc) })
                                                :
                                                getErrorMessage(reqStatus)
                                        )
                                            :
                                            __('网络连接失败')
                                    }
                                </MessageDialog>
                                : null
                        }
                        {
                            duplicateTag ?
                                <Overlay position="top center">{__('标签已存在')}</Overlay>
                                :
                                null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }
}