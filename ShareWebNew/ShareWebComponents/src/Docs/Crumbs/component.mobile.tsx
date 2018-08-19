import * as React from 'react'
import { last, noop } from 'lodash'
import * as classnames from 'classnames'
import CrumbsBase from './component.base'
import { ClassName } from '../../../ui/helper'
import AppBar from '../../../ui/AppBar/ui.mobile'
import UIIcon from '../../../ui/UIIcon/ui.mobile'
import LinkButton from '../../../ui/LinkButton/ui.mobile'
import PopMenu from '../../../ui/PopMenu/ui.mobile'
import { docname } from '../../../core/docs/docs'
import UploadPicker from '../../Upload/Picker/component.mobile'
import Thumbnail from '../../Thumbnail/component.mobile'
import { subscribe, EventType } from '../../../core/upload/upload'
import __ from './locale'
import * as styles from './styles.mobile.css'

export default class Crumbs extends CrumbsBase {

    close: () => void = noop

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.closePopMenu = this.closePopMenu.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = [
            subscribe(EventType.UPLOAD_START, this.closePopMenu)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(fn => fn())
    }

    /**
     * 
     * @param close 
     */
    protected closePopMenu() {
        this.close()
    }

    /**
     * 新建文件夹
     */
    private createDir(doc: any) {
        setTimeout(() => {
            this.closePopMenu()
        }, 100)

        this.props.onRequestCreateDir(doc)
    }


    render() {
        const { className, selecting, selections, list, onSelectStart, onSelectEnd, onToggleSelectAll, crumbs } = this.props
        const currentDir = last(crumbs)
        const docs = [...list.dirs, ...list.files]
        return (
            <AppBar className={classnames(styles['container'], className)}>
                <div className={styles['left']}>
                    {
                        selecting ?
                            <LinkButton
                                className={classnames(styles['link-button'], ClassName.Color)}
                                onClick={onToggleSelectAll}
                            >
                                {docs.length && docs.length === selections.length ? __('全不选') : __('全选')}
                            </LinkButton> :
                            <UIIcon
                                code={crumbs.length > 1 ? '\uf04d' : ''}
                                size={'1rem'}
                                className={classnames(styles['icon'], ClassName.Color)}
                                onClick={this.loadParent.bind(this)}
                            />
                    }
                </div>
                <div className={styles['title']}>{currentDir ? docname(currentDir) : __('文档')}</div>
                {
                    currentDir ?
                        <div className={styles['right']}>
                            {
                                selecting ?
                                    <LinkButton
                                        className={classnames(styles['link-button'], ClassName.Color)}
                                        onClick={onSelectEnd}>
                                        {__('取消')}
                                    </LinkButton>
                                    :
                                    [
                                        <PopMenu
                                            anchorOrigin={['right', 'bottom']}
                                            targetOrigin={['right', 'top']}
                                            trigger={
                                                <UIIcon
                                                    code={'\uf089'}
                                                    size={20}
                                                    className={classnames(styles['icon'], ClassName.Color)}
                                                />
                                            }
                                            triggerEvent="click"
                                            freezable={true}
                                            onRequestCloseWhenClick={close => this.close = close}
                                            onRequestCloseWhenBlur={close => setTimeout(close, 100)}
                                        >
                                            <PopMenu.Item>
                                                <div
                                                    className={styles['item-area']}
                                                    onClick={() => this.createDir(currentDir)}
                                                >
                                                    <UIIcon
                                                        className={styles['item-icon']}
                                                        code={'\uf0d2'}
                                                        size={20}
                                                    />
                                                    {__('新建文件夹')}
                                                </div>
                                            </PopMenu.Item>
                                            <PopMenu.Item>
                                                <UploadPicker
                                                    dest={currentDir}
                                                    className={classnames(styles['upload-picker'], styles['item-area'])}
                                                    multiple={false}
                                                >
                                                    <UIIcon
                                                        className={styles['item-icon']}
                                                        code={'\uf045'}
                                                        size={20}
                                                    />
                                                    {__('上传')}
                                                </UploadPicker>
                                            </PopMenu.Item>
                                        </PopMenu>,
                                        <UIIcon
                                            code={'\uf07c'}
                                            size={24}
                                            className={classnames(styles['icon'], ClassName.Color)}
                                            onClick={onSelectStart}
                                        />
                                    ]
                            }
                        </div> :
                        null
                }
            </AppBar>
        )
    }
}