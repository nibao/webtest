import * as React from 'react';
import CascadeAreaBase from './ui.base';
import CascadeOption from '../CascadeArea.Option/ui.desktop';
import * as styles from './styles.desktop.css';

export default class CascadeArea extends CascadeAreaBase {
    static Option = CascadeOption;

    render() {
        const _this = this;

        return (
            <div className={styles['container']}>
                {
                    React.Children.map(this.props.children, option => {
                        return React.cloneElement(option, {
                            onPropagateSelect(selection) {
                                _this.onSelect(selection);
                            }
                        })
                    })
                }
            </div>
        )
    }
}