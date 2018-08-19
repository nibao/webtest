import * as React from 'react';
import * as classnames from 'classnames';
import DropBoxBase from './ui.base';
import UIIcon from '../UIIcon/ui.mobile';
import Text from '../Text/ui.mobile';
import * as styles from './styles.mobile';

export default class DropBox extends DropBoxBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['value']}>
                    <div className={styles['padding']}>
                        <a
                            ref="select"
                            href="javascript:void(0)"
                            className={styles['select']}
                            onClick={this.toggleActive.bind(this)}
                            onBlur={this.onSelectBlur.bind(this)}
                        >
                            <Text>
                                {
                                    this.props.formatter(this.props.value)
                                }
                            </Text>
                            <span className={styles['drop-icon']}>
                                <UIIcon
                                    disabled={this.props.disabled}
                                    size="1rem"
                                    code={this.props.fontIcon}
                                    fallback={this.props.fallbackIcon || arrowDown}
                                    onClick={this.toggleActive.bind(this)}
                                />
                            </span>
                        </a>
                    </div>
                </div>
                <div
                    className={classnames(styles['drop'], { [styles['active']]: this.state.active })}
                    onMouseDown={this.preventDeactivate.bind(this)}
                >
                    {
                        this.props.children
                    }
                </div>
            </div >
        )
    }
}