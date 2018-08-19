import * as React from 'react';
import TextInput from '../TextInput/ui.desktop';
import SearchInputBase from './ui.base';

export default class SearchInput extends SearchInputBase {
    render() {
        return (
            <TextInput
                ref="searchInput"
                value={ this.state.value }
                disabled={ this.props.disabled }
                placeholder={ this.props.placeholder }
                autoFocus={ this.props.autoFocus }
                validator={ this.props.validator.bind(this) }
                onChange={ this.handleChange.bind(this) }
                onClick={ this.handleClick.bind(this) }
                onFocus={ this.handleFocus.bind(this) }
                onBlur={ this.handleBlur.bind(this) }
                onEnter={ this.props.onEnter.bind(this) }
                onKeyDown={ this.props.onKeyDown.bind(this) }
            />
        )
    }
}