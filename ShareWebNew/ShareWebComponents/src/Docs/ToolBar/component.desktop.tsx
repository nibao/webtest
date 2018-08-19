import * as React from 'react'
import { every, last } from 'lodash'
import * as classnames from 'classnames'
import ToolBarBase from './component.base'
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop'
import UIIcon from '../../../ui/UIIcon/ui.desktop'
import Button from '../../../ui/Button/ui.desktop'
import IconGroup from '../../../ui/IconGroup/ui.desktop'
import SelectMenu from '../../../ui/SelectMenu/ui.desktop'
import { isBrowser, Browser, useHTTPS } from '../../../util/browser/browser';
import Upload from '../../Upload/component.desktop'
import Thumbnail from '../../Thumbnail/component.desktop'
import { SortRule } from '../helper'
import { isDir } from '../../../core/docs/docs'
import __ from './locale'
import * as downloadIcon from '../assets/images/downloadicon.png'
import * as uploadIcon from '../assets/images/uploadicon.png'
import * as styles from './styles.desktop.css'

// IE8/IE9 在HTTPS下不支持 @font-face，使用fallback图片代替，同时设置字体颜色为#505050
const FALLBACKED = isBrowser({ app: Browser.MSIE, version: 8 }) || (useHTTPS() && isBrowser({ app: Browser.MSIE, version: 9 }));
export default class ToolBar extends ToolBarBase {

    render() {
        const {
            crumbs, list, selections, sortRule,
            onToggleSelectAll,
            onRequestManageGroup,
            onRequestCreateDir,
            onRequestDownload,
            onRequestCopyTo,
            onRequestMoveTo,
            onRequestDelete,
            onRequestEditTags,
            onRequestReadSize,
            onToggleSortRule
        } = this.props
        const currentDir = last(crumbs)
        const docs = [...list.dirs, ...list.files]
        const { canUploadDirectory } = this.state
        return (
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    <CheckBoxOption
                        disabled={!docs.length}
                        onClick={onToggleSelectAll}
                        checked={docs.length && docs.length === selections.length}
                    ></CheckBoxOption>
                    {
                        currentDir === null && selections.length === 0 ?
                            <Button
                                icon={'\uf02d'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestManageGroup()}
                            >
                                {__('群组管理')}
                            </Button> : null
                    }
                    <div className={classnames(styles['upload'], { [styles['show']]: currentDir !== null && selections.length === 0 })}>
                        <Upload.Picker dest={currentDir} className={styles['upload-button']}>
                            <UIIcon
                                code={'\uf045'}
                                color={'#fff'}
                                size={16}
                                fallback={FALLBACKED ? uploadIcon : undefined}
                            />
                            <span className={styles['upload-label']}>{__('上传')}</span>
                            {
                                canUploadDirectory ?
                                    <UIIcon code={'\uf01a'} color={'#fff'} size={16} /> :
                                    null
                            }
                        </Upload.Picker>
                        {
                            canUploadDirectory ?
                                <ul className={styles['upload-menu']}>
                                    <li>
                                        <Upload.Picker
                                            dest={currentDir}
                                            className={styles['upload-menu-button']}
                                        >
                                            <Thumbnail size={24} className={styles['upload-icon']} />
                                            {__('上传文件')}
                                        </Upload.Picker>
                                    </li>
                                    <li>
                                        <Upload.Picker
                                            dest={currentDir}
                                            className={styles['upload-menu-button']}
                                            directory={true}
                                        >
                                            <Thumbnail type="DIR" size={24} className={styles['upload-icon']} />
                                            {__('上传文件夹')}
                                        </Upload.Picker>
                                    </li>
                                </ul> :
                                null
                        }
                    </div>
                    {
                        currentDir !== null && selections.length === 0 ?
                            <Button
                                icon={'\uf089'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestCreateDir()}
                            >
                                {__('新建文件夹')}
                            </Button> : null
                    }
                    {
                        selections.length ?
                            <Button
                                icon={'\uf02a'}
                                fallback={FALLBACKED ? downloadIcon : undefined}
                                theme="dark"
                                className={classnames(styles['button'])}
                                onClick={() => onRequestDownload(selections)}
                            >
                                {__('下载')}
                            </Button> : null
                    }
                    {
                        selections.length ?
                            <Button
                                icon={'\uf084'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestCopyTo(selections)}
                            >
                                {__('复制到')}
                            </Button> : null
                    }
                    {
                        currentDir !== null && selections.length ?
                            <Button
                                icon={'\uf083'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestMoveTo(selections)}
                            >
                                {__('移动到')}
                            </Button> : null
                    }
                    {
                        currentDir !== null && selections.length ?
                            <Button
                                icon={'\uf000'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestDelete(selections)}
                            >
                                {__('删除')}
                            </Button> : null
                    }
                    {
                        selections.length && every(selections, doc => !isDir(doc)) ?
                            <Button
                                icon={'\uf049'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestEditTags(selections)}
                            >
                                {__('标签')}
                            </Button> : null
                    }
                    {
                        selections.length ?
                            <Button
                                icon={'\uf053'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestReadSize(selections)}
                            >
                                {__('查看大小')}
                            </Button> : null
                    }
                </div>
                <IconGroup className={styles['view-actions']}>
                    <SelectMenu
                        value={sortRule}
                        label={<IconGroup.Item code={'\uf08e'} size={16} />}
                        anchorOrigin={['right', 'bottom']}
                        targetOrigin={['right', 'top']}
                        closeWhenMouseLeave={true}
                        onChange={onToggleSortRule}
                    >
                        <SelectMenu.Option value={SortRule.NameUp} label={__('按文件名升序')} />
                        <SelectMenu.Option value={SortRule.NameDown} label={__('按文件名降序')} />
                        <SelectMenu.Option value={SortRule.SizeUp} label={__('按文件大小升序')} />
                        <SelectMenu.Option value={SortRule.SizeDown} label={__('按文件大小降序')} />
                        <SelectMenu.Option value={SortRule.ModifiedUp} label={__('按修改时间升序')} />
                        <SelectMenu.Option value={SortRule.ModifiedDown} label={__('按修改时间降序')} />
                        <SelectMenu.Option value={SortRule.TypeUp} label={__('按文件类型升序')} />
                        <SelectMenu.Option value={SortRule.TypeDown} label={__('按文件类型降序')} />
                    </SelectMenu>
                </IconGroup>
            </div>
        )
    }
}