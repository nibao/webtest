import * as React from 'react'
import * as classnames from 'classnames';
import { noop } from 'lodash'
import { formatTime } from '../../../util/formatters/formatters'
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import { downloadFile } from '../../../core/docretain/docretain'
import __ from './locale'
import * as styles from './styles.view';

export default function ViewVersion({
    onClose = noop,
    prefix = '',
    useHttps = true,
    current,
    reqHost = ''
}) {

    return (
        <Dialog
            title={__('查看版本')}
            width={670}
            onClose={onClose}
            >
            <Panel>
                <Panel.Main>
                    <div className={styles['container']}>
                        <DataGrid
                            className={styles['data-grid']}
                            height={400}
                            data={current.versions}
                            select={true}
                            >
                            <DataGrid.Field
                                field="name"
                                width="120"
                                label={__('文件名')}
                                formatter={(name) => (
                                    <Text className={styles['text']}>{name}</Text>
                                )}
                                />
                            <DataGrid.Field
                                field="editor"
                                width="80"
                                label={__('修改者')}
                                formatter={(editor) => (
                                    <Text className={classnames(styles['text'], styles['margin'])}>{editor}</Text>
                                )}
                                />
                            <DataGrid.Field
                                field="modified"
                                width="120"
                                label={__('修改时间')}
                                formatter={(modified) => (
                                    <Text className={styles['text']}>{formatTime(modified / 1000, 'yyyy/MM/dd HH:mm')}</Text>
                                )}
                                />
                            <DataGrid.Field
                                field="name"
                                width="50"
                                label={__('操作')}
                                formatter={(name, {rev, modified}) => (
                                    <UIIcon
                                        className={classnames(styles['icon'], styles['margin'])}
                                        title={__('下载')}
                                        size={16}
                                        code={'\uf02a'}
                                        onClick={() => downloadFile({
                                            docId: current.docId,
                                            rev,
                                            name,
                                            prefix,
                                            useHttps,
                                            reqHost,
                                            modifiedTime: modified,
                                            retained: current.retained,
                                            path: current.path
                                        })}
                                        />
                                )}
                                />
                        </DataGrid>
                    </div>
                </Panel.Main>
            </Panel>
        </Dialog>
    )
}