import * as React from 'react';
import * as classnames from 'classnames';
import CascadeAreaOptionBase from './ui.base';
import LinkChip from '../LinkChip/ui.desktop';
import Text from '../Text/ui.desktop';
import Icon from '../Icon/ui.desktop';
import * as styles from './styles.desktop.css';
import * as enter from './assets/enter.desktop.png';

export default class CascadeAreaOption extends CascadeAreaOptionBase {
    render() {
        const _this = this;

        return (
            <div className={styles['container']}>
                <div
                    className={classnames(styles['option'], { [styles['selected']]: this.state.selected })}
                    onClick={this.handleClick.bind(this)}
                >
                    <Text className={styles['text']}>
                        {
                            this.formatText()
                        }
                    </Text>
                    {
                        !this.props.isLeaf ?
                            <span className={styles['icon']}>
                                <Icon size={12} url={enter} />
                            </span>
                            : null
                    }
                </div>
                <div className={classnames(styles['children'], { [styles['visible']]: this.state.selected })}>
                    {
                        React.Children.count(this.props.children) ?
                            React.Children.map(this.props.children, option => {
                                return React.cloneElement(option, {
                                    onPropagateSelect(selection) {
                                        _this.propagateSelect(selection)
                                    }
                                })
                            })
                            : null
                    }
                </div>
            </div>
        )
    }
}