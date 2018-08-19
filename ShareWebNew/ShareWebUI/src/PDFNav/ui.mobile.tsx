import * as React from 'react'
import PDFNavBase from './ui.base'
import LinkIcon from '../LinkIcon/ui.mobile'
import * as classnames from 'classnames'
import  __ from './locale'
import * as styles from './styles.mobile.css'
import * as prevImg from './assets/images/prev.png'
import * as nextImg from './assets/images/next.png'
import * as zoomOutImg from './assets/images/zoom_out.png'
import * as zoomInImg from './assets/images/zoom_in.png'

export default class PDFNav extends PDFNavBase {
    render() {
        return (
            <div className={styles['container']}>
                <LinkIcon size=".8rem" url={prevImg} onClick={this.prevPage.bind(this)}></LinkIcon>
                <form className={styles['form']} onSubmit={this.go.bind(this)}>
                    <input type="tel" onChange={this.changeHandler.bind(this)} name='pagenum' value={this.state.input} className={classnames(styles['pagenum'])} onBlur={this.go.bind(this)} />
                    <span className={styles['pagecount']}>{` / ${this.props.limit} ${__('页')}`}</span>
                </form>
                <LinkIcon size=".8rem" url={nextImg} onClick={this.nextPage.bind(this)}></LinkIcon>
                <LinkIcon size=".8rem" url={zoomOutImg} onClick={this.zoomOut.bind(this)}></LinkIcon>
                <LinkIcon size=".8rem" url={zoomInImg} onClick={this.zoomIn.bind(this)}></LinkIcon>
            </div>
        )
    }
}