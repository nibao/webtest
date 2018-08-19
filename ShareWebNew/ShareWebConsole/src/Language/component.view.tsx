import * as React from 'react';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import SelectMenu from '../../ui/SelectMenu/ui.desktop';
import { Languages } from '../../core/language/language';
import LanguageBase from './component.base';
import * as styles from './styles.view';

export default class Language extends LanguageBase {
    render() {
        const itemIcon = <UIIcon
            code={'\uf068'}
            size={16}
            color={'#757575'}
            className={styles['header-icon']}
        />
        const {
            languageList,
            currentLang,
        } = this.state;

        return (
            languageList.length > 1 ?
                <SelectMenu
                    value={currentLang}
                    label={
                        <div
                            className={styles['header-layout']}
                        >
                            <UIIcon
                                code={'\uf073'}
                                size={16}
                                color={'#757575'}
                                className={styles['header-icon']}
                            />
                            <span className={styles['header-item']}>
                                {Languages.filter(({ title, language }) => language === currentLang)[0].title}
                            </span>
                            <UIIcon
                                code={'\uf04c'}
                                size={16}
                                color={'#757575'}
                                className={styles['header-icon']}
                            />
                        </div>
                    }
                    anchorOrigin={['right', 'bottom']}
                    targetOrigin={['right', 'top']}
                    closeWhenMouseLeave={true}
                    onChange={(language) => { this.switchLanguages(language) }}
                >
                    {
                        languageList.map(
                            ({ title, language }) =>
                                <SelectMenu.Option
                                    key={language}
                                    value={language}
                                    label={title} />

                        )
                    }
                </SelectMenu>
                : null
        )
    }
}