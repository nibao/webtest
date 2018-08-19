import * as React from 'react'
import * as classnames from 'classnames'
import { last } from 'lodash'
import { Icon, EmptyResult } from '../../ui/ui.desktop'
import EntryDocs from './EntryDocs/component.mobile'
import List from './List/component.mobile'
import Crumbs from './Crumbs/component.mobile'
import ToolButtons from './ToolButtons/component.mobile'
import DocSelector2Base from './component.base'
import __ from './locale'
import * as loadingImg from './assets/images/loading.gif'
import * as uploadImg from './assets/images/upload.png'
import * as styles from './styles.mobile.css'

export default class DocSelector2 extends DocSelector2Base {
    render() {
        const { className, description, onCancel, onConfirm } = this.props
        const { crumbs } = this.state

        return (
            <div className={classnames(styles['container'], className)}>
                <Crumbs
                    className={styles['crumbs-area']}
                    crumbs={crumbs}
                    onCancel={onCancel}
                    onCrumbChange={this.load.bind(this)}
                />
                <div className={styles['docs']} >
                    <div className={styles['area']}>
                        <div className={styles['scroll-docs']}>
                            {
                                this.renderContent()
                            }
                        </div>
                    </div>
                </div>
                <ToolButtons
                    className={styles['tool-buttons-area']}
                    crumbs={crumbs}
                    description={description}
                    onConfirm={onConfirm}
                />
                )
            </div>
        )
    }

    renderContent() {
        const { loading, list, crumbs, viewsinfo, viewsOpen } = this.state
        const currentDir = last(crumbs)
        /**
         * 正在加载
         */
        if (loading) {
            return (
                <div style={{ textAlign: 'center', marginTop: 100 }}>
                    <Icon url={loadingImg} size={24} />
                </div>
            )
        }

        /**
         * 入口文档
         */
        if (currentDir === null) {
            return (
                <EntryDocs
                    list={{ dirs: list.dirs, files: [] }}
                    crumbs={crumbs}
                    viewsinfo={viewsinfo}
                    viewsOpen={viewsOpen}
                    onToggleViewOpen={this.toggleViewOpen.bind(this)}
                    onRequestOpenDir={this.load.bind(this)}
                />
            )
        }

        if (currentDir) {
            /**
             * 文件列表
             */
            return (
                <List
                    list={{ dirs: list.dirs, files: [] }}
                    crumbs={crumbs}
                    onRequestOpenDir={this.load.bind(this)}
                    EmptyComponent={
                        <div className={styles['empty-area']}>
                            <EmptyResult
                                details={__('该目录下没有文件夹')}
                                fontSize={15}
                                color={'#868686'}
                                size={64}
                                picture={uploadImg}
                            />
                        </div>}
                />
            )
        }

        return null
    }
}