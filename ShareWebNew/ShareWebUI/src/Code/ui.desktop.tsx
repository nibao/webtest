import * as React from 'react';
import * as classnames from 'classnames';
import { highlightBlock } from 'highlight.js';
import Control from '../Control/ui.desktop';
import * as styles from './styles.desktop.css';

export default function Code({ className, language, children }: UI.Code.Props): UI.Code.Element {
    return (
        <Control
            className={ classnames(styles['code'], className) }>
            <pre>
                <code
                    className={ classnames('hljs', language) }
                    ref={ code => highlightBlock(code) }
                >
                    {
                        children
                    }
                </code>
            </pre >
        </Control>
    )
}