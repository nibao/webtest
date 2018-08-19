import * as React from 'react'
import * as classnames from 'classnames'
import GalleryBase from './component.base'
import Thumbnail from '../../Thumbnail/component.desktop'
import * as styles from './styles.desktop.css'
import { docname } from '../../../core/docs/docs'
import PopOver from '../../../ui/PopOver/ui.desktop'

export default class Gallery extends GalleryBase {
    render() {
        const { images, onIndexChange, className, index } = this.props
        return (
            <div
                ref={this.getContainer}
                className={classnames(styles['container'], className)}
            >
                {
                    images.map((image, i) => {
                        return (
                            <PopOver
                                trigger={
                                    <div
                                        ref={ref => this.getThumbnails(ref, i)}
                                        className={classnames(styles['thumbnail'], { [styles['active']]: index === i })}
                                        onClick={() => onIndexChange(i)}
                                    >
                                        <Thumbnail fallback={null} size={90} doc={image} nostatistic={image && image.link ? true : undefined} />
                                    </div>
                                }
                                triggerEvent={'mouseover'}
                                freezable={false}
                                anchorOrigin={['right', 'middle']}
                                targetOrigin={[-5, 'middle']}
                                closeTimeout={0}
                                watch={true}
                                keepOpenWhenMouseOver={false}
                            >
                                <div className={styles['name']}>{docname(image)}</div>
                            </PopOver>
                        )
                    })
                }
            </div>
        )
    }
}