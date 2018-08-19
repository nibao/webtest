import * as React from 'react';
import * as classnames from 'classnames';
import Mask from '../Mask/ui.client';
import Header from '../Dialog.Header/ui.desktop';
import Main from '../Dialog.Main/ui.desktop';
import Footer from '../Dialog.Footer/ui.desktop';
import DialogButton from '../Dialog.Button/ui.desktop';
import DialogBase from './ui.base';
import * as styles from './styles.client.css';

export default class Dialog extends DialogBase {

    static Header = Header;

    static Main = Main;

    static Footer = Footer;

    static Button = DialogButton;

    render() {
        return (
            <div
                ref="container"
                className={ styles['container'] }
                style={ { width: this.props.width } }
            >
                {
                    this.props.children
                }
            </div>
        )
    }
}