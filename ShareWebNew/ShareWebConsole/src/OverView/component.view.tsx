import * as React from 'react';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import SystemOverView from './SystemOverView/component.view';
import NetworkOverView from './NetworkOverView/component.view';
import StorageOverView from './StorageOverView/component.view';
import SystemMonitor from './SystemMonitor/component.view';
import * as styles from './styles.view.css';

const OverView: Console.OverView.Component = function ({ onSystemShutdown, doServerRedirect, doStorageRedirect, doSystemDetailRedirect }) {
    return (
        <div className={styles['contain']}>
            <div className={styles['chunk']}>
                <div className={styles['chunk-item']}>
                    <SystemOverView onSystemShutdown={onSystemShutdown} />
                </div>
                <div className={styles['chunk-item']}>
                    <NetworkOverView doServerRedirect={doServerRedirect} />
                </div>
            </div>
            <div className={styles['chunk']}>
                <div className={styles['chunk-item']}>
                    <StorageOverView doStorageRedirect={doStorageRedirect} doServerRedirect={doServerRedirect} />
                </div>
                <div className={styles['chunk-item']}>
                    <SystemMonitor doSystemDetailRedirect={doSystemDetailRedirect} />
                </div>
            </div>
        </div>
    )
}

export default OverView