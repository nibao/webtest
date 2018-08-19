import * as React from 'react';
import * as classnames from 'classnames';
import TextInput from '../../../../ui/TextInput/ui.desktop'
import NumberBoxBase from './component.base';
import * as styles from './styles.desktop.css';

export default class NumberBox extends NumberBoxBase {
    render() {
        return (
            <div
                className={classnames(styles['container'], this.props.className)}
            >
                {
                    this.state.onFocus ? (
                        <div className={styles['edit-page']}>
                            <TextInput
                                ref="input"
                                className={styles['input-box']}
                                value={this.state.value}
                                selectOnFocus={true}
                                onChange={this.handleChange.bind(this)}
                                onEnter={this.handleEnter.bind(this)}
                                onBlur={this.handleBlur.bind(this)}
                                autoFocus={true}
                            />
                        </div>
                    ) : (
                            <div className={styles['show-page']}
                                onClick={this.handleEdit.bind(this)}
                            >
                                {this.props.current}/{this.props.total}
                            </div>
                        )
                }
            </div>
        )
    }
}