import * as React from 'react';
import { ViewDocType } from '../../core/entrydoc/entrydoc';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SimpleDialog from '../../ui/SimpleDialog/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import Copy from '../Copy/component.desktop';
import SaveLink from '../SaveLink/component.desktop';
import SaveToBase from './component.base';
import { Status, Type } from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';


export default class SaveTo extends SaveToBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.status === Status.NORMAL ?
                        this.renderSaveTo() :
                        null
                }

                {
                    this.state.status === Status.SUCCESS ?
                        this.getSuccessRender() :
                        null
                }

                {
                    this.state.status === Status.USERDOC_CLOSED ?
                        <MessageDialog onConfirm={() => { this.props.onSaveComplete() }}>
                            <div>
                                {__('无法执行保存操作，您的个人文档已被关闭。')}
                            </div>
                        </MessageDialog> :
                        null
                }

            </div>
        )
    }

    renderSaveTo() {
        return this.props.type === Type.SHARE ?
            <Copy
                docs={this.props.docs}
                selectRange={[ViewDocType.UserDoc]}
                onSuccess={(result, target) => { this.saveToSuccess(result, target) }}
                onCancel={() => { this.props.onSaveComplete() }}
                title={__('转存到我的云盘')}
            /> :
            <SaveLink
                docs={this.props.docs}
                link={this.props.link}
                onCancel={() => { this.props.onSaveComplete() }}
                onSuccess={(result, target) => { this.saveToSuccess(result, target) }}
                onLinkError={this.props.onLinkError}
            />
    }

    getSuccessRender() {
        return (
            <SimpleDialog onConfirm={() => { this.props.onSaveComplete() }}>
                <div>
                    <span>{__('保存成功。')}</span>
                    <LinkChip onClick={() => { this.onChangeToTarget() }}>
                        <span className={styles['font-color']}>
                            {__('点击查看')}
                        </span>
                    </LinkChip>
                </div>
            </SimpleDialog>
        )
    }

} 