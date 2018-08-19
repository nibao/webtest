/// <reference path="./index.d.ts" />

import * as React from 'react';
import { isFunction } from 'lodash';
import { isDir } from '../../core/docs/docs';
import { requestLocalCleanDir, requestLocalCleanFile } from '../../core/apis/client/sync/sync';

export default class CleanCacheBase extends React.Component<Components.CleanCache.Props, any>{

    /**
     * 执行清除缓存
     */
    protected confirmClean() {
        Promise.all(this.props.docs.map((doc) => {
            isDir(doc) ?
                requestLocalCleanDir({ relPath: doc.relPath }) :
                requestLocalCleanFile({ relPath: doc.relPath })
        }))
        isFunction(this.props.onConfirmClean) && this.props.onConfirmClean(this.props.docs);
    }


    /**
     * 取消清除缓存
     */
    protected cancelClean() {
        isFunction(this.props.onCancelClean) && this.props.onCancelClean();
    }
} 