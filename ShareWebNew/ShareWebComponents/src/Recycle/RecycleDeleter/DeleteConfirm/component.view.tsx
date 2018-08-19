import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import { docname } from '../../../../core/docs/docs';
import { findType } from '../../../../core/extension/extension'
import Panel from '../../../../ui/Panel/ui.desktop';
import Text from '../../../../ui/Text/ui.desktop';
import Thumbnail from '../../../Thumbnail/component.desktop';
import * as styles from '../styles.desktop';
import __ from '../locale';


const DeleteConfirmView: React.StatelessComponent<Components.Recycle.RecycleDeleter.Props> = function DeleteConfirmView({
    recycleDeleteDocs,
    onCancel = noop,
    deleteFiles = noop,
}) {
    let firstLineTip = '';
    let secondLineTip = '';
    let fileType = '';
    let thirdLineTip = '';
    if (recycleDeleteDocs.length === 1) {
        // 单选 |-> 文件 | 文件夹
        if (recycleDeleteDocs[0].size !== -1) {
            firstLineTip = __('您确认要删除选中的文件吗？')
            secondLineTip = docname(recycleDeleteDocs[0])
            fileType = findType(docname(recycleDeleteDocs[0]))
            thirdLineTip = __('从回收站删除后，该文件将无法恢复。')
        } else {
            firstLineTip = __('您确认要删除选中的文件夹吗？')
            secondLineTip = docname(recycleDeleteDocs[0])
            fileType = 'DIR'
            thirdLineTip = __('从回收站删除后，该文件夹将无法恢复。')
        }
    } else {
        // 多选 |-> 文件 | 文件夹 | 文件文件夹混合
        let fileNum = 0, dirNum = 0;
        thirdLineTip = __('从回收站删除后，这些文件数据将无法恢复。')
        recycleDeleteDocs.map((doc) => {
            if (doc.size === -1) {
                dirNum++;
            } else {
                fileNum++;
            }
        })

        if (recycleDeleteDocs.length === dirNum) {
            firstLineTip = __('您确认要删除选中的文件夹吗？')
            secondLineTip = __('已选中${dirNum}文件夹。', { dirNum: dirNum })
            fileType = 'DIR'

        } else if (recycleDeleteDocs.length === fileNum) {
            firstLineTip = __('您确认要删除选中的文件吗？')
            secondLineTip = __('已选中${fileNum}文件。', { fileNum: fileNum })
            fileType = 'UNKNOWN'
        } else {
            firstLineTip = __('您确认要删除选中的对象吗？')
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
                    <div className={classnames(styles['third-line'], styles['red'])}>
                        {
                            thirdLineTip
                        }
                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button type="submit" onClick={() => deleteFiles()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onCancel()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}



export default DeleteConfirmView;
