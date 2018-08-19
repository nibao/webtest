import * as React from 'react';
import NWWindow from '../../ui/NWWindow/ui.client';
import Icon from '../../ui/Icon/ui.desktop';
import InvalidTipMessage from '../InvalidTipMessage/component.client'
import { ClientComponentContext } from '../helper'
import Content from './Content/component.client';
import ViewSizeBase from './component.base';
import * as loading from './assets/images/loading.gif'
import * as styles from './styles.desktop';
import __ from './locale';

export default class ViewSize extends ViewSizeBase {

    render() {
        const { onOpenViewSizeDialog, onCloseDialog, fields, id } = this.props
        const { isQuering, errorCode } = this.state
        return (
            <NWWindow
                id={id}
                title={__('查看大小')}
                onOpen={onOpenViewSizeDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            isQuering ?
                                <div className={styles['loading']} >
                                    <Icon url={loading} />
                                    <div className={styles['loading-message']}>
                                        {__('正在统计......')}
                                    </div>
                                </div>
                                : <Content
                                    onConfirm={this.confirm.bind(this)}
                                    onCancel={this.cancel.bind(this)}
                                    isQuering={this.state.isQuering}
                                    filenum={this.state.size.filenum}
                                    dirnum={this.state.size.dirnum}
                                    totalsize={this.state.size.totalsize}
                                    recyclesize={this.state.size.recyclesize}
                                    onlyrecycle={this.props.onlyrecycle}
                                >
                                </Content>
                        }
                        {
                            this.state.showError ?
                                <InvalidTipMessage
                                    onConfirm={this.close.bind(this)}
                                    errorCode={this.state.errorCode}
                                    errorDoc={this.state.errorDoc}
                                    onlyrecycle={this.props.onlyrecycle}
                                />
                                :
                                null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }

}