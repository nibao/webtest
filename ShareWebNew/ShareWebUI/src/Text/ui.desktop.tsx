/// <reference path="./index.d.ts" />

import * as React from 'react'
import * as classnames from 'classnames'
import { isString } from 'lodash'
import { decorateText } from '../../util/formatters/formatters'
import { isBrowser, Browser } from '../../util/browser/browser'
import Title from '../Title/ui.desktop'
import * as styles from './styles.desktop.css'

// 判断是否为Safari浏览器，是时，添加空的伪元素，解决Safari浏览器下显示双tooltip
const isSafari = isBrowser({ app: Browser.Safari });

const Text: React.StatelessComponent<UI.Text.Props> = function Text({ selectable = true, ellipsizeMode = 'tail', numberOfChars = 70, className, children }) {
    return (
        <Title content={isString(children) ? children : ''} >
            {
                <div className={classnames(
                    styles['text'],
                    {
                        [styles['ellisize-tail']]: !!(ellipsizeMode === 'tail')
                    },
                    {
                        [styles['selectable']]: selectable,
                    },
                    {
                        [styles['safari']]: isSafari,
                    },
                    className,
                )}
                >
                    {
                        ellipsizeMode === 'tail' ? children : decorateText(children, { limit: numberOfChars })
                    }
                </div>
            }
        </Title>
    )
}

export default Text