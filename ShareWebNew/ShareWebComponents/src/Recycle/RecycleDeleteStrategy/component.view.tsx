import * as React from 'react';
import * as classnames from 'classnames';
import { noop, isEqual } from 'lodash';
import Panel from '../../../ui/Panel/ui.desktop';
import Select from '../../../ui/Select/ui.desktop'
import Thumbnail from '../../Thumbnail/component.desktop';
import * as styles from './styles.desktop';
import __ from './locale';


const RecycleDeleteStrategyView: React.StatelessComponent<Components.Recycle.RecycleDeleteStrategy.Props> = function RecycleDeleteStrategyView({
    maxHeight = 200,
    durationSelection,
    isSelectionChange,
    onStrategyClose = noop,
    handleSelectStrategyMenu = noop,
    handleConfirmChangeDeleteStrategy = noop,

}) {

    let candidateDurations = [
        [30, __('一个月')],
        [60, __('两个月')],
        [90, __('三个月')],
        [180, __('半年')],
        [365, __('一年')],
        [-1, __('永久保留')]
    ]

    return (
        <Panel>
            <Panel.Main>
                <div className={styles['strategy']}>
                    <div className={styles['strategy-box']}>
                        <span className={classnames(styles['attr-title'])}>{__('设置回收站数据保留时间为：')}</span>
                        <Select
                            value={durationSelection}
                            width={100}
                            menu={{ width: 100, maxHeight }}
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
                            isSelectionChange && durationSelection !== -1 ?
                                __('超过该时间的历史数据都会被自动清除，请确认操作。')
                                :
                                null

                        }
                    </div>
                </div>
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button disabled={!isSelectionChange} type="submit" onClick={() => handleConfirmChangeDeleteStrategy()}>{__('确定')}</Panel.Button>
                <Panel.Button onClick={() => onStrategyClose()}>{__('取消')}</Panel.Button>
            </Panel.Footer>
        </Panel>
    )
}



export default RecycleDeleteStrategyView;
