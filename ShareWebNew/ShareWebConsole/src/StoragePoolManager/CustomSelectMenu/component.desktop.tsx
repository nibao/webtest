import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../../ui/Button/ui.desktop';
import PopMenu from '../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import CustomSelectMenuBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class CustomSelectMenu extends CustomSelectMenuBase {

    render() {

        let { label, className, candidateItems, labelClassName, btnClassName, popmenuClassName, disabled } = this.props;

        let { selectMenuAnchor, showSelectMenu, selectValue, clickStatus } = this.state;

        return (
            <div className={classnames(styles['select-menu'], className)}>
                <span className={classnames(styles['attr-title'], labelClassName)}>{label}{__('：')}</span>
                <Button
                    className={classnames(styles['select-menu-btn'], { [styles['clicked']]: clickStatus }, btnClassName)}
                    onClick={this.handleClickSelectMenuBtn.bind(this)}
                    disabled={disabled}
                >
                    {selectValue.name}
                    <UIIcon
                        className={classnames(styles['expand-icon'])}
                        code={'\uF04C'}
                        size="17px"
                    >
                    </UIIcon>
                </Button>

                <PopMenu
                    anchor={selectMenuAnchor}
                    anchorOrigin={['left', 'bottom']}
                    targetOrigin={['left', 'top']}
                    className={classnames(styles['condition-select-menu'], popmenuClassName)}
                    open={showSelectMenu}
                    watch={true}
                    freezable={false}
                >
                    {

                        candidateItems.map((item) =>
                            <PopMenuItem
                                label={item.name}
                                className={styles['condition-select-items']}
                                onClick={(e) => { this.handleClickCandidateItem(e, item) }}
                            >
                            </PopMenuItem>
                        )
                    }

                </PopMenu>


            </div >
        )
    }





}