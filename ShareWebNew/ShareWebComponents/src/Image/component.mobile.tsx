import * as React from 'react';
import { findIndex, assign } from 'lodash';
import __ from './locale';
import ImageBase from './component.base';
import ImageBox from '../../ui/ImageBox/ui.mobile';
import { Centered, Icon } from '../../ui/ui.desktop'
import Viewer from '../Viewer/component.mobile';
import { getErrorTemplate, getErrorMessage } from '../../core/errcode/errcode';
import FlexBox from '../../ui/FlexBox/ui.mobile';
import LinkIcon from '../../ui/LinkIcon/ui.mobile';
import { Status } from './helper';
import { docname } from '../../core/docs/docs';
import * as styles from './style.mobile.css';

import * as prev from './assets/mobile/prev.png';
import * as next from './assets/mobile/next.png';
import * as brokenImg from './assets/mobile/broken.png'

export default class Image extends ImageBase {
    /**
     * 注册屏幕旋转的事件监听
     */
    componentDidMount() {
        super.componentDidMount()
        window.addEventListener('orientationchange', this.setImageSize.bind(this));
    }

    /**
     * 卸载时移除事件监听
     */
    componentWillUnmount() {
        window.removeEventListener('orientationchange', this.setImageSize);
    }

    render() {
        return (
            <Viewer onRequestBack={this.props.onRequestBack} doc={this.state.currentDoc || this.props.doc} link={this.props.link} style={{ background: '#000', backgroundImage: 'none' }}>
                <div className={styles['container']}>
                    <div className={styles['body']}>
                        {
                            this.props.list.length > 1 ?
                                (
                                    <div>
                                        <div className={styles['img-wrap']}>
                                            {this.getContent()}
                                        </div>
                                        <LinkIcon className={styles['right-arrow']} url={prev} size="40px" onClick={this.prevHandler.bind(this)} />
                                        <LinkIcon className={styles['left-arrow']} url={next} size="40px" onClick={this.nextHandler.bind(this)} />
                                    </div>
                                ) :
                                (
                                    <div className={styles['img-wrap']}>
                                        {this.getContent()}
                                    </div>
                                )
                        }
                    </div>
                </div>
            </Viewer>
        )
    }

    getContent() {
        switch (this.state.status) {
            case Status.OK:
                return (
                    this.state.previewError ?
                        <Centered>
                            <Icon url={brokenImg} size={64} />
                            <div className={styles['text']}> {__('图片加载失败')}</div>
                        </Centered>
                        :
                        (
                            <ImageBox
                                src={this.state.src}
                                fullScreen={this.props.list.length > 1 ? false : true}
                                onError={this.handleError.bind(this)}
                            />
                        )
                )

            case Status.INVALID_FORMAT:
                return (
                    <div className={styles.message}>{__('不支持当前格式的文件预览')}</div>
                )

            case Status.NO_PERMISSION:
                return (
                    <div className={styles.message}>{__('无法预览该文件,您的访问权限不足')}</div>
                )

            case Status.FILE_NOT_EXISTED:
                return (
                    <div className={styles.message}>{__('无法预览该文件，该文件已不存在')}</div>
                )

            case Status.LINK_PWD_ERROR:
                return (
                    <div className={styles.message}>{getErrorMessage(Status.LINK_PWD_ERROR)}</div>
                )
        }
    }

    setImageSize() {
        let self = this;

        setTimeout(() => {
            self.forceUpdate();
        }, 100);
    }

    /**
     * 获取当前图片在列表中的顺序
     */
    getImgIndex(): number {
        return findIndex(this.props.list, (doc) => doc.docid === this.state.currentDoc.docid);
    }

    /**
     * 应用对应列表位置的图片
     */
    applyImgByIndex(index: number): void {
        let newPicture = this.props.list[index];
        this.setState({
            currentDoc: newPicture
        });
        this.props.onChange(newPicture);
    }

    /**
     * 前翻
     */
    prevHandler(): void {
        let index = this.getImgIndex();
        if (index !== 0) {
            this.applyImgByIndex(index - 1);
        }
    }

    /**
     * 后翻
     */
    nextHandler(): void {
        let index = this.getImgIndex();
        if (index !== this.props.list.length - 1) {
            this.applyImgByIndex(index + 1);
        }
    }
}