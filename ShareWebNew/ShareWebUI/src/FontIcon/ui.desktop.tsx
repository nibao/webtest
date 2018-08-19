/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import { isBrowser, Browser, useHTTPS } from '../../util/browser/browser';
import Title from '../Title/ui.desktop'
import * as styles from './styles.desktop.css';

// IE8/IE9 在HTTPS下不支持 @font-face，使用fallback图片代替
const FALLBACKED = isBrowser({ app: Browser.MSIE, version: 8 }) || (useHTTPS() && isBrowser({ app: Browser.MSIE, version: 9 }));

const FontIcon: React.StatelessComponent<UI.FontIcon.Props> = function FontIcon({
    code,
    fallback,
    font,
    title,
    size,
    color,
    onClick,
    disabled,
    className,
    titleClassName,
    ...otherProps
    }) {
    const icon = (
        <span
            className={classnames(styles['icon'], {
                [styles['link']]: onClick && typeof onClick === 'function',
                [styles['disabled']]: disabled
            }, className)}
            onClick={event => !disabled && typeof onClick === 'function' && onClick(event)}
            style={{ fontFamily: font, fontSize: size, color }}
            {...otherProps}
        >
            {
                FALLBACKED ?
                    <img
                        src={fallback}
                        className={styles['fallback-icon']}
                        style={{ width: size, height: size }}
                    /> :
                    code
            }
        </span>
    )

    return title ?
        <Title
            timeout={0}
            content={title}
            className={titleClassName}
        >
            {icon}
        </Title>
        :
        icon
}

export default FontIcon