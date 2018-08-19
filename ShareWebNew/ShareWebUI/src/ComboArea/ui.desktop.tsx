import * as React from 'react';
import * as classnames from 'classnames';
import FlexTextBox from '../FlexTextBox/ui.desktop';
import Control from '../Control/ui.desktop';
import Chip from '../Chip/ui.desktop';
import ComboAreaBase from './ui.base';
import * as styles from './styles.desktop';

export default class ComboArea extends ComboAreaBase {
    render() {
        return (
            <Control
                className={classnames(
                    styles['comboarea'],
                    this.props.className,
                )}
                width={this.props.width}
                height={this.props.height}
                minHeight={this.props.minHeight}
                maxHeight={this.props.maxHeight}
                onClick={this.focusInput.bind(this)}
            >
                {
                    this.state.value.map((o) => {
                        return (
                            <div className={styles['chip-wrap']}>
                                <Chip
                                    readOnly={this.props.readOnly}
                                    disabled={this.props.disabled}
                                    removeHandler={() => this.removeChip(o)}
                                >
                                    {
                                        this.props.formatter(o)
                                    }
                                </Chip>
                            </div>
                        )
                    })
                }
                {
                    this.props.uneditable === false ?
                        <div className={styles['chip-wrap']}>
                            <FlexTextBox
                                ref="input"
                                disabled={this.props.disabled || this.props.readOnly}
                                placeholder={this.state.value.length ? '' : this.props.placeholder}
                                onKeyDown={this.keyDownHandler.bind(this)}
                                onPaste={this.pasteHandler.bind(this)}
                                onBlur={this.blurHandler.bind(this)}
                            />
                        </div> :
                        null
                }
            </Control>
        )
    }
}