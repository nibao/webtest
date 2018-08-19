import * as React from 'react';
import * as _ from 'lodash';
import * as classnames from 'classnames';
import Button from '../../../ui/Button/ui.desktop';
import CheckBox from '../../../ui/CheckBox/ui.desktop';
import Chip from '../../../ui/Chip/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import PopMenu from '../../../ui/PopMenu/ui.desktop';
import PopMenuItem from '../../../ui/PopMenu.Item/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import RecycleEntry from '../RecycleEntry/component.desktop';
import RecycleList from '../RecycleList/component.desktop';
import { shrinkText } from '../../../util/formatters/formatters';
import RecycleBinBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class RecycleBin extends RecycleBinBase {
    render() {

        let viewSizeIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf053'}
                size="16px"
            >
            </UIIcon>


        let emptyRecycleIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf09D'}
                size="16px"
            >
            </UIIcon>



        let deleteRecycleIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf046'}
                size="16px"
            >
            </UIIcon>


        let restoreRecycleIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf05A'}
                size="16px"
            >
            </UIIcon>

        let storategyRecycleIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf044'}
                size="16px"
            >
            </UIIcon>

        const { lazyLoad, scroll, path, searchFocusStatus, servertime, duration, isSearchEmpty, isSearchMenu, searchAnchor, isContextMenu, mouseAnchor, sortAnchor, isSortSelected,
            isLoading, isEntry, sortBy, sortOrder, searchKeys, searchValue, entryDocs, listDocs, entrySelections, listSelections, filterInputValue } = this.state;
        return (
            <div className={styles['recycle-container']}>

                <div className={styles['recycle-head']}>
                    {this.renderRecycleHead(isEntry, path)}
                </div>
                {
                    <div className={styles['recycle-tools']}>
                        {this.renderRecycleButtons(isEntry, entrySelections, listSelections, listDocs, entryDocs)}
                        {this.renderRecycleSearch(searchAnchor, isEntry, searchKeys, searchValue, isSearchMenu, searchFocusStatus, filterInputValue)}
                        {this.renderRecycleSort(isEntry, isSortSelected, sortAnchor, sortBy, sortOrder)}
                    </div>
                }
                <div className={styles['recycle-content']}>
                    {
                        isEntry ?
                            <RecycleEntry
                                scroll={scroll}
                                entryDocs={entryDocs}
                                isLoading={isLoading}
                                entrySelections={entrySelections}
                                getListRef={this.handleGetListRef.bind(this)}
                                handleSelected={(selection) => { this.handleSelectedEntry(selection) }}
                                handleClick={(e, docinfos) => { this.handleClickEntry(e, docinfos) }}
                                handleClickViewSize={this.handleClickViewSizeIcon.bind(this)}
                                handleDoubleClick={(e, selection, index) => { this.handleDoubleClickEntry(e, selection, index) }}
                                handleClickStorageBtn={(e, selection) => this.handleClickStorageBtn(e, selection)}
                                handleClickEmptyBtn={(e, selection) => this.handleClickEmptyRecycle(e, selection)}
                                handleContextMenu={(e, selection, index) => { this.handleContextMenu(e, selection, index) }}
                            />
                            :
                            <RecycleList
                                scroll={scroll}
                                isClient={this.props.isClient}
                                duration={duration}
                                listDocs={listDocs}
                                lazyLoad={lazyLoad}
                                isLoading={isLoading}
                                servertime={servertime}
                                isSearchEmpty={isSearchEmpty}
                                listSelections={listSelections}
                                onPageChange={this.handleLazyLoad.bind(this)}
                                getListRef={this.handleGetListRef.bind(this)}
                                getLazyLoadRef={this.handleGetLazyLoadRef.bind(this)}
                                handleSelected={(selection) => { this.handleSelectedList(selection) }}
                                handleClickViewSize={this.handleClickViewSizeIcon.bind(this)}
                                handleClickDeleteRecycle={this.handleClickDeleteRecycleIcon.bind(this)}
                                handleClickRestoreRecycle={this.handleClickRestoreRecycleIcon.bind(this)}
                                handleContextMenu={(e, selection, index) => { this.handleContextMenu(e, selection, index) }}
                            />
                    }
                </div>
                {
                    this.state.listErrors.length ?
                        <MessageDialog onConfirm={this.state.confirmError}>
                            {__('文件夹不存在，可能其所在路径发生变更')}
                        </MessageDialog>
                        : null
                }
                {
                    <PopMenu
                        anchorOrigin={mouseAnchor}
                        targetOrigin={['left', 'top']}
                        className={styles['context-list']}
                        open={isContextMenu}
                        onClickAway={this.handleHideContextMenu.bind(this)}
                        onRequestCloseWhenBlur={(close) => close()}
                        watch={true}
                        freezable={true}
                    >

                        {
                            isEntry ?
                                [
                                    <PopMenuItem
                                        className={styles['context-menu-item']}
                                        icon={storategyRecycleIcon}
                                        label={__('回收站策略')}
                                        onClick={(e) => this.handleClickStorageBtn(e, entrySelections[0])}
                                    >
                                    </PopMenuItem>
                                    ,
                                    <PopMenuItem
                                        className={styles['context-menu-item']}
                                        icon={emptyRecycleIcon}
                                        label={__('清空')}
                                        onClick={(e) => this.handleClickEmptyRecycle(e, entrySelections[0])}
                                    >
                                    </PopMenuItem>
                                ]
                                :
                                [
                                    <PopMenuItem
                                        className={styles['context-menu-item']}
                                        icon={restoreRecycleIcon}
                                        label={__('还原')}
                                        onClick={this.handleClickRestoreRecycle.bind(this)}
                                    >
                                    </PopMenuItem>
                                    ,
                                    <PopMenuItem
                                        className={styles['context-menu-item']}
                                        icon={deleteRecycleIcon}
                                        label={__('删除')}
                                        onClick={this.handleClickDeleteRecycle.bind(this)}
                                    >
                                    </PopMenuItem>
                                    ,


                                ]

                        }
                        <PopMenuItem
                            className={classnames(styles['context-menu-item'], styles['context-head-item'])}
                            icon={viewSizeIcon}
                            label={__('查看大小')}
                            onClick={this.handleClickViewSize.bind(this)}
                        >
                        </PopMenuItem>
                        <PopMenuItem
                            className={classnames(styles['context-menu-item'], styles['context-head-item'])}
                            icon={<UIIcon className={(styles['action-icon'])} code={'\uf04a'} size={16} />}
                            label={__('刷新')}
                            onClick={this.handleRefresh}
                        />
                    </PopMenu>
                }
            </div>
        )
    }

    // 加载回收站头部
    renderRecycleHead(isEntry, path) {
        return (
            <div className={styles['container']}>
                <div
                    className={styles['crumbs']}
                >
                    {
                        <div className={classnames(styles['crumb'], styles['back'])}>
                            {
                                isEntry ?
                                    null
                                    :
                                    <span
                                        className={styles['crumb-link']}
                                        onClick={this.handleClickPath.bind(this)}
                                    >
                                        {__('返回')}
                                    </span>
                            }
                            {
                                isEntry ?
                                    <span className={styles['entry-name']}>
                                        {__('回收站')}
                                    </span>
                                    :
                                    <span>
                                        <span className={styles['divider']}>|</span>
                                        <span
                                            className={styles['crumb-link']}
                                            onClick={this.handleClickPath.bind(this)}
                                        >
                                            {__('回收站')}
                                        </span>
                                    </span>
                            }


                        </div>
                    }
                    <div className={classnames(styles['crumbs-wrapper'])}>
                        {
                            isEntry ?
                                null :
                                <div className={styles['crumb']}>
                                    <span className={styles['divider']}>&gt;</span>
                                    <span
                                        className={styles['crumb-link']}
                                    >
                                        <Title content={path}>
                                            {shrinkText(path, { limit: 100 })}
                                        </Title>
                                    </span>

                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    // 加载搜索框
    renderRecycleSearch(searchAnchor, isEntry, searchKeys, searchValue, isSearchMenu, searchFocusStatus, filterInputValue) {



        return (

            isEntry ? null :

                <div className={styles['recycle-search']}>
                    <div
                        className={classnames(styles['recycle-search-container'], { [styles['recycle-search-foucs']]: searchFocusStatus })}
                        onFocus={(e) => { this.handleSearchFocus(e) }}
                        onBlur={() => { this.handleSearchBlur() }}
                    >
                        <UIIcon
                            className={(styles['search-icon'])}
                            code={'\uf01E'}
                            size="17px"
                        >
                        </UIIcon>


                        <div className={classnames(styles['recycle-search-content'])}>
                            <div className={styles['recycle-search-filters']}>
                                {
                                    [...searchKeys].reverse().map((key, index) =>
                                        <div className={styles['recycle-search-filter-box']}>
                                            {
                                                index === 0 ?
                                                    <input
                                                        className={styles['recycle-search-filter-input']}
                                                        type="text"
                                                        ref="firstFilterInput"
                                                        value={filterInputValue}
                                                        onChange={(e) => { this.handleStopInput(e); }}
                                                    />
                                                    :
                                                    null
                                            }

                                            <Chip
                                                removeHandler={(e) => { this.handleDeleteSearchKey(e, key, index) }}
                                                className={styles['recycle-search-filter-item']}
                                                actionClassName={styles['recycle-search-delete']}
                                            >
                                                {`${key['index']}:${key['value']}`}
                                            </Chip>
                                            <input
                                                className={styles['recycle-search-filter-input']}
                                                type="text"
                                                value={filterInputValue}
                                                ref={(ref) => this.searchFilterInput[index] = ref}
                                                onKeyDown={(e) => { this.handleSearchFilterDelete(e, index); }}
                                                onChange={(e) => { this.handleStopInput(e); }}
                                            />
                                        </div>

                                    )
                                }
                            </div>
                            <input
                                className={styles['recycle-search-input']}
                                type="text"
                                value={searchValue}
                                placeholder={searchKeys.length === 0 ? __('搜索') : ''}
                                onChange={(e) => { this.handleSearchInputChange(e) }}
                                onKeyDown={(e) => { this.handleSearchDelete(e) }}
                                ref="searchInput"
                            />

                            {
                                (searchValue || searchKeys.length !== 0) ?
                                    <UIIcon
                                        className={(styles['empty-icon'])}
                                        code={'\uf013'}
                                        size="17px"
                                        onClick={(e) => { this.handleEmptySearchKey(e) }}
                                    >
                                    </UIIcon> :
                                    <span className={(styles['blank-icon'])}></span>

                            }


                        </div>



                    </div>
                    {
                        <PopMenu
                            anchor={searchAnchor}
                            anchorOrigin={['right', 'bottom']}
                            targetOrigin={['right', 'top']}
                            className={classnames(styles['recycle-search-menu'])}
                            watch={true}
                            freezable={false}
                            open={isSearchMenu && searchValue.trim()}
                            onClickAway={this.handleHideSearchFiltersMenu.bind(this)}
                        >
                            <PopMenuItem
                                label={__('文档名称：')}
                                className={classnames(styles['recycle-search-item'])}
                                onClick={(e) => { this.handleClickSearchMenu(__('文档名称'), e) }}
                            >
                                <span className={styles['search-value-long']}>{searchValue.trim()}</span>

                            </PopMenuItem>
                            <PopMenuItem
                                label={__('删除者：')}
                                className={classnames(styles['recycle-search-item'])}
                                onClick={(e) => { this.handleClickSearchMenu(__('删除者'), e) }}
                            >
                                <span className={styles['search-value']}>{searchValue.trim()}</span>
                            </PopMenuItem>
                            <PopMenuItem
                                label={__('原位置：')}
                                className={classnames(styles['recycle-search-item'])}
                                onClick={(e) => { this.handleClickSearchMenu(__('原位置'), e) }}
                            >
                                <span className={styles['search-value']}>{searchValue.trim()}</span>
                            </PopMenuItem>

                        </PopMenu>


                    }
                </div >
        )
    }

    // 加载排序按钮和菜单
    renderRecycleSort(isEntry, isSortSelected, sortAnchor, sortBy, sortOrder) {


        let fontIcon =
            <UIIcon
                className={(styles['action-icon'])}
                code={'\uf068'}
                size="15px"
            >
            </UIIcon>

        let fontIconHidden =
            <span
                className={(styles['blank-icon'])}
            >

            </span>

        function sortName(sortBy, sortOrder) {
            let sortName = '';
            switch (sortBy) {
                case 'name':
                    sortName = sortOrder === 'asc' ? __('按文件名升序') : __('按文件名降序')
                    break;
                case 'time':
                    sortName = sortOrder === 'asc' ? __('按删除时间升序') : __('按删除时间降序')
                    break;
                case 'type':
                    sortName = sortOrder === 'asc' ? __('按文件类型升序') : __('按文件类型降序')
                    break;
                case 'size':
                    sortName = sortOrder === 'asc' ? __('按文件大小升序') : __('按文件大小降序')
                    break;
                default:
                    break;
            }
            return sortName
        }

        return (
            isEntry ?
                null :
                <div className={styles['recycle-sort']}>


                    {
                        <PopMenu
                            anchorOrigin={['right', 'bottom']}
                            targetOrigin={['right', 'top']}
                            className={classnames(styles['recycle-sort-list'])}
                            watch={true}
                            freezable={false}
                            triggerEvent="mouseover"
                            closeWhenMouseLeave={true}
                            onRequestCloseWhenClick={close => close()}
                            trigger={
                                <Button
                                    className={classnames(styles['recycle-sort-container'], { [styles['recycle-sort-container-high']]: isSortSelected })}
                                    onClick={(e) => { this.handleClickSelectBtn(e); }}
                                >
                                    <div className={classnames(styles['button-box'])}>
                                        {
                                            sortName(sortBy, sortOrder)
                                        }
                                    </div>
                                    <UIIcon
                                        className={classnames(styles['sort-icon'])}
                                        code={'\uf04c'}
                                        size="14px"
                                    >
                                    </UIIcon>

                                </Button>
                            }
                        >
                            <PopMenuItem
                                icon={sortBy === 'name' && sortOrder === 'desc' ? fontIcon : fontIconHidden}
                                label={__('按文件名降序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'name', 'desc') }}
                            >
                            </PopMenuItem>
                            <PopMenuItem
                                icon={sortBy === 'name' && sortOrder === 'asc' ? fontIcon : fontIconHidden}
                                label={__('按文件名升序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'name', 'asc') }}
                            >
                            </PopMenuItem>

                            <PopMenuItem
                                icon={sortBy === 'time' && sortOrder === 'desc' ? fontIcon : fontIconHidden}
                                label={__('按删除时间降序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'time', 'desc') }}
                            >
                            </PopMenuItem>

                            <PopMenuItem
                                icon={sortBy === 'time' && sortOrder === 'asc' ? fontIcon : fontIconHidden}
                                label={__('按删除时间升序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'time', 'asc') }}
                            >
                            </PopMenuItem>
                            <PopMenuItem
                                icon={sortBy === 'size' && sortOrder === 'desc' ? fontIcon : fontIconHidden}
                                label={__('按文件大小降序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'size', 'desc') }}
                            >
                            </PopMenuItem>
                            <PopMenuItem
                                icon={sortBy === 'size' && sortOrder === 'asc' ? fontIcon : fontIconHidden}
                                label={__('按文件大小升序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'size', 'asc') }}
                            >
                            </PopMenuItem>
                            <PopMenuItem
                                icon={sortBy === 'type' && sortOrder === 'desc' ? fontIcon : fontIconHidden}
                                label={__('按文件类型降序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'type', 'desc') }}
                            >
                            </PopMenuItem>
                            <PopMenuItem
                                icon={sortBy === 'type' && sortOrder === 'asc' ? fontIcon : fontIconHidden}
                                label={__('按文件类型升序')}
                                className={classnames(styles['recycle-sort-item'])}
                                onClick={(e) => { this.handleClickSelection(e, 'type', 'asc') }}
                            >
                            </PopMenuItem>



                        </PopMenu>


                    }
                </div>

        )
    }

    // 加载回收站功能按钮
    renderRecycleButtons(isEntry, entrySelections, listSelections, listDocs, entryDocs) {

        // 四种条件判断是否出现按钮
        // （入口文档 | 非入口文档）| （选中状态 | 非选中状态）
        return (

            <div className={styles['recycle-buttons']}>
                <CheckBox
                    checked={isEntry ?
                        entryDocs.length === 0 ?
                            false
                            :
                            entrySelections.length === entryDocs.length
                        :
                        listDocs.length === 0 ?
                            false
                            :
                            listSelections.length === listDocs.length
                    }
                    onChange={(checked) => { this.handleSelectedAll(checked); }}
                    disabled={(!isEntry && listDocs.length === 0) || (isEntry && entryDocs.length === 0)}
                />

                {
                    isEntry ?
                        entrySelections.length !== 0 ?
                            <div className={styles['controll-buttons']}>
                                <Button
                                    className={classnames(styles['action-button'])}
                                    onClick={this.handleClickViewSize.bind(this)}
                                >
                                    <div className={classnames(styles['button-box'])}>
                                        <UIIcon
                                            className={(styles['action-icon'])}
                                            code={'\uf053'}
                                            size="17px"
                                        >
                                        </UIIcon>
                                        <span className={classnames(styles['button-text'])} >
                                            {__('查看大小')}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                            :
                            <span className={styles['check-all']}>{__('全选')}</span>
                        :
                        listSelections.length !== 0 ?
                            <div className={styles['controll-buttons']}>
                                {
                                    <Button
                                        className={classnames(styles['action-button'])}
                                        onClick={this.handleClickRestoreRecycle.bind(this)}
                                    >
                                        <div className={classnames(styles['button-box'])}>
                                            <UIIcon
                                                className={(styles['action-icon'])}
                                                code={'\uf05A'}
                                                size="17px"
                                            >
                                            </UIIcon>
                                            <span className={classnames(styles['button-text'])} >
                                                {__('还原')}
                                            </span>
                                        </div>
                                    </Button>
                                }
                                <Button
                                    className={classnames(styles['action-button'])}
                                    onClick={this.handleClickDeleteRecycle.bind(this)}
                                >
                                    <div className={classnames(styles['button-box'])}>
                                        <UIIcon
                                            className={(styles['action-icon'])}
                                            code={'\uf046'}
                                            size="17px"
                                        >
                                        </UIIcon>
                                        <span className={classnames(styles['button-text'])} >
                                            {__('删除')}
                                        </span>
                                    </div>
                                </Button>
                                <Button
                                    className={classnames(styles['action-button'])}
                                    onClick={this.handleClickViewSize.bind(this)}
                                >
                                    <div className={classnames(styles['button-box'])}>
                                        <UIIcon
                                            className={(styles['action-icon'])}
                                            code={'\uf053'}
                                            size="17px"
                                        >
                                        </UIIcon>
                                        <span className={classnames(styles['button-text'])} >
                                            {__('查看大小')}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                            :
                            <div className={styles['controll-buttons']}>
                                <Button
                                    className={classnames(styles['action-button'])}
                                    onClick={(e) => { this.handleClickStorageBtn(e, entrySelections[0]) }}
                                >
                                    <div className={classnames(styles['button-box'])}>
                                        <UIIcon
                                            className={(styles['action-icon'])}
                                            code={'\uf044'}
                                            size="17px"
                                        >
                                        </UIIcon>
                                        <span className={classnames(styles['button-text'])} >
                                            {__('回收站策略')}
                                        </span>
                                    </div>
                                </Button>

                                {
                                    listDocs.length !== 0 ?
                                        <Button
                                            className={classnames(styles['action-button'])}
                                            onClick={(e) => { this.handleClickEmptyRecycle(e, entrySelections[0]) }}
                                            disabled={listDocs.length === 0}
                                        >
                                            <div className={classnames(styles['button-box'])}>
                                                <UIIcon
                                                    className={(styles['action-icon'])}
                                                    code={'\uf09D'}
                                                    size="17px"
                                                >
                                                </UIIcon>
                                                <span className={classnames(styles['button-text'])} >
                                                    {__('清空')}
                                                </span>
                                            </div>
                                        </Button>
                                        :
                                        null
                                }

                                {
                                    listDocs.length !== 0 ?
                                        <Button
                                            className={classnames(styles['action-button'])}
                                            onClick={this.handleClickViewSize.bind(this)}
                                        >
                                            <div className={classnames(styles['button-box'])}>
                                                <UIIcon
                                                    className={(styles['action-icon'])}
                                                    code={'\uf053'}
                                                    size="17px"
                                                >
                                                </UIIcon>
                                                <span className={classnames(styles['button-text'])} >
                                                    {__('查看大小')}
                                                </span>
                                            </div>
                                        </Button>
                                        :
                                        null
                                }

                            </div>
                }
            </div>

        )
    }

}



