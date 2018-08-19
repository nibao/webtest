import * as React from 'react';
import { createShareMgntClient, ECMSManagerClient } from '../../core/thrift2/thrift2';
import { getOEMConfByOptions } from '../../core/oem/oem';
import WebComponent from '../webcomponent';

export default class FooterBase extends WebComponent<Components.Footer.Props, Components.Footer.State> {
    static defaultProps = {

    }

    state = {
        sysInfo: {
            version: ['', '', ''],
            product: '',
            copyright: '',
            license: {}
        },
        showProduct: true,
        showHardware: true,
        showCopyright: true,
        showLicense: true
    }

    /**
     * 获取页脚信息
     */
    async componentWillMount() {
        const appIp = await ECMSManagerClient.get_app_master_node_ip();
        const [
            version,
            license,
            { product, copyright, showProduct = true, showLicense = true, showCopyright = true, showHardware = true }
        ] = await Promise.all([
            ECMSManagerClient.get_cluster_version(),
            createShareMgntClient({ip: appIp}).Licensem_GetDeviceInfo(),
            getOEMConfByOptions(['product', 'copyright', 'showProduct', 'showLicense', 'showCopyright', 'showHardware'])
        ])

        this.setState({
            sysInfo: {
                version: version.split('-'),
                product,
                copyright,
                license
            },
            showProduct,
            showLicense,
            showCopyright,
            showHardware
        })

    }

}