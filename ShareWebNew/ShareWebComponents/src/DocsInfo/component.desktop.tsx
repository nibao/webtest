import * as React from 'react';
import { first, isFunction } from 'lodash';
import Tabs from '../../ui/Tabs/ui.desktop';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { isDir } from '../../core/docs/docs';
import Favorite from '../Favorite/component.client';
import Attributes from '../Attributes/component.client';
import ExtraMetaInfo from '../ExtraMetaInfo/component.client';
import TagBox from '../TagBox/component.client';
import Permissions from '../Permissions/component.client';
import Revisions from '../Revisions/component.client';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class DocsInfo extends React.Component<Components.DocsInfo.Props, any> {
    static defaultProps = {
        docs: [],
    }

    render() {
        const [ArrtibutesTab, ArrtibutesContent] = this.requestAttributes();
        const [PermissionsTab, PermissionsContent] = this.requestPermissions();
        const [RevisionsTab, RevisionsContent] = this.requestRevisions();

        return (
            <Tabs>
                <Tabs.Navigator className={styles['tabnav']}>
                    {
                        this.props.docs.length === 1 && this.props.docs[0].docid ?
                            !isDir(this.props.docs[0]) ?
                                [
                                    ArrtibutesTab(),
                                    PermissionsTab(),
                                    RevisionsTab(),
                                ] : [
                                    ArrtibutesTab(),
                                    PermissionsTab(),
                                ] :
                            [
                                ArrtibutesTab(),
                                PermissionsTab()
                            ]
                    }
                </Tabs.Navigator>
                <Tabs.Main>
                    {
                        this.props.docs.length === 1 && this.props.docs[0].docid ?
                            !isDir(this.props.docs[0]) ?
                                [
                                    ArrtibutesContent(this.props.docs),
                                    PermissionsContent(this.props.docs),
                                    RevisionsContent(this.props.docs),
                                ] : [
                                    ArrtibutesContent(this.props.docs),
                                    PermissionsContent(this.props.docs),
                                ] :
                            [
                                ArrtibutesContent(this.props.docs),
                                PermissionsContent(this.props.docs)
                            ]
                    }
                </Tabs.Main>
            </Tabs>
        )
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
                            <div className={styles['content-padding']}>
                                {
                                    docs.length === 1 && (
                                        <Favorite
                                            doc={docs.length === 1 ? first(docs) : null}
                                            onFavoriteChange={this.props.onFavoriteChange}
                                            favorited={this.props.favorited}
                                        />
                                    )
                                }
                                <Attributes
                                    docs={docs}
                                    doViewSize={isFunction(this.props.doViewSize) && this.props.doViewSize}
                                    doEditCSF={isFunction(this.props.doEditCSF) && this.props.doEditCSF}
                                />
                                {
                                    docs.length === 1 && !docs[0].isDir && (
                                        <ExtraMetaInfo
                                            doc={docs.length === 1 ? first(docs) : null}
                                            userid={getOpenAPIConfig('userid')}
                                        />

                                    )
                                }
                                <TagBox
                                    docs={docs}
                                    doEditTag={this.props.doEditTag}
                                    doAddTag={this.props.doAddTag}
                                    doJumpSearch={this.props.doJumpSearch}
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
                                    doRevisionRestore={this.props.doRevisionRestore}
                                    doRevisionView={this.props.doRevisionView}
                                />
                            )
                        }
                    </div>
                </Tabs.Content>
            )
        ]
    }
}