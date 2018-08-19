import * as React from 'react'
import * as styles from './styles.desktop.css'

const Divider: React.StatelessComponent<UI.Divider.Props> = function Divider({ color = '#f4f4f4', inset = 0 } = {}){

    let marginLeft: string | number = 0,
        marginRight: string | number = 0

    if (Array.isArray(inset)) {
        marginLeft = inset[0]
        marginRight = inset.length > 1 ? inset[1] : inset[0]
    } else {
        marginLeft = inset
        marginRight = inset
    }

    return (
        <hr
            className={styles['divider']}
            style={{ marginLeft, marginRight, borderColor: color }}
        />
    )
}

export default Divider