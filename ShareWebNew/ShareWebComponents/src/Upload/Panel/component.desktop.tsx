import * as React from 'react'
import * as classnames from 'classnames'
import PanelBase, { Status } from './component.base'
import DataList from '../../../ui/DataList/ui.desktop'
import DialogHeader from '../../../ui/Dialog.Header/ui.desktop'
import DialogFooter from '../../../ui/Dialog.Footer/ui.desktop'
import DialogButton from '../../../ui/Dialog.Button/ui.desktop'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop'
import Thumbnail from '../../Thumbnail/component.desktop'
import { docname } from '../../../core/docs/docs'
import { formatSize } from '../../../util/formatters/formatters'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Title from '../../../ui/Title/ui.desktop'
import IconGroup from '../../../ui/IconGroup/ui.desktop'
import FlexBox from '../../../ui/FlexBox/ui.desktop'
import { FileStatus } from '../../../core/upload/upload'
import Icon from '../../../ui/Icon/ui.desktop'
import __ from './locale'
import * as styles from './styles.desktop.css'
import * as commonStyles from '../../styles.desktop.css'
import * as loadingImg from './assets/images/loading.gif'

const FileStatusText = {
    [FileStatus.Inited]: __('等待中...'),
    [FileStatus.Queued]: __('等待中...'),
    [FileStatus.Completed]: <UIIcon code={'\uf063'} color="#81c884" />,
    [FileStatus.Error]: __('上传失败')
}

export default class Panel extends PanelBase {

    /**
     * 上传弹窗 title
     */
    getPanelTitle() {
        const { status, uploadCount, errorCount, speed } = this.state
        switch (status) {
            case Status.Inited:
                return __('上传')
            case Status.Preparing:
                return __('正在准备上传队列')
            case Status.Progress:
                return __('正在上传 ${uploadCount} 个文件 ${speed}', { uploadCount, speed: `${formatSize(speed)}/s` })
            case Status.Finished:
                return errorCount ? __('上传完成（${errorCount} 个文件上传失败）', { errorCount }) : __('上传完成')
        }
    }

    /**
     * 文件操作栏
     * @param file 
     */
    getFileOperations(file) {
        const { fileStatus } = this.state
        switch (fileStatus[file.id]) {
            case FileStatus.Completed:
                return null
            case FileStatus.Error:
                return (
                    <IconGroup.Item
                        code={'\uf05b'}
                        size={16}
                        title={__('')}
                        onClick={() => this.retry(file)}
                    />
                )
            default:
                return (
                    <IconGroup.Item
                        code={'\uf046'}
                        size={16}
                        title={__('取消')}
                        onClick={() => this.cancel(file)}
                    />
                )
        }
    }


    render() {
        const {
            files,
            percentage,
            minimized,
            open,
            deferredClose,
            fileStatus,
            status,
            uploadCount
        } = this.state
        if (open) {
            return (
                <div
                    className={classnames(styles['container'], { [styles['minimized']]: minimized })}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <DialogHeader
                        closable
                        onClose={this.handleClose}
                        HeaderButtons={[
                            <UIIcon
                                color="#bdbdbd"
                                onClick={this.toggleMinimize}
                                code={minimized ? '\uf072' : '\uf071'} />
                        ]}
                    >
                        {this.getPanelTitle()}
                    </DialogHeader>
                    <div className={styles['list']}>
                        <DataList multiple={false}>
                            {
                                files.map(file => {
                                    if (fileStatus[file.id] === FileStatus.Cancelled) {
                                        return null
                                    }
                                    return (
                                        <DataList.Item data={file} checkbox={false} className={styles['item']} id={file.id}>
                                            <div
                                                className={styles['percentage']}
                                                style={{ width: fileStatus[file.id] === FileStatus.Progress ? `${percentage * 100}%` : 0 }}
                                            ></div>
                                            <div className={styles['wrapper']}>
                                                <Thumbnail className={styles['thumbnail']} doc={file} size={32} />
                                                <div className={styles['name']}>
                                                    <Title content={docname(file)}>
                                                        {docname(file)}
                                                    </Title>
                                                </div>
                                                <div className={styles['size']}>
                                                    {formatSize(file.size)}
                                                </div>
                                                <div className={styles['status']}>
                                                    {
                                                        fileStatus[file.id] === FileStatus.Progress ?
                                                            `${Math.round(percentage * 100)}%` :
                                                            FileStatusText[fileStatus[file.id]]
                                                    }
                                                </div>
                                                <div className={styles['operations']}>
                                                    <IconGroup>
                                                        {this.getFileOperations(file)}
                                                    </IconGroup>
                                                </div>
                                            </div>
                                        </DataList.Item>
                                    )
                                })
                            }
                        </DataList>
                    </div>
                    <DialogFooter>
                        {/* <DialogButton onClick={this.clearCompleted} disabled={!completedCount}>
                            {__('清空已完成')}
                        </DialogButton> */}
                        <DialogButton onClick={this.cancelAll} disabled={!uploadCount}>
                            {__('全部取消')}
                        </DialogButton>
                    </DialogFooter>
                    {
                        status === Status.Preparing ?
                            <div className={styles['preparing']}>
                                <FlexBox>
                                    <FlexBox.Item align={'center middle'}>
                                        <Icon url={loadingImg} size={48} />
                                        <p className={styles['text']}>{__('正在准备上传队列')}</p>
                                    </FlexBox.Item>
                                </FlexBox>
                            </div> :
                            null
                    }
                    {
                        deferredClose ?
                            <ConfirmDialog onConfirm={deferredClose.confirm} onCancel={deferredClose.cancel}>
                                <div className={commonStyles['warningHeader']}>{__('列表中有未上传完成的文件')}</div>
                                <div className={commonStyles['warningContent']}>
                                    {__('刷新或关闭当前页面，将不会继续上传，确定要执行此操作？')}
                                </div>
                            </ConfirmDialog> :
                            null
                    }
                </div>
            )
        }
        return null
    }
}