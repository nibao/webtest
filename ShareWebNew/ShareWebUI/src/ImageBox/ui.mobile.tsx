import * as React from 'react';
import __ from './locale';
import { round, floor } from 'lodash';
import { LoadState } from './helper';
import ImageBoxBase from './ui.base';
import FlexBox from '../FlexBox/ui.mobile';
import LinkIcon from '../LinkIcon/ui.mobile';
import * as styles from './style.mobile.css';

import * as loading from './assets/loading.gif';
import * as warning from './assets/warning.png';
import * as zoom_in from './assets/mobile/zoom_in.png';
import * as zoom_out from './assets/mobile/zoom_out.png';

export default class ImageBox extends ImageBoxBase {
    render() {
        /**
         * 根据加载状态渲染
         */
        return (
            <div ref="imgBox" className={styles['imgBox']}>
                <img
                    ref="img"
                    style={this.state.imgStyle}
                    className={styles['img']}
                    src={this.state.src}
                    onLoad={this.resetImageSize.bind(this)}
                    onError={this.handleError.bind(this)}
                />
                <div className={styles['zoom_btn_container']}>
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <LinkIcon url={zoom_out} size="30px" onClick={this.zoomOut.bind(this)} />
                            <LinkIcon url={zoom_in} size="30px" onClick={this.zoomIn.bind(this)} />
                        </FlexBox.Item>
                    </FlexBox>
                </div>
            </div>
        )
    }

    /**
     * 重新设置图片的大小，使其能够完全显示在屏幕上
     */
    private resetImageSize() {
        const width = this.refs.img.offsetWidth
        const height = this.refs.img.offsetHeight

        const screenWidth = window.screen.width
        const screenHeight = window.screen.height - 45

        if (width > screenWidth || height > screenHeight) {
            this.setImgSize(floor(width * Math.min(screenWidth / width, screenHeight / height)))
        } else {
            this.setState({
                imgStyle: {
                    opacity: '1'
                }
            })
        }
    }

    /**
     * 缩小图片 2px以下不再缩小
     */
    zoomOut() {
        let width = this.refs.img.offsetWidth;
        this.setImgSize(round(width < 2 ? width : width * 0.8));
    }


    /**
     * 放大图片 无上限
     */
    zoomIn() {
        this.setImgSize(round(this.refs.img.offsetWidth * 1.25));
    }

    /**
     * 设置图片大小 只改变宽度使图片宽高自适应
     */
    setImgSize(width: number, imgBoxStyle: any = this.refs.imgBox.style) {
        this.setState({
            imgStyle: {
                maxWidth: 'none',
                maxHeight: 'none',
                width: width + 'px'
            }
        });

        imgBoxStyle.overflow = width > parseInt(imgBoxStyle.maxWidth) ? 'auto' : '';
    }
}