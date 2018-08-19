import * as React from 'react';
import * as classnames from 'classnames';
import ConditionBox from './ConditionBox/component.desktop';
import ResultBox from './ResultBox/component.desktop';
import SearchBox from './SearchBox/component.desktop';
import FullTextSearchBase from './component.base';
import * as styles from './styles.desktop.css';


export default class FullTextSearch extends FullTextSearchBase {

    render() {

        const {
            keys,
            count,
            tagKeys,
            warning,
            isLoading,
            resultDocs,
            keysfields,
            isSearching,
            resultTagsShown,
            resultHighlight,
            customAttributes,
            resultCollections,
            enableMoreCondition,
            } = this.state;

        return (
            <div className={styles['full-search']}>

                <SearchBox
                    keys={keys}
                    warning={warning}
                    reset={this.handleReset.bind(this)}
                    search={this.handleSearch.bind(this)}
                    change={this.handleSearchKeysChange.bind(this)}
                    onWarningChange={this.handleWarningChange.bind(this)}
                />

                <ConditionBox
                    ref="conditionBox"
                    isLoading={isLoading}
                    searchTags={tagKeys}
                    isSearching={isSearching}
                    customAttributes={customAttributes}
                    searchRange={this.props.searchRange}
                    enableMoreCondition={enableMoreCondition}
                    onExtChange={this.handleExtChange.bind(this)}
                    onDateChange={this.handleDateChange.bind(this)}
                    onWarningChange={this.handleWarningChange.bind(this)}
                    onTagKeysChange={this.handleTagKeysChange.bind(this)}
                    onSizeRangeChange={this.handleSizeRangeChange.bind(this)}
                    onCustomAttrChange={this.handleCustomAttrChange.bind(this)}
                    onKeysFieldsChange={this.handleKeysFieldsChange.bind(this)}
                    onSearchRangeChange={this.handleSearchRangeChange.bind(this)}
                    onMoreConditionChange={this.handleMoreConditionChange.bind(this)}
                    onOtherTypeInputChange={this.handleOtherTypeInputChange.bind(this)}
                    onTagInputStatusChange={this.handleTagInputStatusChange.bind(this)}
                />

                <div
                    className={classnames(styles['result-container'], {
                        [styles['result-container-short-expand']]: enableMoreCondition && customAttributes.length === 0,
                        [styles['result-container-long-expand']]: enableMoreCondition && customAttributes.length !== 0
                    })}

                >

                    <ResultBox
                        count={count}
                        resultDocs={resultDocs}
                        keysfields={keysfields}
                        resultHighlight={resultHighlight}
                        resultTagsShown={resultTagsShown}
                        isLoading={isLoading || isSearching}
                        resultCollections={resultCollections}
                        onLazyLoad={this.handleChangePage.bind(this)}
                        doDirOpen={(doc) => this.props.doDirOpen(doc)}
                        onClickAddTags={this.handleClickAddTags.bind(this)}
                        onClickShowTags={this.handleClickShowTags.bind(this)}
                        onWarningChange={this.handleWarningChange.bind(this)}
                        doFilePreview={(doc) => this.props.doFilePreview(doc)}
                        onGetLazyLoadRef={this.handleGetLazyLoadRef.bind(this)}
                        onSortSelect={this.handleClickSortSelection.bind(this)}
                        onClickCollect={this.handleClickCollectButton.bind(this)}
                        onShareDocChange={this.props.onShareDocChange.bind(this)}
                    />

                </div >

            </div >
        )
    }




}

