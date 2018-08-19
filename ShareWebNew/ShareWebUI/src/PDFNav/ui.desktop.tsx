import * as React from 'react'
import PDFNavBase from './ui.base'
import LinkIcon from '../LinkIcon/ui.desktop'
import FlexBox from '../FlexBox/ui.desktop'
import __ from './locale'
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css'
import * as prevImg from './assets/images/prev_dark.png'
import * as nextImg from './assets/images/next_dark.png'
import * as zoomOutImg from './assets/images/zoom_out_dark.png'
import * as zoomInImg from './assets/images/zoom_in_dark.png'

export default class PDFNav extends PDFNavBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    <FlexBox>
                        <FlexBox.Item align="middle center">
                            <LinkIcon size="32px" url={prevImg} onClick={this.prevPage.bind(this)}></LinkIcon>
                        </FlexBox.Item>
                        <FlexBox.Item align="middle center">
                            <form className={styles['form']} onSubmit={this.go.bind(this)}>
                                <input type="tel" onChange={this.changeHandler.bind(this)} name='pagenum' value={this.state.input} className={classnames(styles['pagenum'])} onBlur={this.go.bind(this)} />
                                <span className={styles['pagecount']}>{` / ${this.props.limit} ${__('页')}`}</span>
                            </form>
                        </FlexBox.Item>
                        <FlexBox.Item align="middle center">
                            <LinkIcon size="32px" url={nextImg} onClick={this.nextPage.bind(this)}></LinkIcon>
                        </FlexBox.Item>
                        <FlexBox.Item align="middle center">
                            <LinkIcon size="32px" url={zoomOutImg} onClick={this.zoomOut.bind(this)} disable={this.state.zoom <= this.props.start} ></LinkIcon>
                        </FlexBox.Item>
                        <FlexBox.Item align="middle center">
                            <LinkIcon size="32px" url={zoomInImg} onClick={this.zoomIn.bind(this)} disable={this.state.zoom >= this.props.end} ></LinkIcon>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
            </div>
        )
    }
}