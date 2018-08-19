/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop, reduce, map, flatten } from 'lodash';
import Button from '../../../ui/Button/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import InlineButton from '../../../ui/InlineButton/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import { formatSize } from '../../../util/formatters/formatters';
import Thumbnail from '../../Thumbnail/component.desktop'
import * as styles from '../styles.client.css';
import __ from '../locale';

/**
 * 将未同步元数据转换成带有absPath的数组
 */
function convertUnsyncs(unSyncs) {
    return flatten(map(unSyncs, ({ path, unsyncDetail }) => {
        return map(unsyncDetail, detail => {
            return {
                ...detail, absPath: path + '\\' + detail.relPath
            }
        })
    }))
}

/**
 * 未同步数据列表
 */
export default function Unsync({
    unSyncs = [],
    unSyncsNum = 0,
    isSelectDir = false,
    uploadUnsync = noop,
    selectDir = noop,
    transferUnsyc = noop,
    onSelectDir = noop,
    openDirByAbsPath = noop
}: Components.Sync.Unsync.Props) {
    return (
        <div className={styles['head']}>
            <div className={styles['left']}>
                {
                    __('共有 ${total} 个未同步文档', { total: unSyncsNum === 0 ? '0' : unSyncsNum })


                }
            </div>
            <div className={styles['right']} >
                <Button
                    disabled={unSyncsNum === 0}
                    className={styles['button']}
                    onClick={() => uploadUnsync()}
                >
                    {__('全部上传')}
                </Button>

                <Button
                    disabled={unSyncsNum === 0}
                    className={styles['button']}
                    onClick={() => selectDir()}
                >
                    {__('全部转移')}
                </Button>
            </div>

            <div className={styles['content']}>
                {
                    convertUnsyncs(unSyncs).map(info => {
                        return (
                            <div className={styles['item']}>
                                <div className={styles['icon']}>
                                    <UIIcon
                                        code={'\uf065'}
                                        size={16}
                                        color={'#757575'}
                                    />
                                </div>
                                <div className={styles['thumbnail-container']}>
                                    <Thumbnail
                                        doc={{ docname: info.name, size: info.size, isDir: info.isDir }}
                                        size={32}
                                    />
                                </div>
                                <div className={styles['name']}>
                                    <Text className={styles['text']}>{info.name}</Text>
                                </div>
                                <div className={styles['size']}>
                                    {
                                        info.size !== 1 && info.isDir !== true ?
                                            <Text>{formatSize(info.size)}</Text>
                                            :
                                            null
                                    }
                                </div>
                                <div className={styles['path']}>
                                    <Text className={styles['text']}>{info.absPath}</Text>
                                </div>
                                <div className={styles['right']}>
                                    <InlineButton
                                        code={'\uf074'}
                                        title={__('打开所在位置')}
                                        onClick={openDirByAbsPath.bind(this, info.absPath)}
                                    />
                                    <InlineButton
                                        code={'\uf045'}
                                        title={__('重新上传')}
                                        onClick={uploadUnsync.bind(this, [info.absPath])}
                                    />
                                    <InlineButton
                                        code={'\uf032'}
                                        title={__('转移到其他位置')}
                                        onClick={selectDir.bind(this, [info.absPath])}
                                    />
                                </div>
                            </div>
                        )
                    })
                }

                <input
                    id="ascomponentselectdirpicker"
                    type="file"
                    ref={ref => {
                        if (ref) {
                            ref.setAttribute('nwdirectory', '')
                            if (isSelectDir) {
                                onSelectDir()
                                ref.click()
                                ref.value = ''
                            }
                        }
                    }}
                    onChange={transferUnsyc.bind(this)}
                    style={{ display: 'none' }}
                />
            </div>
        </div >
    )
}
