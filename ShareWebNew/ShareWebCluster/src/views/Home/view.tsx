import * as React from 'react';
import * as styles from './styles';

export default class HomeView extends React.Component<any, any> {
    render() {
        return (
            <div>
                <div className={styles['nav-tree']}>
                    {
                        this.props.navTree
                    }
                </div>
                <div className={styles['content']}>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}