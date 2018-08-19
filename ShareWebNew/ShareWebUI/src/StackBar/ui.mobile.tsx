/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import StackBarBase from './ui.base';
import Stack from '../StackBar.Stack/ui.mobile';
import * as styles from './styles.mobile.css';


export default class StackBar extends StackBarBase {

    static Stack = Stack;

    render() {
        return (
            <div className={styles.container} style={{ width: this.props.width }}>
                <span className={styles.wrap}>
                    {
                        this.props.children
                    }
                </span>

            </div>
        )
    }
}