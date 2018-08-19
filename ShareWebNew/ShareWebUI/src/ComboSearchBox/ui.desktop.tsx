import * as React from 'react'
import { trim } from 'lodash'
import * as classnames from 'classnames'
import { UIIcon, PopMenu, Chip, Text, TextInput } from '../ui.desktop'
import ComboSearchBoxBase from './ui.base'
import * as styles from './styles.desktop.css'

export default class ComboSearchBox extends ComboSearchBoxBase {
    render() {
        const { keys, renderOption, renderComboItem, placeholder, className } = this.props
        const { value, searchValue, searchAnchor, isSearchFocus, isSearchMenu } = this.state
        return (
            <div className={classnames(styles['search'], className)}>
                <div
                    className={classnames(styles['search-container'], { [styles['search-foucs']]: isSearchFocus })}
                    onFocus={this.handleSearchBoxFocus.bind(this)}
                    onBlur={this.handleSearchBoxBlur.bind(this)}
                >

                    <UIIcon
                        className={(styles['search-icon'])}
                        code={'\uf01E'}
                        size="13x"
                    />

                    <div className={classnames(styles['search-content'])}>
                        <div className={styles['search-filters']}>
                            {
                                [...searchValue].reverse().map((item) =>
                                    <Chip
                                        removeHandler={(e) => { this.handleItemDelete(e, item) }}
                                        className={styles['search-filter-item']}
                                        actionClassName={styles['search-delete']}
                                    >
                                        {
                                            keys && keys.length !== 0 ? renderComboItem(item.key, item.value) : item.value
                                        }
                                    </Chip>
                                )
                            }
                        </div>

                        <TextInput
                            className={styles['search-input']}
                            type="text"
                            value={value}
                            placeholder={searchValue.length === 0 ? placeholder : ''}
                            onChange={this.handleSearchInputChange.bind(this)}
                            onKeyDown={this.handleInputKeyDown.bind(this)}
                            ref="searchInput"
                        />

                        {
                            (value || searchValue.length !== 0) ?
                                <UIIcon
                                    className={(styles['empty-icon'])}
                                    code={'\uf013'}
                                    size="13px"
                                    onClick={this.handleTotalDelete.bind(this)}
                                />
                                :
                                <span className={(styles['blank-icon'])}></span>
                        }
                    </div>
                </div >

                {
                    keys && keys.length !== 0
                        ?
                        <PopMenu
                            anchor={searchAnchor}
                            anchorOrigin={['right', 'bottom']}
                            targetOrigin={['right', 'top']}
                            className={classnames(styles['search-menu'])}
                            freezable={false}
                            watch={true}
                            open={trim(value) && isSearchMenu}
                        >
                            {
                                keys.map((key) => {
                                    return <PopMenu.Item
                                        className={classnames(styles['search-item'])}
                                        onClick={() => { this.handleSearchItemClick(key, trim(value)) }}
                                    >
                                        <Text
                                            className={styles['search-value']}
                                        >
                                            {renderOption(key, trim(value))}
                                        </Text>
                                    </PopMenu.Item>
                                }
                                )
                            }
                        </PopMenu> : null
                }

            </div >
        )
    }
}