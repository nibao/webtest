import * as React from 'react'
import { getVersionInfo, getLanguageInfo } from '../../core/apis/client/config/config'
import { getOemConfigBySection } from '../../core/apis/eachttp/config/config'
import { getConfig } from '../../core/apis/eachttp/auth1/auth1'
import { getOEMConfByOptions } from '../../core/oem/oem'
import { webcomponent } from '../../ui/decorators'

@webcomponent
export default class AboutProductBase extends React.Component<Components.AboutProduct.Props, Components.AboutProduct.State> {

    static defaultProps = {
        platform: 'client'
    }
    state = {
        oemConfig: null,
        versionInfo: null,
        errorInfo: null,
        sysInfo: {
            product: '',
            version: [],
            deviceInfo: {
                hardwareType: undefined,
                authDays: undefined,
                authStatus: undefined,
                authType: undefined,
            },
            copyright: '',
        },
        showProduct: true,
        showHardware: true,
        showLicense: true,
        showCopyright: true,
    }

    componentWillMount() {
        const { platform } = this.props
        platform === 'client' ? this.getInfoInClient() : this.getInfoInDesktop()
    }

    /**
     * 获取PC端的版本、版权等信息
     */
    private async getInfoInClient() {
        // 向PC端请求版本号和用户语言信息
        let versionInfo: Core.APIs.Client.VersionInfo, userLanguage: Core.APIs.Client.LanguageInfo;
        try {
            versionInfo = await getVersionInfo()
            this.setState({
                versionInfo,
            })
        } catch (error) {
            this.handleError(error)
        }

        try {
            userLanguage = await getLanguageInfo()
        } catch (error) {
            throw error
        }

        // 根据获取的用户语言，请求相应的OEM配置
        if (userLanguage) {
            try {
                const oemConfig: Core.APIs.EACHTTP.OEMInfo = await getOemConfigBySection({ section: `shareweb_${userLanguage.language}` })
                this.setState({
                    oemConfig,
                })
            } catch (error) {
                throw error
            }
        }
    }

    /**
     * 获取web端的版本版权等信息
     */
    private async getInfoInDesktop() {
        try {
            const [
                config,
                { product, copyright, showProduct = true, showHardware = true, showLicense = true, showCopyright = true }
            ] = await Promise.all([
                getConfig(),
                getOEMConfByOptions(['product', 'copyright', 'showProduct', 'showHardware', 'showLicense', 'showCopyright'])
            ])

            this.setState({
                sysInfo: {
                    product,
                    version: config['server_version'].split('-'),
                    deviceInfo: {
                        hardwareType: config['device_info']['hardware_type'],
                        authDays: config['device_info']['auth_days'],
                        authStatus: config['device_info']['auth_status'],
                        authType: config['device_info']['auth_type'],
                    },
                    copyright
                },
                showProduct,
                showHardware,
                showLicense,
                showCopyright,
            })
        } catch (error) {
            throw error
        }
    }
    /**
     * 处理请求错误
     * @param err 传入的错误信息
     */
    protected handleError(err) {
        this.setState({
            errorInfo: err,
        })
    }
}



