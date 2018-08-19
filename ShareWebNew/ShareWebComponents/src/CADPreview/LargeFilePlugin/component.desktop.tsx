import * as React from 'react'
import { noop } from 'lodash'
import FlexBox from '../../../ui/FlexBox/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import * as styles from './styles.desktop'
import __ from './locale'

const LargeFilePlugin: React.StatelessComponent<Components.CADPreview.LargeFilePlugin.Props> = ({
    doc,
    gstarCADWebViewerSetup86Url = '',
    gstarCADWebViewerSetup64Url = '',
    gstarcadwebviewUrl = '',
    onDownloadFile
}) => {
    return (
        <div className={styles['container']}>
            <FlexBox>
                <FlexBox.Item align="middle center">
                    <div className={styles['warning-icon']}>
                        <UIIcon
                            size={'64px'}
                            code={'\uf030'}
                            color="#757575"
                        />
                    </div>
                    <div className={styles['message']}>
                        {__('该文件过大，无法直接预览')}
                    </div>
                    <div className={styles['text']}>
                        {__('您可以在确认安装插件后')}
                        <a
                            href={gstarcadwebviewUrl}
                            className={styles['text-link']}
                        >
                            {__('使用大图插件查看')}
                        </a>
                        {
                            onDownloadFile ?
                                <span>
                                    <span className={styles['or-text']}>
                                        {__('或')}
                                    </span>
                                    <a
                                        href="javascript:;"
                                        className={styles['text-link']}
                                        onClick={() => onDownloadFile(doc)}
                                    >
                                        {__('下载查看')}
                                    </a>
                                </span>
                                : null
                        }
                    </div>
                    <div>
                        {__('（若未安装大图插件，请您先安装')}
                        <a
                            href={gstarCADWebViewerSetup86Url}
                            className={styles['text-link']}
                        >
                            {__('Windows32位')}
                        </a>
                        <a
                            href={gstarCADWebViewerSetup64Url}
                            className={styles['text-link']}
                        >
                            {__('Windows64位')}
                        </a>
                        {__('）')}
                    </div>
                </FlexBox.Item>
            </FlexBox>
        </div>
    )
}

export default LargeFilePlugin