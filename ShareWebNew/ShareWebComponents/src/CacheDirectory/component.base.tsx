/// <reference path="./index.d.ts" />

import * as React from 'react';
import { isFunction } from 'lodash';
import { requestDownloadDir, } from '../../core/apis/client/sync/sync';

export default class CacheDirectoryBase extends React.Component<Components.CacheDirectory.Props, any>{

    /**
     * 执行缓存
     */
    protected confirmCacheDirectory() {
        requestDownloadDir({ relPath: this.props.directory.relPath })
        isFunction(this.props.onConfirmCacheDirectory) && this.props.onConfirmCacheDirectory(this.props.directory);
    }


    /**
     * 取消缓存
     */
    protected cancelCacheDirectory() {
        isFunction(this.props.onCancelCacheDirectory) && this.props.onCancelCacheDirectory();
    }
} 