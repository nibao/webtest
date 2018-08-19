/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import StackBarBase from './ui.base';
import Stack from '../StackBar.Stack/ui.desktop';
import * as styles from './styles.desktop.css';


export default class StackBar extends StackBarBase {

    static Stack = Stack;

    render() {
        return (
            <div
                className={
                    classnames(
                        styles['container'],
                        this.props.className,
                        {
                            [styles['box-sizing-border-box']]: !!this.props.width, // 如果传递了宽，则将宽高视为盒模型整体宽高，计算时将包含padding/border
                        }

                    )
                }
                style={{ width: this.props.width }}>
                <span className={styles.wrap}>
                    {
                        this.props.children
                    }
                </span>

            </div>
        )
    }
}