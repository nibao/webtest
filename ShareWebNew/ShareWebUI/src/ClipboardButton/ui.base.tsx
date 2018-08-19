import * as React from 'react';
import { noop } from 'lodash';
import { copy } from '../../util/clipboard/clipboard';
import { Browser, isBrowser, userAgent, bindEvent } from '../../util/browser/browser';
import { PureComponent } from '../decorators';
import * as ZeroClipboard from 'zeroclipboard';

/**
 * 修复Flash加载导致 IE document.title变化
 * @param title 原始的 document.title
 * @see http://stackoverflow.com/questions/4562423/ie-title-changes-to-afterhash-if-the-page-has-a-url-with-and-has-flash-s
 */
function IETitleFixer(title) {
    return function () {
        document.title = title
    }
}

@PureComponent
export default class ClipboardButtonBase extends React.Component<UI.ClipboardButton.Props, any> implements UI.ClipboardButton.Component {
    static defaultProps = {
        swf: '/libs/zeroclipboard/dist/ZeroClipboard.swf',

        afterCopy: noop
    }

    clipboardButton: HTMLButtonElement

    /**
     * 绑定复制处理函数到按钮点击事件
     * @param button 按钮对象
     */
    initClipboard = (button?: HTMLButtonElement) => {
        if (button && !this.clipboardButton) {

            const { app, version } = userAgent();

            if (this.props.doCopy) {
                bindEvent(button, 'click', () => {
                    if (this.props.doCopy(this.props.text)) {
                        this.props.afterCopy(this.props.text);
                    }
                });
            } else if (app === Browser.Chrome || isBrowser({ app: Browser.MSIE, version: 8 })) {
                bindEvent(button, 'click', () => {
                    if (copy(this.props.text)) {
                        this.props.afterCopy(this.props.text);
                    }
                });
            } else {
                this.initZeroClipboard(button);
            }

            this.clipboardButton = button;
        }
    }

    /**
     * 使用ZeroClipboard进行复制操作
     * @param button 按钮对象
     */
    initZeroClipboard(button: HTMLButtonElement) {
        ZeroClipboard.config({
            swfPath: this.props.swf,
            forceHandCursor: true
        });

        const ieTitleFixer = IETitleFixer(document.title);
        const clipboard = new ZeroClipboard(button);

        clipboard.on('ready', () => {
            ieTitleFixer();
            clipboard.on('copy', () => {
                ieTitleFixer();
                clipboard.setText(this.props.text);
            }).on('aftercopy', () => {
                ieTitleFixer();
                this.props.afterCopy(this.props.text);
            });
        });
    }
}