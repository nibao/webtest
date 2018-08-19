import * as React from 'react'
import { getConfig } from '../../core/apis/eachttp/auth1/auth1'
import { getOEMConfByOptions } from '../../core/oem/oem'
import { webcomponent } from '../../ui/decorators'

@webcomponent
export default class AboutProductBase extends React.Component<Components.AboutProduct.Props, Components.AboutProduct.State> {

    static defaultProps = {

    }

    state = {
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
        this.getInfoInDesktop()
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
}



