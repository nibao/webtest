import * as React from 'react';
import * as classnames from 'classnames';
import Button from '../../../../ui/Button/ui.desktop';
import SearchBox from '../../../../ui/SearchBox/ui.desktop';
import PopMenu from '../../../../ui/PopMenu/ui.desktop';
import Panel from '../../../../ui/Panel/ui.desktop';
import Title from '../../../../ui/Title/ui.desktop';
import PopMenuItem from '../../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../../ui/UIIcon/ui.desktop';
import SearchBoxBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class SearchBox extends SearchBoxBase {

    render() {

        const { searchHistory, keys, searchInputFoucsStatus } = this.state;

        return (
            <div
                className={styles['search-bar']}
                onClick={() => this.props.onWarningChange()}
            >
                <div className={styles['search-container']}>

                    <PopMenu
                        anchorOrigin={['right', 'bottom']}
                        targetOrigin={['right', 'top']}
                        className={classnames(styles['search-history-menu'])}
                        watch={true}
                        freezable={false}
                        trigger={
                                <SearchBox
                                    value={keys}
                                    width={450}
                                    className={styles['search-box']}
                                    placeholder={__('请输入关键字')}
                                    onChange={(value) => { this.handleSearchInputChange(value) }}
                                    onEnter={(e) => { this.handleSearchEnter(e) }}
                                    loader={(value) => { this.handleLoadSearchHistory(value) }}
                                    validator={(value) => this.handleValidator(value)}
                                    onFocus={(e) => this.handleSearchFocus(e)}

                                />
                        }
                        onRequestCloseWhenClick={close => close()}
                        onRequestCloseWhenBlur={close => close()}

                    >
                        {
                            searchHistory ?
                                searchHistory.map((singleSearchHistory) =>
                                    <PopMenuItem
                                        className={styles['search-history-item']}
                                        iconElementLeft={React.createElement('span')}
                                        label={singleSearchHistory}
                                        onClick={(e) => { this.handleClickSearchHistoryMenu(singleSearchHistory, e) }}
                                    >
                                    </PopMenuItem>
                                )
                                :
                                null
                        }
                    </PopMenu>



                    <Panel.Button
                        className={classnames(styles['search-btn'])}
                        onClick={() => { this.handleClickSearchBtn(); }}
                    >
                        <span>{__('搜索')}</span>
                    </Panel.Button>

                    <Panel.Button
                        className={classnames(styles['reset-btn'])}
                        onClick={() => { this.handleClickResetBtn(); }}
                    >
                        <span>{__('重置')}</span>
                    </Panel.Button>
                    <span className={styles['warning']}>
                        {
                            this.props.warning ?
                                __('请输入搜索条件')
                                :
                                null
                        }
                    </span>




                </div>
            </div>
        )
    }
}