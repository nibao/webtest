import * as React from 'react'
import { chunk } from 'lodash'
import GridBase from './component.base'
import { docname } from '../../../core/docs/docs'

export default class Grid extends GridBase {
    render() {
        const { docs, selections } = this.props
        const { cols } = this.state
        return (
            <div>
                {
                    chunk(docs, cols).map(docGroup => (
                        <div>
                            {
                                docGroup.map(doc => (
                                    <div style={{ width: `${100 / cols}%`, display: 'inline-block' }}>
                                        {docname(doc)}
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
}