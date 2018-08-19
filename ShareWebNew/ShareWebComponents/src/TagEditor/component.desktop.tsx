import * as React from 'react';
import { docname } from '../../core/docs/docs'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getErrorMessage, ReqStatus } from '../../core/tag/tag'
import { MessageDialog, Overlay } from '../../ui/ui.desktop'
import Config from './Config/component.desktop'
import TagEditorBase from './component.base'
import __ from './locale';

export default class TagEditor extends TagEditorBase {
    render() {
        const { results, value, tags, errCode, duplicateTag, reqStatus } = this.state;

        return (
            <div>
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
                            onCloseDialog={this.props.onCloseDialog}
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
                                reqStatus === ErrorCode.GNSInaccessible ?
                                    __('文件“${name}”不存在, 可能其所在路径发生变更。', { name: docname(this.doc) })
                                    :
                                    getErrorMessage(reqStatus)
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
        )

    }
}