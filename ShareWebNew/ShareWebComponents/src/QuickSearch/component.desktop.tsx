import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/errcode/errcode';
import { Range, SearchStatus } from '../../core/search/search';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import SearchInput from '../../ui/SearchInput/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import List from '../../ui/List/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Title from '../../ui/Title/ui.desktop';
import { getIcon } from '../helper';
import QuickSearchBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop';
import * as loading from './assets/loading.gif';
import * as iconDir from './assets/icon-dir.png';

export default class QuickSearch extends QuickSearchBase {

    render() {
        const { searchKey, results, range, status, errorCase } = this.state;
        return (
            <div className={styles.container}
                style={{ width: this.props.width }}
            >
                <FlexBox>
                    <FlexBox.Item align="middle left">
                        <div className={styles['search-box']}>
                            <div className={classnames({ [styles['clear-indent']]: searchKey !== '' })}>
                                <SearchInput
                                    ref="searchbox"
                                    placeholder={__('搜索')}
                                    value={searchKey}
                                    loader={this.loader.bind(this)}
                                    onLoad={data => { this.loadSearchResult(data) }}
                                    onChange={this.handleValueChange.bind(this)}
                                    onFetch={this.handleFetch.bind(this)}
                                    onEnter={this.handleEnter.bind(this)}
                                    onBlur={this.handleBlur.bind(this)}
                                    onKeyDown={this.handleKeyDown.bind(this)}
                                    validator={(value) => this.handleValidator(value)}
                                />
                            </div>
                            {
                                searchKey !== '' ?
                                    <UIIcon
                                        className={styles['clear-icon']}
                                        size={15}
                                        code="\uf013"
                                        onClick={this.clearSearchKey.bind(this)}
                                    />
                                    : null
                            }
                        </div>
                    </FlexBox.Item>
                    <FlexBox.Item align="middle" width={30}>
                        <div className={styles['search-icon']}>
                            <UIIcon
                                className={styles['icon']}
                                size={16}
                                code={'\uf01e'}
                                onClick={this.handleGlobalSearch.bind(this, searchKey)}
                            />
                        </div>
                    </FlexBox.Item>
                </FlexBox>
                {
                    searchKey !== '' && (status === SearchStatus.Fetching || status === SearchStatus.SearchInError || (status === SearchStatus.Ok && results)) ?
                        this.renderDropMenu(searchKey, results, status, errorCase, range)
                        :
                        null
                }
            </div>
        )
    }

    renderDropMenu(searchKey, results, status, errorCase, range) {
        return (
            <div className={styles['drop-menu']}>
                {
                    <div
                        className={styles['range']}
                        onMouseDown={this.preventHideResults.bind(this)}
                        onMouseLeave={this.cancelAcitveStatus.bind(this)}
                    >
                        <span className={styles['range-label']}>{__('搜索范围：')}</span>
                        <Button
                            width={80}
                            className={classnames(
                                styles['range-current'],
                                range === Range.Current ?
                                    styles['range-selected']
                                    : styles['range-button']
                            )}
                            onMouseDown={this.setRange.bind(this, Range.Current)}>
                            {__('当前目录')}
                        </Button>
                        <Button
                            width={80}
                            className={
                                range === Range.All ?
                                    styles['range-selected']
                                    : styles['range-button']
                            }
                            onMouseDown={this.setRange.bind(this, Range.All)}>
                            {__('所有目录')}
                        </Button>
                    </div>
                }

                {
                    this.renderSearchStatus(searchKey, results, status, errorCase)
                }
            </div>
        )
    }

    renderSearchStatus(searchKey, results, status, errorCase) {

        switch (status) {
            case SearchStatus.Fetching:
                return (
                    <div className={styles['quick-messager']}>
                        <Icon url={loading} size={32} />
                        <div style={{ paddingTop: '10px' }}>{__('正在搜索...')}</div>
                    </div>
                )
            case SearchStatus.Ok:
                if (results.length > 0) {
                    return (
                        <div
                            onMouseDown={this.preventHideResults.bind(this)}
                            onMouseLeave={this.cancelAcitveStatus.bind(this)}
                        >
                            <List
                                ref="list"
                                className={styles['results']}
                                data={results}
                                template={this.formatter}
                                viewHeight={375}
                                selectIndex={this.state.selectIndex}
                                onSelectionChange={this.handleSelectionChange.bind(this)}
                            />
                            <div className={styles['search-more']}>
                                <span
                                    className={styles['global-search']}
                                    onMouseDown={this.handleGlobalSearch.bind(this, searchKey)}
                                >
                                    {__('查找更多搜索结果')}
                                </span>
                            </div>
                        </div>
                    )

                } else {
                    return (
                        <div className={styles['quick-messager']}>
                            <span className={styles['messager-content']}>
                                {__('没有找到符合条件的结果。')}
                            </span>
                        </div>
                    )
                }
            case SearchStatus.SearchInError:
                return (
                    <div className={styles['quick-messager']}>
                        <span className={styles['messager-content']}>
                            {
                                errorCase.errCode ?
                                    getErrorMessage(errorCase.errCode)
                                    : errorCase.errMsg
                            }
                        </span>
                    </div>
                )
            default:
                return;
        }
    }

    formatter = ({ data }) =>
        <FlexBox>
            <FlexBox.Item align="middle left" width={20}>
                <div
                    onMouseDown={this.handleSelectItem.bind(this, data)}
                >
                    {getIcon(data.doc, { size: 20 })}
                </div>
            </FlexBox.Item>
            <FlexBox.Item align="middle left">
                <Title
                    content={data.name}
                >
                    <span
                        onMouseDown={this.handleSelectItem.bind(this, data)}
                        className={styles['result-name']}
                        dangerouslySetInnerHTML={{ __html: data.nameHtml }}>
                    </span>
                </Title>
            </FlexBox.Item>
            <FlexBox.Item align="middle right">
                <div
                    className={styles['dir']}
                    onMouseDown={this.handleClickDir.bind(this, data)}
                >
                    <UIIcon
                        className={styles['parent-path']}
                        size="16"
                        code={'\uf074'}
                        fallback={iconDir}
                    />
                </div>
            </FlexBox.Item>
        </FlexBox>
}