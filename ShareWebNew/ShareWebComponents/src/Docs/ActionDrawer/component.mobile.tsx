import * as React from 'react'
import * as classnames from 'classnames'
import ActionDrawerBase from './component.base'
import Drawer from '../../../ui/Drawer/ui.mobile'
import Grid from '../../../ui/Grid/ui.mobile'
import UIIcon from '../../../ui/UIIcon/ui.mobile'
import Thumbnail from '../../Thumbnail/component.mobile'
import LinkButton from '../../../ui/LinkButton/ui.mobile'
import { formatTime, formatSize } from '../../../util/formatters/formatters'
import * as fs from '../../../core/filesystem/filesystem'
import { docname, isDir } from '../../../core/docs/docs'
import * as styles from './styles.mobile.css'
import __ from './locale'

export default class ActionDrawer extends ActionDrawerBase {
    render() {
        const { docs, onRequestInternalShare, onRequestRename, onRequestDelete, onRequestDownload, onRequestCopy, onRequestMove } = this.props

        return (
            <Drawer
                open={docs.length}
                position="bottom"
                className={styles['drawer']}
                onClickMask={this.close.bind(this)}
            >
                {
                    docs.length === 1 ?
                        <div className={styles['info']}>
                            <div className={styles['thumbnail']}>
                                <Thumbnail doc={docs[0]} size={32} />
                            </div>
                            <div className={styles['name']}>{docname(docs[0])}</div>
                            <div className={styles['metas']}>
                                <span className={styles['meta']}>
                                    {
                                        `${formatTime(docs[0].modified / 1000)}`
                                    }
                                </span>
                                {
                                    isDir(docs[0]) ?
                                        null :
                                        <span className={styles['meta']}>
                                            {`${formatSize(docs[0].size)}`}
                                        </span>
                                }</div>
                        </div>
                        :
                        null
                }
                {
                    docs.length > 1 && (
                        <div className={styles['infos']}>
                            {`${docs.length}${__('个文件')}`}
                        </div>
                    )
                }
                {
                    !!docs.length && (
                        <Grid
                            className={styles['grid']}
                            cols={5}
                        >
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf026'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    disabled={docs.length !== 1}
                                    onClick={e => this.trigger(e, onRequestInternalShare)}
                                />
                                <div className={classnames({ [styles['disabled']]: docs.length !== 1 })}>
                                    {__('内链共享')}
                                </div>
                            </div>
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf05c'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    disabled={docs.length !== 1 || fs.isEntryDoc(docs[0])}
                                    onClick={e => this.trigger(e, onRequestRename)}
                                />
                                <div className={classnames({ [styles['disabled']]: docs.length !== 1 || fs.isEntryDoc(docs[0]) })}>
                                    {__('重命名')}
                                </div>
                            </div>
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf000'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    disabled={fs.isEntryDoc(docs[0])}
                                    onClick={e => this.trigger(e, onRequestDelete)}
                                />
                                <div className={classnames({ [styles['disabled']]: fs.isEntryDoc(docs[0]) })}>
                                    {__('删除')}
                                </div>
                            </div>
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf02a'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    disabled={docs.length !== 1 || isDir(docs[0])}
                                    onClick={e => this.trigger(e, onRequestDownload)}
                                />
                                <div className={classnames({ [styles['disabled']]: docs.length !== 1 || isDir(docs[0]) })}>
                                    {__('下载')}
                                </div>
                            </div>
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf084'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    onClick={e => this.trigger(e, onRequestCopy)}
                                />
                                <div>
                                    {__('复制到')}
                                </div>
                            </div>
                            <div className={styles['item']}>
                                <UIIcon
                                    code={'\uf083'}
                                    size={'0.8rem'}
                                    className={styles['icon']}
                                    disabled={fs.isEntryDoc(docs[0])}
                                    onClick={e => this.trigger(e, onRequestMove)}
                                />
                                <div className={classnames({ [styles['disabled']]: fs.isEntryDoc(docs[0]) })}>
                                    {__('移动到')}
                                </div>
                            </div>
                        </Grid>
                    )
                }
                <div>
                    <LinkButton onClick={this.close.bind(this)} className={styles['close-button']}>{__('取消')}</LinkButton>
                </div>
            </Drawer>
        )
    }
}