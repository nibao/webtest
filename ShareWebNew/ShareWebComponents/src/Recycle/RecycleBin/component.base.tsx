import * as React from 'react';
import { last, noop } from 'lodash';
import WebComponent from '../../webcomponent';
import { get } from '../../../core/apis/eachttp/managedoc/managedoc';
import { list, getRetentionDays } from '../../../core/apis/efshttp/recycle/recycle';
import * as fs from '../../../core/filesystem/filesystem';
import { PureComponent } from '../../../ui/decorators';
import { OperationType } from '../helper';
import * as _ from 'lodash';
import __ from './locale';

let searchKeyTag = 0;

@PureComponent
export default class RecycleBinBase extends WebComponent<Components.RecycleBin.Props, Components.RecycleBin.State> {

    state = {
        isLoading: false,
        isEntry: true,
        entryDocs: [],
        listDocs: [],
        entrySelections: [],
        listSelections: [],

        searchKeys: [],
        searchValue: '',

        isSortSelected: false,
        sortAnchor: {},
        sortBy: this.props.historySort.by ? this.props.historySort.by : 'time',
        sortOrder: this.props.historySort.sort ? this.props.historySort.sort : 'desc',

        operationObj: {
            docs: [],
            type: OperationType.NOOP
        },

        mouseAnchor: [],
        isContextMenu: false,
        searchAnchor: {},
        isSearchMenu: false,
        isSearchEmpty: false,

        duration: -1,
        servertime: 0,
        searchFocusStatus: false,
        path: '',
        scroll: false,
        lazyLoad: true,
        filterInputValue: '',
        listErrors: [],
        confirmError: noop
    }

    start = 0; // 初始加载位置

    limit = 20; // 每次加载的条数

    listDom = null; // 列表实例

    lazyloadListDom = null; // 懒加载列表实例

    searchInput = null; // 输入框实例

    keepSelected = false; // 是否刷新后记住勾选状态

    searchFilterInput = []; // 输入块前置输入框实例集合

    componentWillMount() {
        fs.clearCache()
        this.props.historyDoc ?
            this.handleLoadList(this.props.historyDoc, { by: this.props.historySort.by, sort: this.props.historySort.sort })
            :
            this.handleLoadEntry()
    }

    componentDidUpdate(preProps, preState) {
        // 比较可见区域与滚动区域高度，若一致则认为没有滚动条，否则修改表头样式，整体向左偏移
        let preList = preProps.listDocs
        let nextList = this.props.listDocs;
        if (!_.isEqual(nextList, preList)) {
            this.lazyloadListDom ?
                this.setState({
                    scroll: this.lazyloadListDom.scrollView.clientHeight < this.lazyloadListDom.scrollView.scrollHeight ? true : false
                })
                :
                null
        }
        let preEntry = preProps.entryDocs
        let nextEntry = this.props.entryDocs;
        if (!_.isEqual(nextEntry, preEntry)) {
            this.listDom ?
                this.setState({
                    scroll: this.listDom.clientHeight < this.listDom.scrollHeight ? true : false
                })
                :
                null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.historyDoc, nextProps.historyDoc)) {
            if (!nextProps.historyDoc) {
                this.handleLoadEntry()
            }
        }

        if (!_.isEqual(this.props.operationObj, nextProps.operationObj)) {
            this.setState({
                operationObj: nextProps.operationObj
            })
        }

        if (!_.isEqual(this.props.listDocs, nextProps.listDocs)) {
            this.setState({
                listDocs: nextProps.listDocs,
                isLoading: true,
                lazyLoad: false
            }, () => {
                this.setState({
                    isLoading: false,
                    lazyLoad: true
                })
            })
        }
        if (!_.isEqual(this.props.listSelections, nextProps.listSelections)) {
            this.setState({
                listSelections: nextProps.listSelections
            })
        }

        if (!_.isEqual(this.props.entryDocs, nextProps.entryDocs)) {
            this.setState({
                entryDocs: nextProps.entryDocs
            })
        }

        if (!_.isEqual(this.props.entrySelections, nextProps.entrySelections)) {
            this.setState({
                entrySelections: nextProps.entrySelections
            })
        }

        if (!_.isEqual(this.props.historySort, nextProps.historySort)) {
            this.setState({
                sortBy: nextProps.historySort.by,
                sortOrder: nextProps.historySort.sort
            })
        }

    }


    /**
     * 选中入口文档
     */
    protected handleSelectedEntry(selection) {
        this.setState({
            entrySelections: selection
        }, () => {
            this.props.handleEntrySelectionChange(selection)
        })
    }

    /**
     * 选中所有所有文档
     */
    protected handleSelectedAll(checked) {

        if (this.state.isEntry) {
            let { entryDocs, entrySelections } = this.state;
            this.setState({
                entrySelections: entryDocs.length !== entrySelections.length ? this.state.entryDocs : []
            }, () => {
                this.props.handleEntrySelectionChange(this.state.entrySelections)
            })
        } else {
            if (!checked) {
                this.setState({
                    listSelections: []
                }, () => {
                    this.props.handleListSelectionChange(this.state.listSelections)
                })
            } else {
                this.setState({
                    isLoading: true,
                    lazyLoad: false
                }, async () => {

                    // 回收站列表内点击全选后，触发获取全部回收站文件请求
                    let { dirs, files } = await list({ docid: this.state.entrySelections[0].docid, by: this.state.sortBy, sort: this.state.sortOrder, });
                    //  避免通过查看文件夹大小获得size属性后影响图标生成
                    dirs = dirs.map((dir) => {
                        return { isdir: true, ...dir };
                    });
                    // 将dirs 与 files进行拼接
                    let listDocs = [...dirs, ...files]
                    this.start = listDocs.length - this.limit;
                    this.setState({
                        listDocs,
                        listSelections: listDocs
                    }, () => {
                        this.setState({
                            isLoading: false,
                            lazyLoad: true,
                        })
                        this.props.handleListSelectionChange(this.state.listSelections)
                        this.props.handleListDocsChange(this.state.listDocs);
                    })
                })
            }


        }

    }
    /**
     * 点击入口文档名称,进入对应的回收站库
     */
    protected async handleClickEntry(e, docinfo) {
        e.stopPropagation();
        this.handleLoadList(docinfo, {});
        this.start = 0;
    }

    /**
     * 双击入口文档行，进入对应的回收站
     */
    protected async handleDoubleClickEntry(e, selection, index) {
        this.handleLoadList(selection, {});
        this.start = 0;
    }

    /**
     * 右键打开功能菜单
     */
    protected handleContextMenu(e, selection, index) {
        e.preventDefault();
        if (this.state.isEntry) {
            this.setState({
                mouseAnchor: [e.clientX, e.clientY],
                entrySelections: [selection],
                isContextMenu: !this.state.isContextMenu
            })
            this.props.handleEntrySelectionChange([selection])
        } else {
            this.setState({
                mouseAnchor: [e.clientX, e.clientY],
                listSelections: [selection],
                isContextMenu: !this.state.isContextMenu
            })
            this.props.handleListSelectionChange([selection])
        }

    }

    /**
     * 点击空白处隐藏右键菜单
     */
    protected handleHideContextMenu() {
        this.setState({
            isContextMenu: false
        })
    }

    /**
     * 点击空白处隐藏排序菜单
     */
    protected handleHideSortMenu() {
        this.setState({
            isSortSelected: false
        })
    }

    /**
     * 点击空白处隐藏搜索菜单
     */
    protected handleHideSearchMenu() {
        this.setState({
            isSearchMenu: false
        })
    }

    /**
     * 点击查看大小
     */
    protected async handleClickViewSize() {

        this.setState({
            isContextMenu: false
        }, () => {
            this.props.handleClickOperationBtn({ docs: this.state.isEntry ? this.state.entrySelections : this.state.listSelections.length ? this.state.listSelections : this.state.entrySelections, type: OperationType.VIEWSIZE });
        })
    }

    /**
     * 点击查看大小按钮
     */
    protected handleClickViewSizeIcon(e, selectDoc) {
        e.stopPropagation();
        this.state.isEntry ?
            this.setState({
                entrySelections: [selectDoc],
                isContextMenu: false
            }, () => {
                this.props.handleEntrySelectionChange([selectDoc])
                this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.VIEWSIZE });

            })
            :
            this.setState({
                listSelections: [selectDoc],
                isContextMenu: false
            }, () => {
                this.props.handleListSelectionChange([selectDoc])
                this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.VIEWSIZE });

            })

    }

    /**
     * 点击设置回收站策略按钮
     */
    protected handleClickStorageBtn(e, selectDoc) {
        e.stopPropagation();
        this.state.isEntry ?
            this.setState({
                entrySelections: [selectDoc],
                isContextMenu: false
            }, () => {
                this.props.handleEntrySelectionChange([selectDoc])
                this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.STORATEGY })
            })
            :
            this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.STORATEGY })


    }


    /**
     * 清空回收站
     */
    protected handleClickEmptyRecycle(e, selection) {
        e.stopPropagation();
        this.state.isEntry ?
            this.setState({
                entrySelections: [selection],
                isContextMenu: false
            }, () => {
                this.props.handleEntrySelectionChange([selection])
                this.props.handleClickOperationBtn({ docs: [selection], type: OperationType.EMPTY })
            })
            :
            this.props.handleClickOperationBtn({ docs: [selection], type: OperationType.EMPTY })
    }


    /**
     * 删除回收站文件
     */
    protected handleClickDeleteRecycle() {
        this.setState({
            isContextMenu: false
        }, () => {
            this.props.handleClickOperationBtn({ docs: this.state.listSelections, type: OperationType.DELETE })
        });
    }

    /**
     * 点击delete按钮，删除回收站文件
     */
    protected handleClickDeleteRecycleIcon(e, selectDoc) {
        e.stopPropagation();
        this.setState({
            listSelections: [selectDoc]
        }, () => {
            this.props.handleListSelectionChange([selectDoc])
            this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.DELETE })
        })
    }


    /**
     * 点击还原选中文件
     */
    protected handleClickRestoreRecycle() {
        this.setState({
            isContextMenu: false
        }, () => {
            this.props.handleClickOperationBtn({ docs: this.state.listSelections, type: OperationType.RESTORE })
        });
    }

    /**
     * 点击restore按钮，还原回收站文件
     */
    protected handleClickRestoreRecycleIcon(e, selectDoc) {
        e.stopPropagation();
        this.setState({
            listSelections: [selectDoc]
        }, () => {
            this.props.handleListSelectionChange([selectDoc])
            this.props.handleClickOperationBtn({ docs: [selectDoc], type: OperationType.RESTORE })
        });
    }

    /**
     * 选中回收站文件
     */
    protected handleSelectedList(selection) {
        this.setState({
            listSelections: selection
        })
        this.props.handleListSelectionChange(selection)
    }

    /**
     * 点击导航栏回收站文字按钮
     */
    protected async handleClickPath() {
        await this.handleLoadEntry();
    }

    /**
     * 监听搜索框变化
     */
    protected handleSearchInputChange(e) {
        // 发生改变时且输入框不为空时，出现下拉菜单
        // 正向操作：输入，选中，显示
        this.setState({
            searchValue: e.target.value
        })
    }

    /**
     * 搜索框聚焦事件
     */
    protected handleSearchFocus(e) {
        this.setState({
            searchAnchor: e.currentTarget,
            isSearchMenu: true,
            searchFocusStatus: true
        })
    }

    timeout = null;
    /**
     * 搜索框失焦事件
     */
    protected handleSearchBlur() {
        this.setState({
            searchFocusStatus: false
        })


    }
    /**
     * 下拉菜单外点击触发消失
     */
    protected handleHideSearchFiltersMenu() {
        this.setState({
            isSearchMenu: false
        })
    }

    /**
     * 搜索框下拉菜单点击事件
     */
    protected handleClickSearchMenu(index, e) {
        let value = {
            searchKeyTag: searchKeyTag++,
            index,
            value: this.state.searchValue.trim()
        }

        this.setState({
            searchKeys: [...this.state.searchKeys, value],
            searchValue: '',
        }, () => {
            this.refs.searchInput.focus();
            this.handleDecomposeSearchKeys();
        });

    }

    /**
     * 搜索框删除事件
     */
    protected handleSearchDelete(e) {
        let { searchKeys } = this.state;
        if (e.keyCode === 8 && (!this.state.searchValue || this.refs.searchInput.selectionStart === 0)) {
            if (this.state.searchKeys.length === 0) {
                return;
            }
            this.setState({
                searchKeys: searchKeys.slice(0, searchKeys.length - 1)
            }, () => {
                this.handleDecomposeSearchKeys();
                this.searchFilterInput = this.searchFilterInput.slice(1)
            });
        }
        // 如果输入框为空 && 按键为左方向键
        if (e.keyCode === 37 && (!this.state.searchValue || this.refs.searchInput.selectionStart === 0) && this.searchFilterInput.length > 0) {
            this.searchFilterInput[0].focus();
        }
    }

    /**
     * 前置输入框按键监听
     */
    protected handleSearchFilterDelete(e, index) {
        let { searchKeys } = this.state;
        if (e.keyCode === 8 && index + 1 !== this.searchFilterInput.length) {
            this.setState({
                searchKeys: [...searchKeys.slice(0, this.searchFilterInput.length - index - 2), ...searchKeys.slice(this.searchFilterInput.length - index - 1, searchKeys.length)]
            }, () => {
                this.handleDecomposeSearchKeys();
                this.searchFilterInput = [...this.searchFilterInput.slice(0, index + 1), ...this.searchFilterInput.slice(index + 2, this.searchFilterInput.length)]
            });
        }
        // 如果输入框为空 && 按键为左方向键
        if (e.keyCode === 37 && index + 1 !== this.searchFilterInput.length) {
            this.searchFilterInput[index + 1].focus();
        }
        // 如果输入框为空 && 按键为右方向键
        if (e.keyCode === 39) {
            if (index === 0) {
                this.refs.firstFilterInput.focus();
                this.refs.searchInput.focus();
            } else {
                this.searchFilterInput[index - 1].focus();
            }

        }
    }

    /**
     * 禁止输入任何字符，只触发聚焦光标
     */
    protected handleStopInput(e) {
        this.setState({
            filterInputValue: ''
        })
    }

    /**
     * 点击删除搜索关键词
     */
    protected handleDeleteSearchKey(e, key, index) {
        let { searchKeys } = this.state;
        this.searchFilterInput = [];
        // 从searchKeys中找出searchKeyTag值相同的对象，然后从数组中移除
        let deleteKeyIndex = _.findIndex(searchKeys, (k) => {
            return k['searchKeyTag'] === key['searchKeyTag']
        })

        this.setState({
            searchKeys: [...searchKeys.slice(0, deleteKeyIndex), ...searchKeys.slice(deleteKeyIndex + 1, searchKeys.length)]
        }, () => {
            this.handleDecomposeSearchKeys();
            this.searchFilterInput = [...this.searchFilterInput.slice(0, index), ...this.searchFilterInput.slice(index + 1, this.searchFilterInput.length)]
        });
    }

    /**
     * 点击清空搜索关键词
     */
    protected handleEmptySearchKey(e) {
        this.setState({
            searchKeys: [],
            searchValue: '',
        }, () => {
            this.handleDecomposeSearchKeys();
        });
    }

    /**
     * 点击排序按钮
     */
    protected handleClickSelectBtn(e) {
        e.stopPropagation();
        this.setState({
            sortAnchor: e.currentTarget,
            isSortSelected: !this.state.isSortSelected
        })
    }

    /**
     * 点击排序选项
     */
    protected handleClickSelection(e, sortBy, sortOrder) {

        // 触发重新加载回收站文件列表
        this.setState({
            sortBy,
            sortOrder,
            isSortSelected: false
        }, () => {
            this.handleDecomposeSearchKeys();
        })
    }

    /**
     * 获取入口文档库
     */
    handleLoadEntry() {
        this.setState({
            isEntry: true,
            isLoading: true,
            entrySelections: [],
            searchKeys: [],
            searchValue: '',
        }, async () => {
            this.props.handlePathChange(null, this.state.sortOrder, this.state.sortBy)
            let { docinfos: entryDocs } = await get();
            this.setState({
                entryDocs
            }, async () => {
                this.props.handleIsEntry(this.state.isEntry);
                this.props.handleEntrySelectionChange([])
                this.props.handleEntryDocsChange(this.state.entryDocs);
                this.setState({ isLoading: false });
            })
        })
    }

    /**
     * 刷新页面
     */
    handleRefresh = () => {
        this.setState({
            isContextMenu: false
        }, () => {
            this.state.isEntry ? this.handleLoadEntry() : this.handleLoadList(this.state.entrySelections[0], {});
            this.start = 0;
        })
    }
    /**
     * 触发懒加载
     */
    protected handleLazyLoad() {
        this.start = this.start + this.limit;
        this.keepSelected = true;
        this.handleDecomposeSearchKeys(this.start);
        // this.handleLoadList(this.state.entrySelections[0], { start: this.start, by: this.state.sortBy, sort: this.state.sortOrder });
    }

    /**
     * 获取回收站文件列表
     */
    handleLoadList(docinfo, { by = this.state.sortBy, sort = this.state.sortOrder, start = 0, limit = 20, name = [], path = [], editor = [] }) {
        if (start === 0) {
            // 如果start为0，代表不是懒加载触发的请求，清空当前搜索结果
            this.setState({
                listDocs: [],
                servertime: 0
            });
            this.resetState();
            this.start = 0;
        }

        this.setState({
            lazyLoad: false,
            isEntry: false,
            isLoading: true,
            entrySelections: [docinfo],
            sortBy: by,
            sortOrder: sort,
        }, async () => {
            try {
                this.props.handlePathChange(docinfo, sort, by)
                let crumbs = await fs.getDocsChain(docinfo)
                const currentDoc = _.last(crumbs)
                this.setState({
                    path: currentDoc.name
                })
                let { dirs, files, servertime } = await list({ docid: docinfo['docid'], by, sort, start, limit, name, path, editor });
                let { days } = await getRetentionDays({ docid: docinfo['docid'] })
                // 避免通过查看文件夹大小获得size属性后影响图标生成
                dirs = dirs.map((dir) => {
                    return { isdir: true, ...dir };
                });
                // 将dirs 与 files进行拼接
                let listDocs = [...this.state.listDocs, ...dirs, ...files]

                this.setState({
                    listDocs,
                    isSearchEmpty: listDocs.length === 0 && this.state.isSearchEmpty && this.state.searchKeys.length,
                    duration: days,
                    servertime
                });

                this.props.handleEntrySelectionChange(this.state.entrySelections);
                this.props.handleIsEntry(this.state.isEntry);
                this.props.handleListDocsChange(this.state.listDocs);
                this.keepSelected ? null : this.props.handleListSelectionChange([]);
                this.keepSelected = false;
            } catch (e) {
                /**
                 * 列举目录出错
                 */
                await new Promise(resolve => {
                    this.setState({
                        listErrors: [...this.state.listErrors, e],
                        confirmError: resolve
                    })
                })
                this.setState({
                    listErrors: this.state.listErrors.slice(1)
                })
                if (e && e.upperDocsChain) {
                    this.props.handlePathChange(last(e.upperDocsChain), sort, by)
                }
            } finally {
                this.setState({
                    isLoading: false,
                    lazyLoad: true
                })
            }
        });
    }

    /**
     * 解析关键词数组和排序数组后重新加载回收站文件列表
     */
    private handleDecomposeSearchKeys(start = 0) {
        // 解析searchKeys，分成三组数组
        let keys = this.state.searchKeys;
        let newKeys = { 'path': [], 'editor': [], 'name': [] };
        keys.map((key) => {
            newKeys['name'] = key['index'] === __('文档名称') ? [...newKeys['name'], key['value']] : newKeys['name'];
            newKeys['editor'] = key['index'] === __('删除者') ? [...newKeys['editor'], key['value']] : newKeys['editor']
            newKeys['path'] = key['index'] === __('原位置') ? [...newKeys['path'], key['value']] : newKeys['path']
        });
        this.setState({
            isSearchEmpty: true
        }, () => {
            this.handleLoadList(this.state.entrySelections[0],
                {
                    start,
                    by: this.state.sortBy,
                    sort: this.state.sortOrder,
                    name: newKeys['name'],
                    path: newKeys['path'],
                    editor: newKeys['editor'],
                });
        })

    }

    /**
     * 获取列表实例
     */
    handleGetListRef(ref) {
        this.listDom = ref;
    }

    /**
     * 获取懒加载列表实例
     */
    handleGetLazyLoadRef(ref) {
        this.lazyloadListDom = ref;
    }

    /**
     * 重置懒加载状态
     */
    resetState() {
        if (this.lazyloadListDom) {
            this.lazyloadListDom.reset();
        }
    }
}