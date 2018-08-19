import * as React from 'react';
import { noop } from 'lodash';
import { rename as renameDir } from '../../core/apis/efshttp/dir/dir';
import { rename as renameFile } from '../../core/apis/efshttp/file/file';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { docname } from '../../core/docs/docs';
import WebComponent from '../webcomponent';
import * as fs from '../../core/filesystem/filesystem'

let timeout;
let defaultTimeout = 2000;

export default class RenameDialogBase extends WebComponent<Components.RenameDialog.Props, Components.RenameDialog.State> {

    static defaultProps = {
        doc: null,
        onRenameSuccess: noop,
        onRenameFailed: noop,
        onCancelRename: noop,

    }

    state = {
        doc: this.props.doc,
        renameTip: 'right',
        enableRename: false,
        renameValue: docname(this.props.doc),
        selectFoucs: docname(this.props.doc).lastIndexOf('.') === -1 ? [0, docname(this.props.doc).length] : [0, docname(this.props.doc).lastIndexOf('.')]
    }

    /**
     * 确认重命名
     */
    protected async handleConfiromRename() {
        let { renameValue, doc, enableRename } = this.state;

        if (renameValue.replace(/(^\s*)|(\s*$)/g, '') === '' || renameValue === '') {
            this.setState({
                renameTip: 'empty',
                enableRename: false,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        renameTip: 'right'
                    })
                }, defaultTimeout);
            });

            if (!enableRename) {
                return;
            }

        } else {
            try {
                doc['size'] === -1 ?
                    await renameDir({ docid: doc['docid'], name: renameValue, ondup: 1 }) :
                    await renameFile({ docid: doc['docid'], name: renameValue, ondup: 1 })
                fs.update(doc, { name: renameValue })
                this.props.onRenameSuccess(renameValue);
            } catch (error) {
                let renameTip = ''
                switch (error.errcode) {
                    case ErrorCode.FullnameDuplicated:
                        renameTip = 'duplicate';
                        break;
                    case ErrorCode.GNSInaccessible:
                        renameTip = 'invalid';
                        break;
                    case ErrorCode.PermissionRestricted:
                        renameTip = 'permit';
                        break;
                    default:
                        renameTip = 'right';
                        break;
                }
                this.setState({
                    renameTip,
                    enableRename: false
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            renameTip: 'right',
                            enableRename: true
                        })
                    }, defaultTimeout);
                });
                this.props.onRenameFailed();
            }
        }

    }

    /**
     * 取消重命名
     */
    protected handleCancelRename() {
        this.props.onCancelRename();
    }

    /**
     * 监听输入框变化
     */
    protected handleChangeInput(value) {
        this.setState({
            selectFoucs: false
        });
        this.setState({
            renameValue: value,
            renameTip: value.search(/\/|\:|\?|\*|\"|\<|\>|\|/g) === -1 ? 'right' : 'illegal',
            enableRename: value.search(/\/|\:|\?|\*|\"|\<|\>|\|/g) === -1
        }, () => {
            if (this.state.renameTip !== 'right') {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.setState({
                        renameTip: 'right'
                    })
                }, defaultTimeout);
            }
        });
    }
}