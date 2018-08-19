import * as React from 'react';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Text from '../../../ui/Text/ui.desktop';
import * as styles from './styles.desktop.css';

const Item = ({ code, children, size }) => (
    <div className={styles['item']}>
        <div className={styles['icon-wrap']}>
            <UIIcon
                className={styles['icon']}
                code={code}
                size={size | 16}
            />
        </div>
        <div className={styles['text-wrap']}>
            <Text className={styles['text']}>
                {
                    children
                }
            </Text>
        </div>
    </div>
)

const Account = ({ user }) => (
    <div className={styles['container']}>
        <div className={styles['summary']}>
            <Item
                code={'\uf01f'}
                size={16}
                color={'#757575'}
            >
                {
                    user ? user.name : '---'
                }
            </Item>
        </div>
    </div >
)

export default Account