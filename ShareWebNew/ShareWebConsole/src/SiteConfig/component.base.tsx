import * as React from 'react';
import WebComponent from '../webcomponent';
import '../../gen-js/ShareMgnt_types';

export default class SiteConfigBase extends WebComponent<Console.SiteConfig.Props, Console.SiteConfig.State> {
    static contextTypes = {
        toast: React.PropTypes.any
    }

    static defaultProps = {

    }

    state = {
        currentAppPorts: {
            webClientHttps: '',
            webClientHttp: '',
            objStorageHttps: '',
            objStorageHttp: ''
        },
        oldAppPorts: {
            webClientHttps: '',
            webClientHttp: '',
            objStorageHttps: '',
            objStorageHttp: '',
        }
    }

    /**
     * 当 AppConfig 组件中 webClient https/http 更改成功后,向父组件 SiteConfig 抛出的事件
     * @param webClientHttps 最新状态的 webClientHttps 值
     * @param webClientHttp 最新状态的 webClientHttp 值
     * @param oldWebClientHttps 最新一次保存成功的 webClientHttps 值
     * @param oldWebClientHttp 最新一次保存成功的 webClientHttp 值
     */
    protected changeAppConfigWebClientPorts(webClientHttps, webClientHttp, oldWebClientHttps, oldWebClientHttp) {
        const { currentAppPorts, oldAppPorts } = this.state

        this.setState({
            currentAppPorts: {
                ...currentAppPorts,
                webClientHttps: webClientHttps,
                webClientHttp: webClientHttp
            },
            oldAppPorts: {
                ...oldAppPorts,
                webClientHttps: oldWebClientHttps,
                webClientHttp: oldWebClientHttp
            }
        })

        if (this.refs['fireWallConfig']) {
            this.refs['fireWallConfig'].updateFireWallRules(this.state.oldAppPorts, this.state.currentAppPorts)
        }
    }

    /**
     * 当 AppConfig 组件中 对象存储 https/http 更改成功后,向父组件 SiteConfig 抛出的事件
     * @param objStorageHttps 最新状态的 对象存储 Https 值
     * @param objStorageHttp 最新状态的 对象存储 Http 值
     * @param oldObjStorageHttps 最新一次保存成功的 对象存储 Https 值
     * @param oldObjStorageHttp 最新一次保存成功的 对象存储 Http 值
     */
    protected changeAppConfigObjPorts(objStorageHttps, objStorageHttp, oldObjStorageHttps, oldObjStorageHttp) {
        const { currentAppPorts, oldAppPorts } = this.state

        this.setState({
            currentAppPorts: {
                ...currentAppPorts,
                objStorageHttps: objStorageHttps,
                objStorageHttp: objStorageHttp
            },
            oldAppPorts: {
                ...oldAppPorts,
                objStorageHttps: oldObjStorageHttps,
                objStorageHttp: oldObjStorageHttp
            }
        })

        if (this.refs['fireWallConfig']) {
            this.refs['fireWallConfig'].updateFireWallRules(this.state.oldAppPorts, this.state.currentAppPorts)
        }
    }

    /**
     * 当因端口更改导致防火墙规则更新时，向父组件 SiteConfig 抛出事件
     * @param updateSuccess 更新成功的旧的端口信息
     * @param updateFail 更新失败的旧的端口信息
     * @param shouldUpdateCount 应该被更新的规则条数
     */
    protected fireWallUpdateStatus(updateSuccess, updateFail, shouldUpdateCount) {
        if (this.refs['appConfig']) {
            this.refs['appConfig'].recodeLogOrReturnData(updateSuccess, updateFail, shouldUpdateCount)
        }
    }
}


