import * as React from 'react'
import PanelBase, { Status } from './component.base'
import Dialog from '../../../ui/Dialog/ui.mobile'
import UIIcon from '../../../ui/UIIcon/ui.mobile'
import Thumbnail from '../../Thumbnail/component.mobile'
import { FileStatus, reset } from '../../../core/upload/upload'
import __ from './locale'
import { formatSize } from '../../../util/formatters/formatters'
import * as styles from './styles.mobile.css'

export default class Panel extends PanelBase {

    /**
     * 所有文件上传完成
     */
    handleUploadFinished() {
        this.setState({
            status: Status.Finished,
            minimized: this.minimizeWhenFinished,
            open: false
        })
        this.updateUploadStatus()
    }

    /**
     * 点击关闭按钮
     */
    async handleClose() {
        reset()
        this.togglePanel()
    }


    render() {
        const { files, fileStatus, uploaded, open, deferredClose } = this.state
        if (open) {
            const uploadInfos = files.reduce((infos, file) => {
                if (fileStatus[file.id] === FileStatus.Progress) {
                    return [
                        ...infos,
                        <div className={styles['title']}>
                            <div className={styles['thumbnail']}>
                                <Thumbnail doc={file} size={32} />
                            </div>
                            <div className={styles['name']}>
                                {file.name}
                            </div>
                        </div>,
                        <div className={styles['progress']}>
                            <div className={styles['percentage']} style={{ width: `${uploaded / file.size * 100}%` }}></div>
                        </div>,
                        <div className={styles['status']}>
                            <div className={styles['text']}> {__('正在上传...')}  </div>
                            <div className={styles['size']}> {`${formatSize(uploaded)} / ${formatSize(file.size)}`} </div>
                        </div>
                    ]
                }
                return infos
            }, [])

            if (uploadInfos.length) {
                return (
                    <Dialog>
                        <Dialog.Main>
                            <UIIcon className={styles['close']} code={'\uf014'} onClick={this.handleClose} color={'#868686'} />
                            {uploadInfos}
                        </Dialog.Main>
                    </Dialog>
                )
            }
        }
        return null
    }
}