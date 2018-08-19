import * as React from 'react'
import * as classnames from 'classnames'
import ThumbnailBase from './component.base'
import * as styles from './styles.mobile.css'

export default class Thumbnail extends ThumbnailBase {
    render() {
        const { size, className } = this.props
        const { iconSrc, thumbnailSrc, thumbnailLoaded } = this.state
        return (
            <div
                className={classnames(styles['container'], className)}
                style={{ width: size }}
            >
                <img
                    style={{ maxWidth: size, maxHeight: size, display: thumbnailLoaded ? 'none' : 'inline-block' }}
                    src={iconSrc}
                    draggable={false}
                />
                {
                    thumbnailSrc ?
                        <img
                            style={{ maxWidth: size, maxHeight: size, display: thumbnailLoaded ? 'inline-block' : 'none' }}
                            src={thumbnailSrc}
                            draggable={false}
                            onLoad={this.handleThumbnailLoaded.bind(this)}
                        /> : null
                }
            </div>
        )
    }
}