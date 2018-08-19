import * as React from 'react';
import { LinkChip, UIIcon } from '../../../ui/ui.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default function DataBaseMode({ doRedirectServers }) {

    return (
        <div className={styles['add-nodeinfos']}>
            <UIIcon code={'\uf021'} size={48} color={'#cccccc'}>
            </UIIcon>
            <div className={styles['content']}>
                {__('请前往')}<LinkChip className={styles['link']} onClick={doRedirectServers}>{__('服务器管理')}</LinkChip>{__('页面添加数据库节点。')}
            </div>
        </div>
    )

}