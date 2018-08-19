import * as React from 'react';
import * as classnames from 'classnames';
import Menu from '../Menu/ui.desktop';
import Icon from '../Icon/ui.mobile';
import SelectBase from './ui.base';
import SelectOption from '../Select.Option/ui.mobile';
import * as styles from './styles.mobile.css';
import * as drop from './assets/drop.mobile.png';

export default class Select extends SelectBase {
    static Option = SelectOption;

    render() {
        return (
            <div className={styles['container']} style={this.props.style}>
                <div className={styles['value']}>
                    <div className={styles['padding']}>
                        <a
                            href="javascript:void(0)"
                            className={styles['text']}
                            onFocus={this.toggleActive.bind(this)}
                            onBlur={this.deactive.bind(this)}
                        >
                            {
                                this.formatText()
                            }
                            <span className={styles['drop']}>
                                <Icon url={drop} size=".5rem" />
                            </span>
                        </a>
                    </div>
                </div>
                <div className={classnames(styles['options'], { [styles['active']]: this.state.active })}>
                    <Menu>
                        {
                            React.Children.map(this.props.children, option => React.cloneElement(option, {
                                selected: this.state.selected && this.state.selected.props.value === option.props.value,
                                onSelect: this.onOptionSelected.bind(this)
                            }))
                        }
                    </Menu>
                </div>
            </div >
        )
    }
}
