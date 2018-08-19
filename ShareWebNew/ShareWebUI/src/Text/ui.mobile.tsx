/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.mobile.css';

const Text: React.StatelessComponent<UI.Text.Props> = function Text({ selectable = true, className, children }) {
    return (
        <div
            className={classnames(
                styles['text'],
                {
                    [styles['selectable']]: selectable,
                },
                className,
            )}
        >
            {
                children
            }
        </div>
    )
}

export default Text