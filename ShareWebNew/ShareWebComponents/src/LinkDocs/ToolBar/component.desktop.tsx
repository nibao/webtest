import * as React from 'react'
import * as classnames from 'classnames'
import { last, noop } from 'lodash'
import { CheckBoxOption, Button, UIIcon } from '../../../ui/ui.desktop'
import Upload from '../../Upload/component.desktop'
import * as downloadIcon from '../assets/downloadicon.png'
import * as uploadIcon from '../assets/uploadicon.png'
import * as styles from './styles.desktop.css'
import __ from './locale'

const ToolBar: React.StatelessComponent<Components.LinkDocs.ToolBar.Props> = function ({
    list = {
    dirs: [],
    files: []
},
    selections = [],
    crumbs = [],
    uploadEnable = false,
    downloadEnable = false,
    onToggleSelectAll = noop,
    onRequestDownload = noop,
    onRequrestSaveTo = noop,
}) {
    const docs = [...list.dirs, ...list.files]
    const currentDir = last(crumbs)

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                {
                    downloadEnable && (
                        <CheckBoxOption
                            className={styles['select-all']}
                            disabled={!docs.length}
                            onClick={onToggleSelectAll}
                            checked={docs.length && docs.length === selections.length}
                        >
                            {(uploadEnable || (selections && selections.length && downloadEnable)) ? '' : __('全选')}
                        </CheckBoxOption>
                    )
                }
                {
                    uploadEnable && (
                        <div className={classnames(
                            styles['upload'],
                            { [styles['show']]: !selections.length }
                        )}>
                            <Upload.Picker
                                dest={currentDir}
                                className={styles['upload-button']}
                            >
                                <UIIcon
                                    code={'\uf045'}
                                    color={'#fff'}
                                    size={16}
                                    fallback={uploadIcon}
                                />
                                <span className={styles['upload-label']}>
                                    {__('上传')}
                                </span>
                            </Upload.Picker>
                        </div>
                    )
                }
                {
                    (selections && selections.length && downloadEnable) ? (
                        [
                            <Button
                                icon={'\uf02a'}
                                theme="dark"
                                fallback={downloadIcon}
                                className={classnames(styles['button'])}
                                onClick={() => onRequestDownload(selections)}
                            >
                                {__('下载')}
                            </Button>,
                            <Button
                                icon={'\uf032'}
                                className={classnames(styles['button'])}
                                onClick={() => onRequrestSaveTo(selections)}
                            >
                                {__('转存到我的云盘')}
                            </Button>
                        ]
                    )
                        :
                        null
                }
            </div>
        </div>
    )
}

export default ToolBar