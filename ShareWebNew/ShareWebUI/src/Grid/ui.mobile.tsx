import * as React from 'react'
import GridBase from './ui.base'
import { chunk } from 'lodash'

export default class Grid extends GridBase {
    render() {
        const { children, cols, ...otherProps } = this.props
        return (
            <div {...otherProps}>
                {
                    chunk(children, cols).map(rows => (
                        <div>
                            {
                                rows.map(col => (
                                    <div style={{ width: `${100 / cols}%`, display: 'inline-block', verticalAlign: 'middle' }}>{col}</div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
}