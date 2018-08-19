import * as React from 'react';
import * as classnames from 'classnames';
import TextAreaBase from './ui.base';
import Control from '../Control/ui.desktop';
import * as styles from './styles.desktop.css';

export default class TextArea extends TextAreaBase {
    render() {
        return (
            <Control
                className={ classnames(styles['textarea'], this.props.className) }
                disabled={ this.props.disabled }
                focus={ this.state.focus }
                width={ this.props.width }
                height={ this.props.height }
                maxHeight={ this.props.maxHeight }
                minHeight={ this.props.minHeight }
            >
                <textarea
                    className={ styles['input'] }
                    value={ this.state.value }
                    maxLength={ this.props.maxLength }
                    placeholder={ this.props.placeholder }
                    readOnly={ this.props.readOnly }
                    disabled={ this.props.disabled }
                    onChange={ this.changeHandler.bind(this) }
                    onFocus={ this.focusHandler.bind(this) }
                    onBlur={ this.blurHandler.bind(this) }
                />
            </Control>
        )
    }
}