import * as React from 'react';
import { pick, assign } from 'lodash';
import session from '../../util/session/session';
import { docname } from '../../core/docs/docs';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import DialogButton from '../../ui/Dialog.Button/ui.desktop';
import Download from '../Download/component.desktop';
import SaveTo from '../SaveTo/component.desktop';
import { Type } from '../SaveTo/component.base';
import Auth from '../Auth/component.desktop';
import ViewerBase from './component.base';
import * as classnames from 'classnames';
import * as styles from './style.desktop.css';
import __ from './locale';

export default class Viewer extends ViewerBase {

    render() {
        const { link, doc } = this.props;

        return (
            <div
                className={classnames({ 'no-print': this.state.avoidPrint, [styles['lightoff']]: this.props.lightoff }, styles['container'])}
                onContextMenu={this.forbidContextMenu.bind(this)}
            >
                <div className={styles['header']}>
                    <div className={styles['headerPadding']}>
                        <FlexBox>
                            <FlexBox.Item align="middle left">
                                <h1 className={styles['title']} title={doc ? docname(doc) : link.name}>
                                    {
                                        doc ? docname(doc) : link.name
                                    }
                                </h1>
                            </FlexBox.Item>
                            <FlexBox.Item width="300" align="middle right">
                                <div className={styles['action']}>
                                    {
                                        this.state.downloadEnabled ?
                                            <DialogButton className={classnames({ [styles['lightoff-button']]: this.props.lightoff })} onClick={this.download.bind(this)} >{__('下载')}</DialogButton> :
                                            null
                                    }
                                    {
                                        this.state.saveToEnabled && !this.props.skipPermissionCheck ?
                                            <DialogButton className={classnames({ [styles['lightoff-button']]: this.props.lightoff })} onClick={() => { this.saveTo() }}>
                                                {__('转存到我的云盘')}
                                            </DialogButton> :
                                            null
                                    }
                                </div>
                            </FlexBox.Item>
                        </FlexBox>
                    </div>
                </div>
                <div className={classnames(styles['main'], { [styles['avoid-copy']]: this.state.avoidCopy })}>
                    {
                        this.props.children
                    }
                </div>
                {
                    this.ifDownloading(this.props)
                },
                {
                    this.ifSavingTo(this.props)
                }
            </div>
        )
    }

    ifDownloading({ link, doc, skipPermissionCheck }) {
        if (this.state.downloading) {
            return (
                <Download
                    { ...{ link, doc, skipPermissionCheck, userid: session.get('userid') } }
                    beforeDestroy={this.downloadComplete.bind(this)}
                />
            )
        }
    }

    ifSavingTo({ link, doc, onRedirect }) {
        if (this.state.savingTo && this.state.logedIn) {
            return (
                link ?
                    <SaveTo link={link} docs={[doc]} type={Type.SHARELINK} onSaveComplete={() => { this.saveToComplete() }} onRedirect={(url) => { onRedirect(url) }} /> :
                    <SaveTo docs={[doc]} type={Type.SHARE} onSaveComplete={() => { this.saveToComplete() }} onRedirect={(url) => { onRedirect(url) }} />
            )
        } else if (this.state.savingTo && !this.state.logedIn) {
            return (
                <Auth
                    onAuthSuccess={(userInfo) => {
                        this.loginSuccess(userInfo)
                    }}
                    onAuthClose={() => { this.saveToComplete() }}
                    onPasswordChange={(account) => { this.props.onPasswordChange(account) }}
                />
            )
        }
    }
}
