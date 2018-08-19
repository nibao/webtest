import * as React from 'react';
import TabsBase from './ui.base';
import TabsNavigator from '../Tabs.Navigator/ui.desktop';
import TabsTab from '../Tabs.Tab/ui.desktop';
import TabsMain from '../Tabs.Main/ui.desktop';
import TabsContent from '../Tabs.Content/ui.desktop';
import * as styles from './styles.desktop.css';

export default class Tabs extends TabsBase {
    static Navigator = TabsNavigator;

    static Tab = TabsTab;

    static Main = TabsMain;

    static Content = TabsContent;

    render() {
        return (
            <div className={styles['container']} style={{ height: this.props.height || '100%' }}>
                {
                    this.createChildren(...this.props.children)
                }
            </div>
        )
    }
}