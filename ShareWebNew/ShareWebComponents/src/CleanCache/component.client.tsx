import * as React from 'react';
import { NWWindow, ConfirmDialog } from '../../ui/ui.client';
import { ClientComponentContext } from '../helper'
import CleanCacheBase from './component.base';
import __ from './locale';

export default class CleanCache extends CleanCacheBase {

    render() {
        const { onOpenCleanCacheDialog, onCloseCleanCacheDialog, fields, id } = this.props
        return (
            <NWWindow
                id={id}
                title={__('清除缓存')}
                onOpen={onOpenCleanCacheDialog}
                onClose={onCloseCleanCacheDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <ConfirmDialog
                        onConfirm={this.confirmClean.bind(this)}
                        onCancel={this.cancelClean.bind(this)}
                    >
                        <p>{__('您确定要清除选中文档的缓存吗？')}</p>
                        <p>{__('如果清除，下次打开这些文件需要重新下载。')}</p>
                    </ConfirmDialog>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }
}