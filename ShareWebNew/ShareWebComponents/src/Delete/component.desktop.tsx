import * as React from 'react';
import * as classnames from 'classnames';
import * as iconFile from '../../core/icons/assets/desktop/icon-doc-file.png';
import * as iconDir from '../../core/icons/assets/desktop/icon-doc-dir.png';
import { docname, isDir } from '../../core/docs/docs';
import { getErrorMessage } from '../../core/errcode/errcode';
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop';
import ProgressDialog from '../../ui/ProgressDialog/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import DirLockedWarning from './DirLockedWarning/component.desktop'
import { getIcon } from '../helper';
import DeleteBase from './component.base';
import * as commonStyles from '../styles.desktop';
import * as styles from './styles.desktop';
import __ from './locale';

function formatterErrorMessage(errorCode: number, doc: Core.Docs.Doc): string {
    switch (errorCode) {
        case ErrorCode.GNSInaccessible: {
            // 文件不存在
            return __('文件或文件夹“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(doc) })
        }
        case ErrorCode.PermissionRestricted: {
            // 没有删除权限
            return isDir(doc) ? __('您对文件夹“${docname}”没有删除权限。', { docname: docname(doc) }) : __('您对文件“${docname}”没有删除权限。', { docname: docname(doc) })
        }
        case ErrorCode.CSFLevelMismatch: {
            // 密级不够
            return isDir(doc) ? __('您对文件夹“${docname}”下某些子文件的密级权限不足。', { docname: docname(doc) }) : __('您对文件“${docname}”的密级权限不足。', { docname: docname(doc) })
        }
        case ErrorCode.DeleteOutboxDisabled: {
            // 对文件发送箱没有删除权限
            return __('您没有对发送文件箱目录的操作权限。')
        }

        case ErrorCode.FileLocked: {
            // 无法删除被锁定的文件
            return __('文件“${docname}”已被${lockername}锁定。', { docname: docname(doc), lockername: doc.lockername })
        }
        case ErrorCode.SiteOffline: {
            // 站点离线
            return __('文件“${filename}”的归属站点已经离线。', {
                filename: docname(doc)
            })
        }

        default: {
            return getErrorMessage(errorCode)
        }
    }
}

function formatterDetailMessage(docs): { icon: any, warningTitle: string, warningContent: string } {
    if (docs.length === 1) {
        // 删除单个文件或者文件夹
        return {
            icon: getIcon(docs[0]),
            warningTitle: isDir(docs[0]) ? __('确认要删除选中的目录吗？') : __('确认要删除选中的文件吗？'),
            warningContent: docname(docs[0])
        }
    }
    const dirNum = docs.filter((doc) => isDir(doc)).length;
    const fileNum = docs.length - dirNum;

    if (dirNum) {
        if (fileNum) {
            // 删除文件夹+文件
            return {
                icon: <Icon size={32} url={iconFile} />,
                warningTitle: __('确认要删除选中的对象吗？'),
                warningContent: __('共计${dirNumber}个目录，${fileNumber}个文件。', { dirNumber: dirNum, fileNumber: fileNum })
            }
        }
        // 删除多个文件夹
        return {
            icon: <Icon size={32} url={iconDir} />,
            warningTitle: __('确认要删除选中的目录吗？'),
            warningContent: __('共计${dirNumber}个目录。', { dirNumber: dirNum })
        }

    }
    // 删除多个文件
    return {
        icon: <Icon size={32} url={iconFile} />,
        warningTitle: __('确认要删除选中的文件吗？'),
        warningContent: __('共计${fileNumber}个文件。', { fileNumber: fileNum })
    }
}

export default class Delete extends DeleteBase {
    render() {
        const { deleteShow, progressDialogShow, errorCode, doc, lockedDir } = this.state;
        const { icon, warningTitle, warningContent } = formatterDetailMessage(this.props.docs)
        return (
            <div className={styles['container']}>
                {
                    deleteShow
                        ? <Dialog
                            title={__('确认删除')}
                            width={440}
                            onClose={() => this.props.onCancel()}
                        >
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['dialog']}>
                                        <div className={styles['title']}>
                                            {warningTitle}
                                        </div>
                                        <div className={styles['content']}>
                                            {icon}
                                            <div className={styles['text']}>
                                                <Text>{warningContent}</Text>
                                            </div>
                                        </div>
                                        <div className={styles['footer']}>
                                            {
                                                __('删除后将会同步删除客户端的目录和文件，你可以通过“回收站”进行还原。')
                                            }
                                        </div>
                                    </div>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button type="submit" onClick={() => this.deleteFiles()}>{__('确定')}</Panel.Button>
                                    <Panel.Button onClick={() => this.props.onCancel()}>{__('取消')}</Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }
                {
                    progressDialogShow
                        ? <ProgressDialog
                            title={__('正在删除')}
                            detailTemplate={(item) => (isDir(item) ? __('正在删除目录：') : __('正在删除文件：')) + docname(item)}
                            data={this.props.docs}
                            loader={this.loader.bind(this)}
                            onSuccess={() => this.props.onSuccess()}
                            onError={this.handleError.bind(this)}
                            onSingleSuccess={(doc) => this.deleteOneFileOrDir(doc)}
                        />
                        : null
                }
                {
                    errorCode
                        ? <MessageDialog onConfirm={() => this.props.onSuccess()}>
                            <div className={commonStyles.warningHeader}>{__('无法执行删除操作')}</div>
                            <div className={classnames(commonStyles.warningContent, styles['warning'])}>
                                {
                                    formatterErrorMessage(errorCode, doc)
                                }
                            </div>
                        </MessageDialog>
                        : null
                }
                {
                    lockedDir ?
                        <DirLockedWarning
                            doc={lockedDir}
                            docs={this.props.docs}
                            onCancel={this.cancelDeleteLockedDir.bind(this)}
                            onConfirm={this.continueDeleteLockedDir.bind(this)}
                            onChange={(checked) => this.skipLockedDirConflictChecked = checked}
                        />
                        : null
                }
            </div>
        )
    }

}

