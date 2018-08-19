import * as React from 'react';
import WebComponent from '../webcomponent';
import { getLanguageList, getEnvLanguage, setLanguage, getCurrentLang } from '../../core/language/language';
import { ECMSManagerClient } from '../../core/thrift2/thrift2';

export default class LanguageBase extends WebComponent<Components.Language.Props, Components.Language.State> {
    static defaultProps = {
    }

    state = {
        languageList: [],
        currentLang: '',
        appSysStatus: false
    }

    componentWillMount() {
        this.getState();
    }

    /**
     * 获取应用服务状态
     */
    async getState() {
        this.setState({
            appSysStatus: await ECMSManagerClient.get_app_master_node_ip() === '' ? // 获取应用系统主节点ip (返回为空字符串""，表示当前应用服务不可用)
                false : 
                true
        }, () => {
            this.getLanguageConfig();
        })
    }

    /**
     * 获取语言资源选项
     */
    async getLanguageConfig() {
        if (this.state.appSysStatus) {
            await getCurrentLang();
        }
        this.setState({
            languageList: this.state.appSysStatus ? await getLanguageList() : [],
            currentLang: getEnvLanguage()
        })
    }

    /**
     * 切换语言
     */
    protected switchLanguages(language) {
        setLanguage(language);
        location.reload();
        this.setState({
            currentLang: language
        })
    }
}