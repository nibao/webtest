import * as React from 'react';
import Icon from '../../ui/Icon/ui.desktop'
import * as loading from './assets/images/loading.gif'
import * as styles from './styles.client'

const Mounting = () => (
    <div className={styles['loading']}>
        <Icon url={loading} />
    </div>
)

export default Mounting;