import * as React from 'react'
import AboutProductBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class AboutProduct extends AboutProductBase {

    render() {
        const { sysInfo, showProduct, showHardware, showLicense, showCopyright } = this.state;

        return (
            <div>

                {
                    showProduct || showHardware ?
                        <div className={styles['message']}>
                            {
                                showProduct && sysInfo.version ?
                                    <span>
                                        {sysInfo.product} {sysInfo.version[0]}.{sysInfo.version[2]} ({sysInfo.version[1]})
                                    </span>
                                    : null
                            }
                            {
                                showHardware ?
                                    <span className={styles['item-space']}>{sysInfo.deviceInfo.hardwareType}</span>
                                    : null
                            }
                        </div>
                        : null
                }

                {
                    showLicense ?
                        <div className={styles['message']}>
                            {this.renderLicense(sysInfo.deviceInfo)}
                        </div>
                        : null
                }

                {
                    showCopyright ?
                        <div className={styles['message']}>{sysInfo.copyright}</div>
                        : null
                }
            </div>
        )

    }

    /**
    * 渲染许可证授权状态
    * @param deviceInfo 
    */
    renderLicense(deviceInfo) {
        if (deviceInfo.authStatus === 1) {
            return <span>{__('当前产品尚未授权')}</span>
        }

        if (deviceInfo.authStatus === 2 && deviceInfo.authDays === -1 && deviceInfo.authType === 3) {
            return <span>{__('当前产品已正式授权，剩余使用天数：')}{__('无限制')}</span>
        }

        if (deviceInfo.authStatus === 2 && deviceInfo.authDays === -1 && deviceInfo.authType === 2) {
            return <span>{__('当前产品为测试版本，剩余使用天数：')}{__('无限制')}</span>
        }

        if (deviceInfo.authStatus === 2 && deviceInfo.authType === 3 && deviceInfo.authDays !== -1) {
            return <span>{__('当前产品已正式授权，剩余使用天数：')} {deviceInfo.authDays} {__('天')}</span>
        }

        if (deviceInfo.authStatus === 2 && deviceInfo.authType === 2 && deviceInfo.authDays !== -1) {
            return <span>{__('当前产品为测试版本，剩余使用天数：')} {deviceInfo.authDays} {__('天')}</span>
        }

        if (deviceInfo.authStatus === 3) {
            return <span>{__('当前产品授权已过期，剩余使用天数： 0 天')}</span>
        }

        if (deviceInfo.authStatus === 4) {
            return <span>{__('当前产品授权已失效，剩余使用天数：')}---</span>
        }

    }
}


