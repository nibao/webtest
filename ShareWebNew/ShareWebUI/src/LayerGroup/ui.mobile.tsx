import * as React from 'react';
import LayerGroupLayer from '../LayerGroup.Layer/ui.mobile'
import * as styles from './styles.mobile';

const LayerGroup = function LayerGroup({
    children,
}) {
    return (
        <div className={styles['layer-group']}>
            {
                children
            }
        </div>
    )
}

LayerGroup.Layer = LayerGroupLayer;

export default LayerGroup