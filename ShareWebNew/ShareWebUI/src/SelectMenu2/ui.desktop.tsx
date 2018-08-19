import * as React from 'react';
import * as classnames from 'classnames';
import { isEqual } from 'lodash';
import PopMenuItem from '../PopMenu.Item/ui.desktop';
import TriggerPopMenu from '../TriggerPopMenu/ui.desktop';
import { decorateText } from '../../util/formatters/formatters';
import SelectMenuBase from './ui.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class SelectMenu extends SelectMenuBase {

    render() {

        let { label, className, candidateItems } = this.props;

        let { selectValue, hover } = this.state;

        return (
            <div className={classnames(styles['select-menu'], className)}>
                <span className={styles['attr-title']}>{label}{__('：')}</span>

                <TriggerPopMenu
                    popMenuClassName={styles['condition-select-menu']}
                    title={selectValue.name}
                    label={decorateText(selectValue.name, { limit: 20 })}
                    onRequestCloseWhenBlur={close => this.handleCloseMenu(close)}
                    onRequestCloseWhenClick={close => close()}
                    timeout={150}
                >
                    {

                        candidateItems.map((item) =>
                            <PopMenuItem
                                label={item.name}
                                className={classnames(styles['condition-select-items'], { [styles['selected']]: isEqual(item, selectValue) && hover })}
                                labelClassName={classnames({ [styles['label-selected']]: isEqual(item, selectValue) && hover })}
                                onClick={(e) => { this.handleClickCandidateItem(e, item) }}
                                onMouseEnter={() => { this.handleMouseEnter() }}
                            >
                            </PopMenuItem>
                        )
                    }
                </TriggerPopMenu>


            </div>
        )
    }





}