import * as React from 'react'
import { getFlashHtml, PreviewType } from '../../core/cadpreview/cadpreview'
import { Browser } from '../../util/browser/browser'
import { ProgressCircle } from '../../ui/ui.desktop'
import BottomTool from './BottomTool/component.desktop'
import LargeFilePlugin from './LargeFilePlugin/component.desktop'
import TooLargeInfo from './TooLargeInfo/component.desktop'
import CADPreviewBase from './component.base'
import * as styles from './styles.desktop'
import __ from './locale'

export default class CADPreview extends CADPreviewBase {

    render() {
        const { theme, showBottomTool, previewType } = this.state

        const { fullScreen } = this.props

        return (
            <div className={styles['container']} >
                {
                    previewType === PreviewType.Loading ?
                        <ProgressCircle
                            detail={'Loading...'}
                            showMask={false}
                            theme={'dark'}
                        />
                        : null
                }
                {
                    previewType === PreviewType.SmallFilePreview ?
                        <div
                            className={styles['cad-area']}
                            dangerouslySetInnerHTML={getFlashHtml(this.browserType, this.swfUrl, this.flashVars)}
                            onMouseMove={() => this.handleMouseMove()}
                            onContextMenu={e => e.preventDefault()}
                            onMouseDown={this.browserType === Browser.MSIE ? this.keepTitle.bind(this) : undefined}
                        />
                        : null
                }
                {
                    previewType === PreviewType.LargeFilePreview ?
                        <LargeFilePlugin
                            doc={this.props.doc}
                            gstarcadwebviewUrl={this.gstarcadwebviewUrl}
                            gstarCADWebViewerSetup86Url={this.gstarCADWebViewerSetup86Url}
                            gstarCADWebViewerSetup64Url={this.gstarCADWebViewerSetup64Url}
                            onDownloadFile={this.props.doDownload}
                        />
                        : null
                }
                {
                    previewType === PreviewType.TooLarge ?
                        <TooLargeInfo />
                        : null
                }
                <div
                    className={styles['bottom-tool-area']}
                    style={showBottomTool ? {} : { display: 'none' }}
                >
                    <BottomTool
                        theme={theme}
                        icons={this.getIcons(theme, fullScreen)}
                        onMouseMoveBottomTool={this.handleMouseMoveBottomTool.bind(this)}
                    />
                </div>
            </div >

        )
    }

    /**
     * 获取BottomTool的icons
     */
    getIcons(theme: string, fullScreen: boolean) {
        const icons = [
            {
                code: '\uf0b6',
                title: __('选择'),
                onClick: () => this.choose()
            }, {
                code: '\uf0b7',
                title: __('显示全图'),
                onClick: () => this.zoomAll()
            }, {
                code: '\uf0b8',
                title: __('移动视图'),
                onClick: () => this.drag()
            }, {
                code: '\uf0b9',
                title: __('窗口缩放'),
                onClick: () => this.zoomWindow()
            }, {
                code: '\uf0a4',
                title: __('缩小'),
                onClick: () => this.zoomIn()
            }, {
                code: '\uf0a3',
                title: __('放大'),
                onClick: () => this.zoomOut()
            }, {
                code: theme === 'dark' ? '\uf0ba' : '\uf0bb',
                title: __('背景颜色'),
                onClick: () => this.changeBKColor()
            }, {
                code: fullScreen ? '\uf039' : '\uf038',
                title: fullScreen ? __('退出全屏') : __('全屏'),
                fullScreen: true,
                onClick: () => this.requestFullScreen()
            }, {
                code: '\uf0bc',
                title: __('测量长度'),
                onClick: () => this.measureLength()
            }, {
                code: '\uf0bd',
                title: __('测量面积'),
                onClick: () => this.measureArea()
            }
        ]

        const element = document.documentElement;

        return !!(element.requestFullscreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullscreen) ?
            icons
            :
            icons.filter(({ fullScreen }) => !fullScreen)
    }
}