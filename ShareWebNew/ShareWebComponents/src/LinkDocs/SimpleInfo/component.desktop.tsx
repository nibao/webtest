import * as React from 'react'
import * as classnames from 'classnames'
import { formatSize, formatTime } from '../../../util/formatters/formatters';
import { docname, isDir } from '../../../core/docs/docs'
import { Centered, Button, UIIcon, Text } from '../../../ui/ui.desktop'
import Thumbnail from '../../Thumbnail/component.desktop'
import * as styles from './styles.desktop.css'
import __ from './locale'

const SimpleInfo: React.StatelessComponent<Components.LinkDocs.SimpleInfo.Props> = function ({
    linkDoc,
    downloadEnable,
    onRequestOpenDir,
    onRequestPreviewFile,
    onRequestDownload,
    onRequrestSaveTo
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
                    <Text>
                        {docname(linkDoc)}
                    </Text>
                </div>
                {
                    !isdir && (
                        <div className={classnames(styles['size-text'], styles['line-area'])} >
                            <span className={styles['distance']}>{formatSize(linkDoc.size)}</span>
                            <span>
                                {__('有效期至：')}
                                {formatTime(endtime / 1000, 'yyyy/MM/dd')}
                            </span>
                        </div>
                    )
                }
                {
                    isdir && (
                        <div className={classnames(styles['size-text'], styles['line-area'])} >
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
                    downloadEnable ?
                        <div className={styles['line-area']}>
                            <Button
                                icon={isdir ? '\uf0cf' : '\uf02c'}
                                onClick={() => isdir ? onRequestOpenDir(linkDoc) : onRequestPreviewFile(linkDoc)}
                            >
                                {isdir ? __('打开') : __('预览')}
                            </Button>
                            <Button
                                icon={'\uf02a'}
                                className={styles['download-btn']}
                                onClick={() => onRequestDownload([linkDoc])}
                            >
                                {__('下载')}
                            </Button>
                            <Button
                                icon={'\uf032'}
                                className={styles['saveto-btn']}
                                onClick={() => onRequrestSaveTo([linkDoc])}
                            >
                                {__('转存到我的云盘')}
                            </Button>
                        </div>
                        :
                        <div className={styles['line-area']}>
                            <Button
                                className={styles['open-btn-only']}
                                onClick={() => isdir ? onRequestOpenDir(linkDoc) : onRequestPreviewFile(linkDoc)}
                            >
                                {isdir ? __('打开') : __('预览')}
                            </Button>
                        </div>
                }
            </Centered>
        </div>
    )
}

export default SimpleInfo