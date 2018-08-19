import * as React from 'react';
import * as classnames from 'classnames';
import TabsNavigatorBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class TabsNavigator extends TabsNavigatorBase {
    render() {
        return (
            <div className={classnames(styles['navigator'], this.props.className)}>
                {
                    React.Children.map(this.props.children, (Tab, index) => {
                        return React.cloneElement(Tab, {
                            active: this.state.activeIndex === index,
                            onActive: this.navigate.bind(this, index)
                        })
                    })
                }
            </div>
        )
    }
}