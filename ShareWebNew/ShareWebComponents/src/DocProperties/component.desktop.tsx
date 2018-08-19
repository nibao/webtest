import * as React from 'react'
import { first, isFunction } from 'lodash'
import { isDir } from '../../core/docs/docs'
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { Tabs } from '../../ui/ui.desktop'
import StatusHints from '../StatusHints/component.desktop'
import Permissions from '../Permissions/component.desktop'
import Revisions from '../Revisions/component.desktop'
import ExtraMetaInfo from '../ExtraMetaInfo/component.desktop'
import Attributes from '../Attributes/component.desktop'
import TagBox from '../TagBox/component.desktop'
import DocPropertiesBase from './component.base'
import __ from './locale'
import * as styles from './styles.desktop.css'

export default class DocProperties extends DocPropertiesBase {
    render() {
        const { docs, parent } = this.props
        const [ArrtibutesTab, ArrtibutesContent] = this.requestAttributes();
        const [PermissionsTab, PermissionsContent] = this.requestPermissions();
        const [RevisionsTab, RevisionsContent] = this.requestRevisions();

        switch (docs.length) {
            case 0:
                return (
                    parent ?
                        <Tabs>
                            <Tabs.Navigator className={styles['tabnav']}>
                                {
                                    [
                                        ArrtibutesTab(),
                                        PermissionsTab(),
                                    ]
                                }
                            </Tabs.Navigator>
                            <Tabs.Main className={styles['tabmain']}>
                                {
                                    [
                                        ArrtibutesContent(this.props.docs),
                                        PermissionsContent([parent]),
                                    ]
                                }
                            </Tabs.Main>
                        </Tabs>
                        :
                        <StatusHints />
                )

            case 1:
                return (
                    isDir(first(docs)) ?
                        <Tabs>
                            <Tabs.Navigator className={styles['tabnav']}>
                                {
                                    [
                                        ArrtibutesTab(),
                                        PermissionsTab(),
                                    ]
                                }
                            </Tabs.Navigator>
                            <Tabs.Main className={styles['tabmain']}>
                                {
                                    [
                                        ArrtibutesContent(this.props.docs),
                                        PermissionsContent(this.props.docs),
                                    ]
                                }
                            </Tabs.Main>
                        </Tabs>
                        :
                        <Tabs>
                            <Tabs.Navigator className={styles['tabnav']}>
                                {
                                    [
                                        ArrtibutesTab(),
                                        PermissionsTab(),
                                        RevisionsTab()
                                    ]
                                }
                            </Tabs.Navigator>
                            <Tabs.Main className={styles['tabmain']}>
                                {
                                    [
                                        ArrtibutesContent(this.props.docs),
                                        PermissionsContent(this.props.docs),
                                        RevisionsContent(this.props.docs)
                                    ]
                                }
                            </Tabs.Main>
                        </Tabs>

                )

            default:
                return (
                    <Tabs>
                        <Tabs.Navigator className={styles['tabnav']}>
                            {
                                [
                                    ArrtibutesTab()
                                ]
                            }
                        </Tabs.Navigator>
                        <Tabs.Main className={styles['tabmain']}>
                            {
                                [
                                    ArrtibutesContent(this.props.docs)
                                ]
                            }
                        </Tabs.Main>
                    </Tabs>
                )
        }
    }

    private requestAttributes() {
        return [
            () => (
                <Tabs.Tab
                    className={styles['tab']}
                >
                    {__('属性')}
                </Tabs.Tab>
            ),
            (docs) => (
                <Tabs.Content>
                    {
                        !docs.some(info => !info.docid) && (
                            <div>
                                <Attributes
                                    docs={docs}
                                    doApprovalCheck={this.props.doApprovalCheck}
                                />
                                <TagBox
                                    docs={docs}
                                    doJumpSearch={this.handleTagClick.bind(this)}
                                />
                            </div>
                        )
                    }
                </Tabs.Content>
            )
        ]
    }

    private requestPermissions() {
        return [
            () => (
                <Tabs.Tab
                    className={styles['tab']}
                >
                    {__('权限')}
                </Tabs.Tab>
            ),
            (docs) => (

                <Tabs.Content >
                    <div className={styles['content-padding']}>
                        {
                            first(docs).docid && (
                                <Permissions doc={docs.length === 1 ? first(docs) : null} />
                            )

                        }
                    </div>
                </Tabs.Content>
            )
        ]
    }

    private requestRevisions() {
        return [
            () => (
                <Tabs.Tab
                    className={styles['tab']}
                >
                    {__('版本')}
                </Tabs.Tab>
            ),
            (docs) => (
                <Tabs.Content>
                    <div className={styles['content-padding']}>
                        {
                            docs.length === 1 && !isDir(docs[0]) && (
                                <Revisions
                                    doc={docs.length === 1 ? first(docs) : null}
                                    doRevisionView={this.props.doRevisionView}
                                    doRevisionRestore={this.props.doRevisionRestore}
                                    doRevisionDownload={this.props.doRevisionDownload}
                                />
                            )
                        }
                    </div>
                </Tabs.Content>
            )
        ]
    }
}
