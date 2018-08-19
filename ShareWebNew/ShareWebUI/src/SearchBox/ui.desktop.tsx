import * as React from 'react';
import * as classnames from 'classnames';
import UIIcon from '../UIIcon/ui.desktop';
import Control from '../Control/ui.desktop';
import SearchInput from '../SearchInput/ui.desktop';
import SearchBoxBase from './ui.base';
import * as styles from './styles.desktop.css';

/**
 * 是否显示清空按钮
 */
const showClear = ({ disabled }, { value }): boolean => !disabled && value !== '';

export default class SearchBox extends SearchBoxBase {
    render() {
        return (
            <Control
                className={classnames(styles['searchbox'], this.props.className)}
                width={this.props.width}
                style={this.props.style}
                focus={this.state.focus}
                disabled={this.props.disabled}
            >
                {
                    this.props.icon ?
                        <div className={styles['icon']}>
                            <UIIcon size={13} color={'#cfcfcf'} code={this.props.icon} />
                        </div> :
                        null
                }
                <div className={classnames({ [styles['icon-indent']]: this.props.icon, [styles['clear-indent']]: showClear(this.props, this.state) })}>
                    <SearchInput
                        ref="searchInput"
                        value={this.state.value}
                        disabled={this.props.disabled}
                        autoFocus={this.props.autoFocus}
                        placeholder={this.props.placeholder}
                        validator={this.props.validator}
                        loader={this.props.loader}
                        onChange={this.handleChange.bind(this)}
                        onFetch={this.props.onFetch}
                        onLoad={this.props.onLoad}
                        onFocus={this.focus.bind(this)}
                        onBlur={this.blur.bind(this)}
                        onClick={this.props.onClick && this.props.onClick.bind(this)}
                        onEnter={this.props.onEnter && this.props.onEnter.bind(this)}
                        onKeyDown={this.props.onKeyDown && this.props.onKeyDown.bind(this)}
                    />
                </div>
                {
                    showClear(this.props, this.state) ?
                        <div className={styles['clear']}>
                            <UIIcon
                                size={15}
                                code="\uf013"
                                className={styles['chip-x-icon']}
                                onClick={this.clearInput.bind(this)}
                            />
                        </div>
                        : null
                }
            </Control >
        )
    }
}