import * as React from 'react';
import * as classnames from 'classnames';
import ScrollView from '../../ui/ScrollView/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Toolbar from './Toolbar/component.desktop';
import PDFViewerBase from './component.base';
import { Status } from './helper';
import * as loadingImg from './assets/loading.gif'
import * as styles from './styles.desktop.css';

export default class PDFViewer extends PDFViewerBase {
    render() {
        const { scaleRate, pageNumber, initialSize, mode, scrollViewTop, scrollViewLeft, status, pages, toolbar, totalPage, scaleTip } = this.state;
        return (
            <div className={styles['container-wrap']} ref="container">
                {
                    status === Status.OK ? (
                        <div className={styles['container']}>
                            <ScrollView
                                scrollViewTop={scrollViewTop}
                                scrollViewLeft={scrollViewLeft}
                                ref="scrollView"
                                width="100%"
                                height="100%"
                                onScroll={this.handleScroll.bind(this)}
                                doChangeScrollViewSize={this.handleChangeScrollView.bind(this)}
                            >
                                <div className={styles['pdf-container']} ref="pdfContainer">
                                    {
                                        pages.map(({ _page, viewport }, i) => {
                                            return (
                                                <div className={styles['cavas-wrap']}>
                                                    {
                                                        <canvas
                                                            className={classnames(styles['page-canvas'], { [styles['canvas-ppt']]: mode === 'ShowMode' })}
                                                            style={{ width: Math.floor(scaleRate / 100 * initialSize.width), height: Math.floor(scaleRate / 100 * initialSize.height) }}
                                                            ref={`canvas${i}`}
                                                        ></canvas>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </ScrollView>
                            <Toolbar
                                className={classnames({ [styles['hidden']]: !toolbar }, styles['toolbar'])}
                                ref="toolbar"
                                onToolsMouseEnter={this.handleToolsMouseEnter.bind(this)}
                                onToolsMouseLeave={this.handleToolsMouseLeave.bind(this)}
                                onZoomStart={this.handleZoomStart.bind(this)}
                                onZoomEnd={this.handleZoomEnd.bind(this)}
                                onScale={this.handleScale.bind(this)}
                                onRequestFullScreen={this.handleFullScreen.bind(this)}
                                isFullScrren={this.props.fullScreen}
                                onPage={this.handlePage.bind(this)}
                                scaleRate={scaleRate}
                                pageNumber={Number(pageNumber)}
                                totalPage={totalPage}
                            />
                        </div>
                    ) : <FlexBox>
                            <FlexBox.Item align="middle center">
                                <div className={styles['warning-icon']}>
                                    <image src={loadingImg} />
                                </div>
                                <div className={styles.loading}>Loading...</div>
                            </FlexBox.Item>
                        </FlexBox>
                }

                <div
                    className={styles['scale-tip']}
                    style={scaleTip ? { display: 'block' } : { display: 'none' }}
                >
                    {scaleRate}%
                </div>
            </div>
        )
    }
}