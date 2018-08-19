import * as React from 'react';
import Mask from '../Mask/ui.mobile';
import Header from '../Dialog.Header/ui.mobile';
import Main from '../Dialog.Main/ui.mobile';
import Footer from '../Dialog.Footer/ui.mobile';
import DialogButton from '../Dialog.Button/ui.mobile';
import DialogBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class Dialog extends DialogBase {

    static Header = Header;

    static Main = Main;

    static Footer = Footer;

    static Button = DialogButton;

    render() {
        return (
            <div>
                {
                    // 通过props传入hide = true实现组件隐藏， 兼容对话框中的flash问题
                    this.props.hide ? null : <Mask />
                }
                <div className={styles.container} ref="container" style={this.props.hide ? { top: '100%', left: '100%' } : { width: this.props.width, top: this.state.top, left: this.state.left }}>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}