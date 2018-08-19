import * as React from 'react'
import * as classnames from 'classnames'
import ToolBarBase from './component.base'
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Slider from '../../../ui/Slider/ui.desktop';
import { Browser, isBrowser } from '../../../util/browser/browser';
import __ from './locale'
import * as styles from './styles.desktop.css'

const isIE8or9 = isBrowser({ app: Browser.MSIE, version: 8 }) || isBrowser({ app: Browser.MSIE, version: 9 })

export default class ToolBar extends ToolBarBase {
    render() {
        const { onRequestFullScreen, onZoom, fullScreen, zoom, onRotate, onToggleGallery, className, images } = this.props
        const element = document.documentElement

        return (
            <div
                className={classnames(styles['container'], className)}
            >
                <UIIcon
                    className={styles['icon']}
                    titleClassName={styles['title-dark']}
                    code="\uf0a4"
                    title={__('缩小')}
                    disabled={zoom === 0.1}
                    onMouseDown={this.zoomOut}
                />
                <Slider
                    className={styles['dragbar']}
                    foregroundColor="#bdbdbd"
                    min={0.1}
                    max={5}
                    step={0.01}
                    size={5}
                    length={100}
                    thickness={1}
                    value={zoom}
                    onChange={onZoom}
                />
                <UIIcon
                    className={styles['icon']}
                    titleClassName={styles['title-dark']}
                    code="\uf0a3"
                    title={__('放大')}
                    disabled={zoom === 5}
                    onMouseDown={this.zoomIn}
                />
                {
                    isIE8or9 ?
                        null :
                        [
                            <UIIcon
                                className={styles['icon']}
                                titleClassName={styles['title-dark']}
                                code="\uf05a"
                                title={__('左旋90°')}
                                onClick={() => onRotate(-90)}
                            />,
                            <UIIcon
                                className={styles['icon']}
                                titleClassName={styles['title-dark']}
                                code="\uf05b"
                                title={__('右旋90°')}
                                onClick={() => onRotate(90)}
                            />
                        ]
                }
                {
                    !!(
                        element.requestFullscreen ||
                        element.webkitRequestFullScreen ||
                        element.mozRequestFullScreen ||
                        element.msRequestFullscreen
                    ) ?
                        <UIIcon
                            className={styles['icon']}
                            titleClassName={styles['title-dark']}
                            code={fullScreen ? '\uf039' : '\uf038'}
                            title={__(fullScreen ? '退出全屏' : '全屏')}
                            onClick={() => onRequestFullScreen()}
                        />
                        :
                        null
                }
                {
                    fullScreen || images.length < 2 ?
                        null :
                        <UIIcon
                            className={styles['icon']}
                            titleClassName={styles['title-dark']}
                            code="\uf0b5"
                            title={__('缩略图')}
                            onClick={onToggleGallery}
                        />
                }
                {/* <UIIcon
                    className={styles['icon']}
                    code="\uf0a3"
                    onClick={onToggleSidebar}
                /> */}
            </div>
        )
    }
}