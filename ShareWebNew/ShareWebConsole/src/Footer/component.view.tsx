import * as React from 'react';
import FooterBase from './component.base';
import __ from './locale';
import * as styles from './styles.view';

export default class Footer extends FooterBase {
    render() {
        const { sysInfo, showProduct, showHardware, showCopyright, showLicense } = this.state;

        return (
            <div>
                {
                    (showProduct || showHardware) ?
                        <div className={styles['message']}>
                            {
                                showProduct && sysInfo.version ?
                                    <span className={styles['item-space']}>
                                        {sysInfo.product} {sysInfo.version[0]}.{sysInfo.version[2]} ({sysInfo.version[1]})
                                    </span>
                                    : null
                            }
                            <span className={styles['item-space']}>{__('型号：')} {sysInfo.license.hardwareType}</span>
                        </div>
                        : null
                }
                {
                    showLicense ?
                        <div className={styles['message']}>
                            {this.renderLicense(sysInfo)}
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

    renderLicense(sysInfo) {

        if (sysInfo.license.authorizedStatus === 1) {
            return <span>{__('当前产品尚未授权')}</span>
        }

        if (sysInfo.license.authorizedStatus === 2 && sysInfo.license.expiredDay === -1 && sysInfo.license.authorizedType === 3) {
            return <span>{__('当前产品已正式授权，剩余使用天数：')}{__('无限制')}</span>
        }

        if (sysInfo.license.authorizedStatus === 2 && sysInfo.license.expiredDay === -1 && sysInfo.license.authorizedType === 2) {
            return <span>{__('当前产品为测试版本，剩余使用天数：')}{__('无限制')}</span>
        }

        if (sysInfo.license.authorizedStatus === 2 && sysInfo.license.authorizedType === 3 && sysInfo.license.expiredDay !== -1) {
            return <span>{__('当前产品已正式授权，剩余使用天数：')} {sysInfo.license.expiredDay} {__('天')}</span>
        }

        if (sysInfo.license.authorizedStatus === 2 && sysInfo.license.authorizedType === 2 && sysInfo.license.expiredDay !== -1) {
            return <span>{__('当前产品为测试版本，剩余使用天数：')} {sysInfo.license.expiredDay} {__('天')}</span>
        }

        if (sysInfo.license.authorizedStatus === 3) {
            return <span>{__('当前产品授权已过期，剩余使用天数： 0 天')}</span>
        }

        if (sysInfo.license.authorizedStatus === 4) {
            return <span>{__('当前产品授权已失效，剩余使用天数：')}---</span>
        }

    }
}