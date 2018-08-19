import * as React from 'react';
import Text from '../Text/ui.desktop';
import SearchBox from '../SearchBox/ui.desktop';
import Locator from '../Locator/ui.desktop';
import AutoCompleteBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class AutoComplete extends AutoCompleteBase {
    render() {
        const { keyDown, selectIndex } = this.state;

        return (
            <div ref="container"
                className={styles['container']}
                style={{ width: this.props.width }}
            >
                <SearchBox
                    ref={searchBox => this.searchBox = searchBox}
                    value={this.state.value}
                    style={this.props.style}
                    width={this.props.width}
                    className={this.props.className}
                    disabled={this.props.disabled}
                    icon={this.props.icon}
                    autoFocus={this.props.autoFocus}
                    placeholder={this.props.placeholder}
                    validator={this.props.validator}
                    loader={this.props.loader.bind(this)}
                    onChange={this.fireChangeEvent.bind(this)}
                    onFetch={this.handleFetch.bind(this)}
                    onLoad={this.handleLoad.bind(this)}
                    onFocus={this.props.onFocus}
                    onBlur={this.handleBlur.bind(this)}
                    onEnter={this.handleEnter.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
                />
                {
                    this.state.active && this.state.value !== '' && this.state.status !== AutoCompleteBase.Status.FETCHING ?
                        <Locator>
                            <div
                                onMouseDown={this.preventHideResults.bind(this)}
                                className={styles['results']}
                                style={{ width: this.refs.container.offsetWidth }}
                            >
                                {
                                    React.Children.count(this.props.children) ?
                                        (
                                            React.Children.map(this.props.children, (child) => React.cloneElement(child, {
                                                selectIndex: selectIndex,
                                                keyDown: keyDown,
                                                onSelectionChange: this.handleSelectionChange.bind(this)
                                            }))
                                        ) :
                                        <div className={styles['missing-message']} onClick={() => this.toggleActive(false)}>
                                            <div className={styles['padding']}>
                                                <Text>
                                                    {
                                                        this.props.missingMessage
                                                    }
                                                </Text>
                                            </div>
                                        </div>
                                }
                            </div>
                        </Locator> :
                        null
                }
            </div>
        )
    }
}