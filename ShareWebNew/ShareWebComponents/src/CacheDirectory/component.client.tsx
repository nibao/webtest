import * as React from 'react';
import { NWWindow, ConfirmDialog } from '../../ui/ui.client';
import { ClientComponentContext } from '../helper'
import CacheDirectoryBase from './component.base';
import __ from './locale';

export default class CacheDirectory extends CacheDirectoryBase {
    render() {
        const { onOpenCacheDirectoryDialog, onCloseCacheDirectoryDialog, fields, id } = this.props
        return (
            <NWWindow
                id={id}
                title={__('下载')}
                onOpen={onOpenCacheDirectoryDialog}
                onClose={onCloseCacheDirectoryDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <ConfirmDialog
                        onConfirm={this.confirmCacheDirectory.bind(this)}
                        onCancel={this.cancelCacheDirectory.bind(this)}
                    >
                        {__('您确定要下载当前文件夹"${name}"下的所有子文件吗？', { name: this.props.directory.name })}
                    </ConfirmDialog>
                </ClientComponentContext.Consumer>
            </ NWWindow>
        )
    }
}