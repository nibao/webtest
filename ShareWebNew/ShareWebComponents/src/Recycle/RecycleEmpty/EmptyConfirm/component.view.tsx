import * as React from 'react';
import * as classnames from 'classnames';
import { isEqual } from 'lodash';
import Panel from '../../../../ui/Panel/ui.desktop';
import Select from '../../../../ui/Select/ui.desktop'
import * as styles from '../styles.desktop';
import __ from '../locale';


const EmptyConfirmView: React.StatelessComponent<Components.Recycle.RecycleEmpty.Props> = function EmptyConfirmView({
    onCancel,
    maxHeight,
    emptyRecycle,
    durationSelection,
    handleSelectStrategyMenu
}) {
    let candidateDurations = [
        [30, __('一个月前')],
        [60, __('两个月前')],
        [90, __('三个月前')],
        [180, __('半年前')],
        [365, __('一年前')],
        [-1, __('全部')]
    ]

    return (
        <Panel>
            <Panel.Main>
                <div className={styles['strategy']}>
                    <div className={styles['strategy-box']}>
                        <span className={classnames(styles['attr-title'])}>{__('清空指定时间段的回收站数据：')}</span>
                        <Select
                            value={durationSelection}
                            width={105}
                            menu={{ width: 105, maxHeight }}
                            className={styles['strategy-selectmenu']}
                            onChange={(item) => handleSelectStrategyMenu(item)}
                        >
                            {
                                candidateDurations.map(([duration, text]) =>
                                    <Select.Option
                                        selected={isEqual(duration, durationSelection)}
                                        value={duration}
                                    >
                                        {
                                            text
                                        }
                                    </Select.Option>
                                )
                            }
                        </Select>
                    </div>
                    <div className={classnames(styles['strategy-tip'])}>
                        {
                            durationSelection === -1 ?
                                __('清空后，该回收站的所有文件数据将会无法恢复，请确认操作。')
                                :
                                __('该时间之前的文件数据都会被清除且无法恢复，请确认操作。')

                        }
                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button type="submit" onClick={() => emptyRecycle()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onCancel()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>

    )
}



export default EmptyConfirmView;
