import * as React from 'react';
import * as classnames from 'classnames';
import Panel from '../../../../ui/Panel/ui.desktop';
import CheckBoxOption from '../../../../ui/CheckBoxOption/ui.desktop';
import __ from '../locale';
import * as styles from '../styles.desktop';


const DuplicateConfirmView: React.StatelessComponent<Components.Recycle.DuplicateConfirm.Props> = function DuplicateConfirmView({
    renameDoc,
    suggestName,
    handleCheckSkip,
    handleUnCheckSkip,
    onConfirmRename,
    onCancel
}) {

    return (
        <Panel>
            <Panel.Main>
                <div className={styles['dialog']}>
                    <div className={styles['first-line']}>
                        {
                            __('原路径下存在"${originalName}"', { originalName: renameDoc['name'] })
                        }
                    </div>
                    <div className={classnames(styles['second-line'], styles['red'])}>
                        {
                            __('当前对象将自动重命名为"${suggestName}"', { suggestName: suggestName['name'] })
                        }
                    </div>
                    <div className={styles['third-line']}>
                        <CheckBoxOption
                            onCheck={() => { handleCheckSkip(); }}
                            onUncheck={() => { handleUnCheckSkip(); }}
                        >
                            {
                                __('跳过之后所有相同的冲突提示')
                            }
                        </CheckBoxOption>

                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button type="submit" onClick={() => onConfirmRename()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onCancel()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}



export default DuplicateConfirmView;
