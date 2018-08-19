import * as React from 'react';
import GalleryBase from './ui.base';
import * as styles from './style.base.css';

export default class Gellery extends GalleryBase {
    render() {
        return (
            <div className={styles['container']}>
                {/* 使用 LinkIcon*/}
                <button className={styles['btn-prev']} disabled={this.state.currentGroupIndex === 0 ? 'disabled' : ''} onClick={this.prevHandler}></button>
                <ul className={styles['list-ul']}>
                    {this.updateGallery()}
                </ul>
                <button className={styles['btn-next']} disabled={this.state.currentGroupIndex === this.galleryGroups.length - 1 ? 'disabled' : ''} onClick={this.nextHandler}></button>
            </div>
        )
    }
}