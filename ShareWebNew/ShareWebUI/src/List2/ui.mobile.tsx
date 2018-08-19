import * as React from 'react'
import List2Item from '../List2.Item/ui.mobile'

const List2 = function List2({
    children
}) {
    return (
        <div>
            {
                children
            }
        </div>
    )
}

List2.Item = List2Item

export default List2