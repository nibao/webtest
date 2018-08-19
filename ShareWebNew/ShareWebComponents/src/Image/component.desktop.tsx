import * as React from 'react';
import __ from './locale';
import Viewer from '../Viewer/component.desktop';
import ImageBase from './component.base';
import ImageBox from '../../ui/ImageBox/ui.desktop';
import Gallery from '../../ui/Gallery/ui.desktop';
import GalleryImage from '../../ui/GalleryImage/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import { buildGallery } from './helper';
import * as styles from './style.desktop.css';

export default class Image extends ImageBase {
    render() {
        return (
            <Viewer doc={ this.props.doc } link={ this.props.link } lightoff={ true }>
                <div className={ styles['container'] }>
                    <div className={ styles['body'] }>
                        <div className={ styles['padding'] }>
                            <FlexBox>
                                <FlexBox.Item align="middle center">
                                    {
                                        this.state.src ?
                                            <ImageBox src={ this.state.src } /> :
                                            null
                                    }
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                    </div>
                    <div className={ styles['footer'] }>
                        {
                            this.props.gallery && this.props.gallery.length ?
                                <Gallery groupIndex={ this.getIndex() }>
                                    {
                                        buildGallery(this.props.gallery).map(item => {
                                            return (
                                                <li key={ item.doc.docid } onClick={ this.switchImage(item.doc) } data-high-light={ item.doc.docid === this.props.doc.docid }>
                                                    <GalleryImage src={ item.img } />
                                                </li>
                                            );
                                        })
                                    }
                                </Gallery> :
                                null
                        }
                    </div>
                </div>
            </Viewer>
        )
    }
}