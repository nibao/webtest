import * as React from 'react';
import Tabs from '../../ui/Tabs/ui.desktop';
import SiteConfigBase from './component.base';
import AppConfig from './AppConfig/component.view';
import FireWallConfig from './FireWallConfig/component.view'
import LicenseConfig from './LicenseConfig/component.view'
import DNSConfig from './DNSConfig/component.view'
import * as styles from './styles.view.css';
import __ from './locale';

export default class SiteConfig extends SiteConfigBase {
    render() {
        return (
            <div className={styles['container']}>
                <Tabs>
                    <Tabs.Navigator className={styles['navigator']}>
                        <Tabs.Tab className={styles['tab-style']}>
                            <div className={styles['tab-font']}>
                                {__('访问配置')}
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab className={styles['tab-style']}>
                            <div className={styles['tab-font']}>
                                {__('许可证配置')}
                            </div>
                        </Tabs.Tab>
                        <Tabs.Tab className={styles['tab-style']}>
                            <div className={styles['tab-font']}>
                                {__('DNS配置')}
                            </div>
                        </Tabs.Tab>
                    </Tabs.Navigator>
                    <Tabs.Main className={styles['tabs-main']}>
                        <Tabs.Content className={styles['tabs-content']}>
                            <div>
                                <AppConfig
                                    ref="appConfig"
                                    changeAppConfigWebClientPorts={this.changeAppConfigWebClientPorts.bind(this)}
                                    changeAppConfigObjPorts={this.changeAppConfigObjPorts.bind(this)}
                                />
                                <FireWallConfig
                                    ref="fireWallConfig"
                                    portsFromAppConfig={this.state.currentAppPorts}
                                    oldAppPortsFromAppConfig={this.state.oldAppPorts}
                                    fireWallUpdateStatus={this.fireWallUpdateStatus.bind(this)}
                                />
                            </div>
                        </Tabs.Content>

                        <Tabs.Content className={styles['tabs-content']}>
                            <LicenseConfig
                            />
                        </Tabs.Content>

                        <Tabs.Content className={styles['tabs-content']}>
                            <DNSConfig />
                        </Tabs.Content>
                    </Tabs.Main>
                </Tabs >
            </div >
        )
    }
}
