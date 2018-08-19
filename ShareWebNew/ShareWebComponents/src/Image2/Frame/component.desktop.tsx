import * as React from 'react'
import FrameBase from './component.base'
import Thumbnail from '../../Thumbnail/component.desktop'
import ToolBar from '../ToolBar/component.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import __ from './locale'
import * as classnames from 'classnames'
import Icon from '../../../ui/Icon/ui.desktop'
import Centered from '../../../ui/Centered/ui.desktop'
import * as styles from './styles.desktop.css'
import * as brokenImg from './assets/images/broken.png'
import * as loadingImg from './assets/images/loading.gif'

const GalleryWidth = 120

const
    loading = (
        <Centered>
            <Icon url={loadingImg} size={48} />
            <div className={styles['text']}>{'Loading'}</div>
        </Centered>
    ),
    broken = (
        <Centered>
            <Icon url={brokenImg} size={64} />
            <div className={styles['text']}> {__('图片加载失败')}</div>
        </Centered>
    )

export default class Frame extends FrameBase {

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps)
        if (nextProps.showGallery !== this.props.showGallery) {
            /**
             * 切换缩略图时居中
             */
            this.setState({
                left: nextProps.showGallery ? (this.state.left - GalleryWidth / 2) : (this.state.left + GalleryWidth / 2)
            })
        }
    }

    render() {
        const { images, index, className, fullScreen, onRequestPrev, onRequestNext, onRequestFullScreen, onToggleGallery } = this.props
        const { left, top, width, height, zoom, rotate, showTools, showZoomTip, previewError } = this.state
        return (
            <div
                className={classnames(styles['container'], className)}
                ref="container"
                onMouseMove={this.handleMouseMove}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {
                    previewError ?
                        broken :
                        [
                            <Thumbnail
                                doc={images[index]}
                                size={1e10}
                                fallback={loading}
                                className={styles['image']}
                                style={{
                                    top,
                                    left,
                                    width,
                                    height,
                                    maxWidth: width,
                                    maxHeight: height,
                                    transform: `rotate(${rotate}deg)`
                                }}
                                onThumbnailLoad={this.handleThumbnailLoad}
                                onThumbnailError={this.handleThumbnailError}
                            />,
                            /** 用div覆盖图片，修复中文版火狐拖拽问题 */
                            <div
                                style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top,
                                    left,
                                    width,
                                    height,
                                    maxWidth: width,
                                    maxHeight: height,
                                    transform: `rotate(${rotate}deg)`,
                                    backgroundImage: `url('data:image/png;base64,')`
                                }}
                                onMouseDown={this.startDrag}
                            ></div>
                        ]
                }
                <UIIcon
                    code={'\uf04d'}
                    className={classnames(styles['icon'], styles['prev'], { [styles['hide']]: !showTools || index === 0 })}
                    onClick={onRequestPrev}
                    onMouseEnter={this.handleToolsMouseEnter}
                    onMouseLeave={this.handleToolsMouseLeave}
                />
                <UIIcon
                    code={'\uf04e'}
                    className={classnames(styles['icon'], styles['next'], { [styles['hide']]: !showTools || index === images.length - 1 })}
                    onClick={onRequestNext}
                    onMouseEnter={this.handleToolsMouseEnter}
                    onMouseLeave={this.handleToolsMouseLeave}
                />
                <div
                    className={classnames(styles['toolbar'], { [styles['hide']]: !showTools })}
                    onMouseEnter={this.handleToolsMouseEnter}
                    onMouseLeave={this.handleToolsMouseLeave}
                >
                    <ToolBar
                        zoom={zoom}
                        images={images}
                        fullScreen={fullScreen}
                        onZoom={this.zoom}
                        onRequestFullScreen={onRequestFullScreen}
                        onToggleGallery={onToggleGallery}
                        onRotate={this.rotate}
                    />
                </div>
                <div className={classnames(styles['zoom-tip'], { [styles['show']]: showZoomTip })}>
                    {`${Math.round(zoom * 100)}%`}
                </div>
            </div>
        )
    }
}