import * as React from 'react';
import * as classnames from 'classnames';
import { docname } from '../../../../core/docs/docs';
import { findType } from '../../../../core/extension/extension';
import Panel from '../../../../ui/Panel/ui.desktop';
import Text from '../../../../ui/Text/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import { shrinkText } from '../../../../util/formatters/formatters';
import Thumbnail from '../../../Thumbnail/component.desktop';
import __ from '../locale';
import * as styles from '../styles.desktop';


const RestoreConfirmView: React.StatelessComponent<Components.Recycle.RestoreConfirm.Props> = function RestoreConfirmView({
    recycleRestoreDocs,
    onConfirmRestore,
    onCancel
}) {
    let firstLineTip = '';
    let secondLineTip = '';
    let fileType = '';
    let thirdLineTip = '';
    if (recycleRestoreDocs.length === 1) {
        // 单选 |-> 文件 | 文件夹
        if (recycleRestoreDocs[0].size !== -1) {
            firstLineTip = __('您确认要还原选中的文件吗？')
            secondLineTip = docname(recycleRestoreDocs[0])
            fileType = findType(docname(recycleRestoreDocs[0]))
            thirdLineTip = recycleRestoreDocs[0].path.slice(6)
        } else {
            firstLineTip = __('您确认要还原选中的文件夹吗？')
            secondLineTip = docname(recycleRestoreDocs[0])
            fileType = 'DIR'
            thirdLineTip = recycleRestoreDocs[0].path.slice(6)
        }
    } else {
        // 多选 |-> 文件 | 文件夹 | 文件文件夹混合
        let fileNum = 0, dirNum = 0;
        recycleRestoreDocs.map((doc) => {
            if (doc.size === -1) {
                dirNum++;
            } else {
                fileNum++;
            }
        })

        if (recycleRestoreDocs.length === dirNum) {
            firstLineTip = __('您确认要还原选中的文件夹吗？')
            secondLineTip = __('已选中${dirNum}文件夹。', { dirNum: dirNum })
            fileType = 'DIR'

        } else if (recycleRestoreDocs.length === fileNum) {
            firstLineTip = __('您确认要还原选中的文件吗？')
            secondLineTip = __('已选中${fileNum}文件。', { fileNum: fileNum })
            fileType = 'UNKNOWN'
        } else {
            firstLineTip = __('您确认要还原选中的对象吗？')
            secondLineTip = __('已选中${dirNum}文件夹，${fileNum}文件。', { dirNum: dirNum, fileNum: fileNum })
            fileType = 'UNKNOWN'

        }
    }
    return (
        <Panel>
            <Panel.Main>
                <div className={styles['dialog']}>
                    <div className={styles['first-line']}>
                        {
                            firstLineTip
                        }
                    </div>
                    <div className={styles['second-line']}>
                        <Thumbnail
                            type={fileType}
                            size={32}
                        />
                        <Text className={styles['text-line']}>
                            {
                                secondLineTip
                            }
                        </Text>
                    </div>
                    <div
                        className={styles['third-line']}
                    >
                        <Title content={thirdLineTip}>
                            {
                                thirdLineTip === '' ?
                                    null
                                    :
                                    __('原位置：${path}', {
                                        path: thirdLineTip
                                    })
                            }
                        </Title>
                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button type="submit" onClick={() => onConfirmRestore()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onCancel()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}


// path: shrinkText(thirdLineTip, { limit: 295 })
export default RestoreConfirmView;
