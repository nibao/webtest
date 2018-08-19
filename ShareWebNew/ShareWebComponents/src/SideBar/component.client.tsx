import * as React from 'react';
import * as classnames from 'classnames';
import { downloadRevision } from '../../core/client/client';
import { NWWindow } from '../../ui/ui.client'
import { ClassName } from '../../ui/helper';
import DocsInfo from '../DocsInfo/component.desktop';
import StatusHints from '../StatusHints/component.client';
import QuickSearch from '../QuickSearch/component.client';
import Account from './Account/component.client';
import Matrix from './Matrix/component.client';
import Synchronization from './Synchronization/component.client';
import { Module } from './helper';
import SideBarBase from './component.base';
import * as styles from './styles.desktop.css';


export default class SideBar extends SideBarBase {

    render() {
        const { onOpenSideBar, onCloseSideBar, fields, id } = this.props
        return (
            <NWWindow
                id={id}
                onOpen={onOpenSideBar}
                onClose={onCloseSideBar}
                {...fields}
            >
                <div className={classnames(styles['container'], ClassName.BorderColor)}>
                    <div className={styles['top']}>
                        <Account
                            user={this.props.user}
                        />
                        <Synchronization
                            sync={this.props.sync}
                            status={this.props.status}
                            skipDirectTransferTip={this.props.skipDirectTransferTip}
                        />
                    </div>
                    <div>
                        <QuickSearch
                            platform={'pclient'}
                            rows={20}
                            range={this.props.directory}
                            onSelectItem={(doc) => this.selectItem(doc)}
                            onRequestGlobalSearch={(key, range) => this.toGlobalSearch(key, range)}
                            onRequestOpenDir={(doc) => this.onClickDir(doc)}
                        />
                    </div>
                    <div>
                        <Matrix
                            docs={this.props.docs}
                            directory={this.props.directory}
                            onTriggerComponent={this.triggerComponent.bind(this)}
                        />
                    </div>
                    <div className={classnames(styles['block'], styles['bottom-block'])}>
                        {
                            this.showStatusHints(this.props.docs, this.props.directory) ?
                                <StatusHints
                                    id={this.props.id}
                                /> :
                                <DocsInfo
                                    docs={this.props.docs.length ? this.props.docs : [this.props.directory]}
                                    doViewSize={docs => this.triggerComponent(Module.ViewSize, { docs })}
                                    doEditCSF={docs => this.triggerComponent(Module.EditCSF, { docs })}
                                    doEditTag={docs => this.triggerComponent(Module.EditTag, { doc: docs[0] })}
                                    doAddTag={docs => this.triggerComponent(Module.AddTag, { docs })}
                                    doRevisionRestore={(doc, revision) => this.triggerComponent(Module.RestoreRevision, { doc, revision })}
                                    doRevisionView={(doc, revision) => downloadRevision(doc, revision)}
                                    doJumpSearch={this.doJumpSearch.bind(this)}
                                    onFavoriteChange={this.props.onFavoriteChange}
                                    favorited={this.props.favorited}
                                />
                        }
                    </div>
                    {
                        (this.props.status !== 1 && this.props.status !== 2 || this.props.isOnline === false) ?
                            (
                                <div className={styles['offline']}></div>
                            ) :
                            null
                    }
                </div>
            </NWWindow>
        )
    }
}
