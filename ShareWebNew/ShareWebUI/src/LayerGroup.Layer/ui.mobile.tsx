import * as React from 'react'
import LayerGroupLayerBase from './ui.base'
import * as styles from './styles.mobile'

const LayerGroupLayer = function LayerGroupLayer ({
    children
}){
return (
            <div
                className={styles['layer']}
                >
                {
                    children
                }
            </div>
        )
}

export default LayerGroupLayer