import * as React from 'react'
import * as styles from './styles.desktop.css'

/**
 * 内容居中组件
 * @param props.children
 */
const Centered = function Centered({ children }) {
    return (
        <div className={styles['centered']}>
            <div className={styles['positioned']}>
                <div className={styles['content']}>
                    {
                        children
                    }
                </div>
            </div>
        </div>
    )
}

export default Centered