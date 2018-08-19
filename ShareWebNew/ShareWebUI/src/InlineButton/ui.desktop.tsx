/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import { noop, isNumber } from 'lodash';
import UIIcon from '../UIIcon/ui.desktop';
import Title from '../Title/ui.desktop'
import * as styles from './styles.desktop.css';

const InlineButton: React.StatelessComponent<UI.InlineButton.Props> = function InlineButton({ size, title, code, fallback, iconSize, disabled, onClick, className, type }) {
    return (
        title ?
            <Title
                timeout={0}
                content={title}
            >
                <button
                    className={classnames(styles['inline-button'], { [styles['disabled']]: disabled }, className)}
                    style={{ width: size, height: size, }}
                    disabled={disabled}
                    type={type}
                    onClick={onClick}
                >
                    <UIIcon
                        className={styles['icon']}
                        code={code}
                        fallback={fallback}
                        color="#757575"
                        size={iconSize}
                    />
                </button>
            </Title>
            :
            <button
                className={classnames(styles['inline-button'], { [styles['disabled']]: disabled }, className)}
                style={{ width: size, height: size, }}
                disabled={disabled}
                type={type}
                onClick={onClick}
            >
                <UIIcon
                    className={styles['icon']}
                    code={code}
                    fallback={fallback}
                    color="#757575"
                    size={iconSize}
                />
            </button>
    )
}

InlineButton.defaultProps = {
    size: 24,
    title: '',
    iconSize: 16,
    disabled: false,
    onClick: noop,
}

export default InlineButton;