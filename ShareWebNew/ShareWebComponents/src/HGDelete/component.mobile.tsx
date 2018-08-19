import * as React from 'react';
import { docname, isDir } from '../../core/docs/docs';
import { getErrorMessage } from '../../core/errcode/errcode';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { ProgressCircle, MessageDialog, DrawerMenu } from '../../ui/ui.mobile';
import HGDeleteBase from './component.base';
import * as commonStyles from '../styles.mobile';
import * as styles from './styles.mobile.css';
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

function formatterDetailMessage(docs: Core.Docs.Docs): string {

    let warningContent: string = '';

    if (docs.length === 1) {

        warningContent = isDir(docs[0]) ? __('确定要删除文件夹"${name}"吗？', { name: docname(docs[0]) }) : __('确定要删除文件"${name}"吗？', { name: docname(docs[0]) })
    } else {

        warningContent = __('确定要删除选中的文件吗？')
    }

    return warningContent
}

export default class HGDelete extends HGDeleteBase {
    render() {
        const { docs } = this.props
        const { showConfirm, processingDelete, errorCode, failedDoc } = this.state;

        return (
            <div>

                <DrawerMenu
                    open={showConfirm}
                    mask={true}
                    position={'bottom'}
                >
                    <DrawerMenu.Item>
                        <div
                            className={styles['delete-tips']}
                        >
                            {formatterDetailMessage(docs)}
                        </div>
                        <DrawerMenu.Button
                            type="confirm"
                            onClick={() => { this.deleteFiles(docs) }}
                        >
                            {__('确认删除')}
                        </DrawerMenu.Button>
                    </DrawerMenu.Item>
                    <DrawerMenu.Item>
                        <DrawerMenu.Button
                            onClick={() => { this.cancelDelete() }}
                        >
                            {__('取消')}
                        </DrawerMenu.Button>
                    </DrawerMenu.Item>
                </DrawerMenu>

                {
                    processingDelete
                        ?
                        <ProgressCircle
                            detail={__('加载中')}
                        />
                        : null
                }

                {
                    errorCode
                        ?
                        <MessageDialog
                            onConfirm={() => { this.resolve(); this.setState({ errorCode: undefined }) }}
                        >
                            <div className={commonStyles.warningHeader}>
                                {__('无法执行删除操作')}
                            </div>
                            <div className={commonStyles.warningContent}>
                                {
                                    formatterErrorMessage(errorCode, failedDoc)
                                }
                            </div>
                        </MessageDialog>
                        : null
                }

            </div >
        )
    }
}
