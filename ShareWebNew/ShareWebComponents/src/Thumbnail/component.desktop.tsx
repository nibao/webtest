import * as React from 'react'
import * as classnames from 'classnames'
import ThumbnailBase from './component.base'
import * as styles from './styles.desktop.css'

export default class Thumbnail extends ThumbnailBase {
    render() {
        const { size, className, style = {}, ...otherProps } = this.props
        const { maxWidth, maxHeight, width, height, ...otherStyles } = style
        const { iconSrc, thumbnailSrc, thumbnailLoaded } = this.state
        return (
            <div
                className={classnames(styles['container'], className)}
                style={{ width: width || size, height, ...otherStyles }}
                {...otherProps}
            >
                {
                    /** 缩略图未加载 */
                    !(thumbnailSrc && thumbnailLoaded) ?
                        /** iconSrc 为字符串 */
                        typeof iconSrc === 'string' && iconSrc ?
                            <img
                                style={{ width, height, maxWidth: maxWidth || width || size, maxHeight: maxHeight || height || size }}
                                src={iconSrc}
                                draggable={false}
                            /> :
                            /** iconSrc 不是字符串 */
                            iconSrc :
                        null
                }
                {
                    thumbnailSrc ?
                        <img
                            style={{ width, height, maxWidth: maxWidth || width || size, maxHeight: maxHeight || height || size, display: thumbnailLoaded ? 'inline-block' : 'none' }}
                            src={thumbnailSrc}
                            draggable={false}
                            onLoad={this.handleThumbnailLoaded.bind(this)}
                            onError={this.handleThumbnailError.bind(this)}
                        /> : null
                }
            </div>
        )
    }
}