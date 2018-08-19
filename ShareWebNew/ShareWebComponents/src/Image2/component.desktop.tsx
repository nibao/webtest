import * as React from 'react'
import * as classnames from 'classnames'
import ImageBase from './component.base'
import Gallery from './Gallery/component.desktop'
import Frame from './Frame/component.desktop'
import * as styles from './styles.desktop.css'

export default class Image extends ImageBase {

    render() {
        const { className, fullScreen, onRequestFullScreen } = this.props
        const { images, showGallery, index } = this.state
        return (
            <div className={classnames(styles['container'], { [styles['show-gallery']]: showGallery && !fullScreen && images.length > 1 }, className)} ref="container">
                <Frame
                    images={images}
                    index={index}
                    className={styles['frame']}
                    showGallery={showGallery}
                    fullScreen={fullScreen}
                    onRequestPrev={this.prev.bind(this)}
                    onRequestNext={this.next.bind(this)}
                    onToggleGallery={this.toggleGallery.bind(this)}
                    onRequestFullScreen={onRequestFullScreen}
                />
                <Gallery
                    images={images}
                    index={index}
                    className={classnames(styles['gallery'])}
                    onIndexChange={this.load.bind(this)}
                />
            </div>
        )
    }
}