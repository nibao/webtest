import * as React from 'react';
import { noop } from 'lodash';
import { getLanguageList, getCurrentLang } from '../../core/language/language';

export default class LanguageSwitchBase extends React.Component<Components.LanguageSwitch.Props, Components.LanguageSwitch.State>{
    static defaultProps = {
        onSelectLanguage: noop
    }

    state = {
        list: [],
        current: {
            language: 'zh-cn',
            title: '简体中文'
        }
    }

    componentDidMount() {
        Promise.all([getLanguageList(), getCurrentLang()]).then(([list, current]) => {
            this.setState({
                list,
                current
            })
        })
    }

    async handleSetlang(lang) {
        this.props.onSelectLanguage(lang)
    }
}
