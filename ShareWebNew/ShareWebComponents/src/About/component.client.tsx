import * as React from 'react'
import { isString } from 'lodash'
import { Panel, Text } from '../../ui/ui.desktop'
import { NWWindow } from '../../ui/ui.client'
import { ClientComponentContext } from '../helper'
import AboutProductBase from './component.base'
import * as styles from './styles.client.css'
import __ from './locale'

export default class AboutProduct extends AboutProductBase {

    render() {
        const { onOpenAboutDialog, onCloseAboutDialog, fields, id } = this.props
        const { oemConfig, versionInfo, errorInfo } = this.state

        return (
            <NWWindow
                id={id}
                title={__('关于')}
                width={530}
                height={230}
                onOpen={onOpenAboutDialog}
                onClose={onCloseAboutDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <Panel>
                        <Panel.Main>
                            <div className={styles['wrapper']}>
                                <div>
                                    <div className={styles['logo-pic']}>
                                        {
                                            oemConfig
                                                ?
                                                (
                                                    <img
                                                        src={`data:image/png;base64,${oemConfig['logo.png']}`}
                                                    />
                                                ) :
                                                null
                                        }
                                    </div>

                                    <div className={styles['version-info']}>
                                        {
                                            versionInfo
                                                ?
                                                (
                                                    <div>
                                                        <Text
                                                            className={styles['version']}
                                                        >
                                                            {`${__('当前版本:')} ${versionInfo.majorVersionNumber}.${versionInfo.minorVersionNumber}`}
                                                        </Text>
                                                        <Text
                                                            className={styles['release-date']}
                                                        >
                                                            {`${__('发布时间:')} ${versionInfo.versionData.slice(0, 4)}/${versionInfo.versionData.slice(4, 6)}/${versionInfo.versionData.slice(6)}`}
                                                        </Text>
                                                    </div>
                                                )
                                                :
                                                (
                                                    errorInfo
                                                        ?
                                                        <div
                                                            className={styles['version-error']}
                                                            title={isString(errorInfo.errmsg) ? errorInfo.errmsg : ''}
                                                        >
                                                            {errorInfo.errmsg}
                                                        </div>
                                                        : null
                                                )
                                        }
                                    </div>
                                </div>

                                <div className={styles['copyright']}>
                                    <Text>
                                        {oemConfig ? oemConfig.copyright : null}
                                    </Text>
                                </div>
                            </div>
                        </Panel.Main>
                    </Panel>
                </ClientComponentContext.Consumer>

            </NWWindow>
        )
    }
}


