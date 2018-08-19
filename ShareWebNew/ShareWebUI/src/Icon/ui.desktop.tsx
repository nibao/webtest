import * as React from 'react';
import * as styles from './styles.desktop.css';

export default function Icon({ url, size }: UI.Icon.Props) {
    return (
        <img className={styles['icon']} src={url} style={{ 'width': size, 'height': size }} />
    )
}