import * as React from 'react';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import SelectMenu from '../../ui/SelectMenu/ui.desktop';
import LanguageSwitchBase from './component.base';
import * as styles from './styles.desktop.css';

export default class LanguageSwitch extends LanguageSwitchBase {
    render() {
        const { list, current } = this.state;
        return (
            list.length > 1 ? (
                <SelectMenu
                    className={styles['container']}
                    value={current.language}
                    freezable={false}
                    label={
                        <div className={styles['current']}>
                            <UIIcon
                                size={16}
                                code="\uf073"
                                className={styles['international-icon']}
                            />
                            <span className={styles['language']}>{current.title}</span>
                            <UIIcon code="\uf04c" />
                        </div>
                    }
                    anchorOrigin={['center', 50]}
                    targetOrigin={['center', 0]}
                    triggerEvent="mouseover"
                    closeWhenMouseLeave={true}
                    watch={true}
                >
                    {
                        list.map((item, index) => {
                            return (
                                <SelectMenu.Option
                                    value={item.language}
                                    label={item.title}
                                    onClick={() => this.handleSetlang(item.language)}
                                />
                            )
                        })
                    }
                </SelectMenu>
            ) : null
        )

    }
}