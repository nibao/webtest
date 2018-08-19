import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop.css';

export default function CenterCondition({ name, items, currentItem, handleClick, currentBookIndex }) {

    return (
        <li className={classnames(styles['share-center-list'])}>
            <div className={classnames(name === '教材' ? styles['share-center-book-title'] : styles['share-center-title'])}>{name}:</div>
            <div className={classnames(styles['share-center-item'])}>
                {
                    items.map((entries) =>
                    name === '教材' ? 
                        entries['bookCode'].map((entryBookCode, index) =>
                            <span
                                key={`${entryBookCode['code']}`}
                                className={classnames(styles['share-center-span'], currentItem === entries && currentBookIndex === index ? styles['enabled'] : styles['disabled'])}
                                onClick={() => { handleClick(entries, index) }}
                            > 
                                { `${entryBookCode['name']}`}
                            </span>
                        )
                         : 
                        <span
                            key={entries['name'] ? `${entries['name']}${entries['code']}` : `${entries['bookCode']['code']}`}
                            className={classnames(styles['share-center-span'], currentItem === entries ? styles['enabled'] : styles['disabled'])}
                            onClick={() => { handleClick(entries) }}
                        > 
                            {entries['name'] ? entries['name'] : `${entries['bookCode']['name']}`}
                        </span>

                    )

                }
            </div>
        </li>
    )
}