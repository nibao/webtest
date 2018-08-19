import * as React from 'react';
import * as classnames from 'classnames';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Slider from '../../../ui/Slider/ui.desktop';
import NumberBox from './NumberBox/component.desktop';
import ToolbarBase from './component.base';
import __ from './locale'
import * as styles from './styles.desktop.css';

export default class Toolbar extends ToolbarBase {
    render() {
        const element = document.documentElement;
        return (
            <div className={classnames(styles['container'], this.props.className)}>
                <div
                    className={styles['toolbar']}
                    ref={toolbar => this.toolbar = toolbar}
                    onMouseEnter={this.props.onToolsMouseEnter}
                    onMouseLeave={this.props.onToolsMouseLeave}
                >
                    <UIIcon
                        className={classnames(styles['tool-icon'], { [styles['enable']]: this.props.scaleRate > 10 })}
                        code="\uf0a4"
                        onClick={() => this.handleScale(this.scaleRate - 10)}
                        title={__('缩小')}
                        titleClassName={styles['title']}
                        disabled={this.props.scaleRate <= 10}
                    />
                    <Slider
                        className={styles['dragbar']}
                        min={10}
                        max={400}
                        length={100}
                        size={5}
                        thickness={1}
                        foregroundColor="#bdbdbd"
                        value={this.props.scaleRate}
                        onChange={this.props.onZoomStart}
                        onDragEnd={this.props.onZoomEnd}
                    />
                    <UIIcon
                        className={classnames(styles['tool-icon'], { [styles['enable']]: this.props.scaleRate < 400 })}
                        code="\uf0a3"
                        onClick={() => this.handleScale(this.scaleRate + 10)}
                        title={__('放大')}
                        titleClassName={styles['title']}
                        disabled={this.props.scaleRate >= 400}
                    />

                    <UIIcon
                        className={classnames(styles['tool-icon'], { [styles['enable']]: this.props.pageNumber > 1 })}
                        code="\uf04d"
                        onClick={() => this.handlePage(this.pageNumber - 1)}
                        title={__('上一页')}
                        titleClassName={styles['title']}
                        disabled={this.props.pageNumber === 1}
                    />

                    <NumberBox
                        className={styles['number-box']}
                        current={this.props.pageNumber}
                        total={this.props.totalPage}
                        onEnter={this.props.onPage.bind(this)}
                    />

                    <UIIcon
                        className={classnames(styles['tool-icon'], { [styles['enable']]: this.props.pageNumber < this.props.totalPage })}
                        code="\uf04e"
                        onClick={() => this.handlePage(this.pageNumber + 1)}
                        title={__('下一页')}
                        titleClassName={styles['title']}
                        disabled={this.props.pageNumber === this.props.totalPage}
                    />
                    {
                        !!(
                            element.requestFullscreen ||
                            element.webkitRequestFullScreen ||
                            element.mozRequestFullScreen ||
                            element.msRequestFullscreen
                        ) ?
                            (
                                <UIIcon
                                    className={styles['tool-icon']}
                                    code={this.props.isFullScrren ? '\uf039' : '\uf038'}
                                    onClick={this.props.onRequestFullScreen}
                                    title={this.props.isFullScrren ? __('退出全屏') : __('全屏')}
                                    titleClassName={styles['title']}
                                />
                            ) : null
                    }

                </div>
            </div>
        )
    }

}