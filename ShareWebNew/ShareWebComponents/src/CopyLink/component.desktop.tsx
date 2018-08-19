import * as React from 'react';
import * as classnames from 'classnames';
import Overlay from '../../ui/Overlay/ui.desktop';
import ClipboardButton from '../../ui/ClipboardButton/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import CopyLinkBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class CopyLink extends CopyLinkBase {
    render() {
        return (
            <div>
                <div>
                    <TextBox
                        className={ classnames(styles['link-text'], { [styles['code-font']]: this.props.enableLinkAccessCode }) }
                        value={ this.state.text }
                        width={ 400 }
                        readOnly={ true }
                    />
                    <ClipboardButton
                        className={ styles['link-clipboard'] }
                        swf={ this.props.swf }
                        text={ this.state.clipboardData }
                        afterCopy={ this.copyLinkSuccess.bind(this) }
                        doCopy={ this.props.doCopy } >
                        {
                            this.getCopyLabel()
                        }
                    </ClipboardButton>
                </div>
                {
                    this.state.copySuccess ? this.renderCopySuccessMessage() : null
                }
            </div>
        )
    }

    renderCopySuccessMessage() {
        if (this.props.enableLinkAccessCode) {
            return (
                <Overlay position="top center">{ __('提取码已复制。') }</Overlay>
            )
        } else {
            return (
                <Overlay position="top center">{ __('链接已复制。') }</Overlay>
            )
        }
    }

    getCopyLabel() {
        if (this.props.enableLinkAccessCode) {
            return __('复制提取码');
        } else {
            return __('复制链接');
        }
    }
}