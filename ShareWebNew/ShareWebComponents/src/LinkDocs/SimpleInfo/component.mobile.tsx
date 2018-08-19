import * as React from 'react'
import * as classnames from 'classnames'
import { formatSize, formatTime } from '../../../util/formatters/formatters';
import { docname, isDir } from '../../../core/docs/docs'
import { Centered } from '../../../ui/ui.desktop'
import { Button, UIIcon } from '../../../ui/ui.mobile'
import Thumbnail from '../../Thumbnail/component.mobile'
import * as styles from './styles.mobile.css'
import __ from './locale'

const SimpleInfo: React.StatelessComponent<Components.LinkDocs.SimpleInfo.Props> = function ({
    linkDoc,
    downloadEnable,
    onRequestOpenDir,
    onRequestPreviewFile,
    onRequestDownload,
}) {
    const isdir = isDir(linkDoc)
    const { filenum, totalsize, endtime } = linkDoc

    return (
        <div className={styles['simple-info']}>
            <Centered>
                <div
                    className={styles['thumbnail-area']}
                    onClick={() => isdir ? onRequestOpenDir(linkDoc) : onRequestPreviewFile(linkDoc)}
                >
                    <Thumbnail
                        doc={{ name: linkDoc.name, size: linkDoc.size }}
                    />
                </div>
                <div
                    className={classnames(styles['name-text'], styles['line-area'])}
                    onClick={() => isdir ? onRequestOpenDir(linkDoc) : onRequestPreviewFile(linkDoc)}
                >
                    {docname(linkDoc)}
                </div>
                {
                    !!endtime && !isdir && (
                        <div className={classnames(styles['line-area'], styles['description-area'])} >
                            <span className={styles['distance']}>{formatSize(linkDoc.size)}</span>
                            <span>
                                {__('有效期至：')}
                                {formatTime(endtime / 1000, 'yyyy/MM/dd')}
                            </span>
                        </div>
                    )
                }
                {
                    !!endtime && isdir && (
                        <div className={classnames(styles['line-area'], styles['description-area'])} >
                            <span className={styles['distance']}>{formatSize(totalsize)}</span>
                            <span className={styles['distance']}>{`${__('文件数：')} ${filenum}`}</span>
                            <span>
                                {__('有效期至：')}
                                {formatTime(endtime / 1000, 'yyyy/MM/dd')}
                            </span>
                        </div>
                    )
                }
                {
                    isdir ?
                        <div className={classnames(styles['line-area'], styles['btn-area'])}>
                            <Button
                                className={classnames(styles['one-button'], styles['button'])}
                                onClick={() => onRequestOpenDir(linkDoc)}
                            >
                                {__('打开')}
                            </Button>
                        </div>
                        :
                        <div className={classnames(styles['line-area'], styles['btn-area'])}>
                            <Button
                                className={classnames(downloadEnable ? styles['two-button'] : styles['one-button'], styles['button'])}
                                onClick={() => onRequestPreviewFile(linkDoc)}
                            >
                                {__('预览')}
                            </Button>
                            {
                                downloadEnable && (
                                    <Button
                                        className={classnames(styles['download-btn'], styles['two-button'], styles['button'])}
                                        onClick={() => onRequestDownload([linkDoc])}
                                    >
                                        {__('下载')}
                                    </Button>
                                )
                            }
                        </div>
                }
            </Centered>
        </div>
    )
}

export default SimpleInfo
