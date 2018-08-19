import * as React from 'react';
import * as classnames from 'classnames';
import { pick, assign } from 'lodash';
import session from '../../util/session/session';
import { docname } from '../../core/docs/docs';
import { ClassName } from '../../ui/helper';
import UIIcon from '../../ui/UIIcon/ui.mobile';
import LinkIcon from '../../ui/LinkIcon/ui.mobile';
import ErrorDialog from '../../ui/ErrorDialog/ui.mobile';
import ViewerBase from './component.base';
import * as styles from './style.mobile.css';
import * as backImg from './assets/back.mobile.png'
import __ from './locale';
import { shrinkText } from '../../util/formatters/formatters'

export default class Viewer extends ViewerBase {

    render() {
        const { link, doc } = this.props;

        return (
            <div className={styles.container}>
                <div className={classnames(styles.header, ClassName.BackgroundColor)} style={this.props.style}>
                    <div className={styles.headerPadding}>
                        <div className={styles.back}>
                            <LinkIcon size=".5rem" url={backImg} onClick={this.back.bind(this)} />
                        </div>
                        <h1 className={styles.title}>
                            {
                                shrinkText(link ? (link.size === -1 ? docname(doc) : link.name) : docname(doc), { limit: 30 })
                            }
                        </h1>
                        <div className={styles.action}>
                            {
                                this.state.downloadEnabled ? <UIIcon size="20px" code="\uf01b" onClick={this.downloadMobile.bind(this)} /> : null
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.main}>
                    {
                        this.props.children
                    }
                </div>
            </div >
        )
    }
}