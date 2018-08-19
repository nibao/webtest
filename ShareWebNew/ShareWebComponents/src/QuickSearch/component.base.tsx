import * as React from 'react';
import { map } from 'lodash';
import { getTopEntriesByType } from '../../core/entrydoc/entrydoc';
import { search as quickSearch } from '../../core/apis/efshttp/search/search';
import { buildQuickParam, buildRanges, Range, SearchStatus } from '../../core/search/search';
import { PureComponent } from '../../ui/decorators';
import WebComponent from '../webcomponent';
import { DocState } from './helper';

@PureComponent
export default class QuickSearchBase extends WebComponent<Components.QuickSearch.Props, Components.QuickSearch.State> {
    static defaultProps = {
        platform: 'web'
    }

    state = {
        searchKey: '',
        range: Range.Current,
        status: SearchStatus.Pending,
        results: null,
        selectIndex: -1,
        errorCase: null
    }

    // 搜索目录信息
    rangeInfos = {
        // 文档gns路径
        docid: '',

        // 文档分类类型
        viewType: 0
    }

    keepActive = false;

    /**
     * 上一次的搜索关键字
     */
    lastSearchKey = '';

    componentWillReceiveProps(nextProps) {
        if (this.props.platform === 'pclient') {
            if (nextProps.range && (
                nextProps.range.docid !== this.rangeInfos.docid ||
                nextProps.range.viewType !== this.rangeInfos.viewType ||
                nextProps.range.state === 0 && nextProps.range.relPath !== (this.props.range ? this.props.range.relPath : null)
            )) {
                this.rangeInfos = {
                    docid: nextProps.range.docid,
                    viewType: nextProps.range.viewType
                };
                // 搜索路径改变后重置状态
                this.initialSearchStatus();
            }
        } else {
            if (nextProps.range !== this.props.range) {
                // 搜索路径改变后重置状态
                this.initialSearchStatus();
            }
        }
    }

    /**
     * 初始化组件状态
     */
    private initialSearchStatus() {
        this.setState({
            searchKey: '',
            results: null,
            errorCase: null,
            status: SearchStatus.Pending,
            range: Range.Current
        });
    }

    protected preventHideResults() {
        this.keepActive = true;
    }

    protected cancelAcitveStatus() {
        this.keepActive = false;
    }

    /**
     * 搜索框失焦时触发
     */
    protected handleBlur(e) {
        if (this.keepActive) {
            e.target.focus();
        } else {
            // 将上次的搜索结果置空
            this.setState({
                results: null,
                errorCase: null,
                status: SearchStatus.Pending
            });
        }
    }

    /**
     * 搜索方法
     */
    protected async loader(key: string) {
        if (key.trim()) {
            if (key === this.lastSearchKey && (this.state.status === SearchStatus.Fetching || this.state.status === SearchStatus.SearchInError || this.state.results)) {
                return this.state.results;
            } else {
                const range = this.props.platform === 'pclient' ? await this.getRangeInPClient() : await this.getRange()
                let params = { ...buildQuickParam(key, this.props.rows), range };

                try {
                    const result = await quickSearch(params);
                    return this.normalizer(result);
                } catch (ex) {
                    this.setState({
                        status: SearchStatus.SearchInError,
                        errorCase: {
                            errCode: ex.errcode,
                            errMsg: ex.errmsg,
                        }
                    })
                }
            }
        }
    }

    private async getRange() {
        const { docid } = this.props.range || { docid: null };

        if (this.state.range === Range.All || !docid) {
            return [];
        } else {
            const ranges = buildRanges([docid], this.state.range === Range.CurrentOnly ? true : false);
            return ranges.length ? ranges : ['gns?//'];
        }
    }

    private async getRangeInPClient() {
        let ranges;
        const { docid, viewType } = this.rangeInfos;
        if (this.state.range === Range.All) {
            return [];
        } else {
            if (!docid) {
                if (viewType === 0) {
                    // 当前位于所有顶级视图层,当前目录即所有目录
                    return [];
                } else if (viewType === 1) {
                    // 1代表用户文档，包含个人文档和别人共享的个人文档
                    ranges = buildRanges(
                        map(await getTopEntriesByType(1), 'docid').concat(map(await getTopEntriesByType(2), 'docid')),
                        this.state.range === Range.CurrentOnly ? true : false
                    );
                } else if (viewType === 4) {
                    // 返回值4代表归档库类型，处理为服务端归档库类型5
                    ranges = buildRanges(map(await getTopEntriesByType(5), 'docid'), this.state.range === Range.CurrentOnly ? true : false);
                } else {
                    ranges = buildRanges(map(await getTopEntriesByType(viewType), 'docid'), this.state.range === Range.CurrentOnly ? true : false);
                }
            }
            else {
                ranges = buildRanges([docid], this.state.range === Range.CurrentOnly ? true : false);
            }
            // ranges.length为0表示当前分类下目录为空，发送空数组会导致搜索全部，必须发送一个虚构的gns路径
            return ranges.length ? ranges : ['gns?//'];
        }
    }

    /**
     * 序列化数据
     */
    private normalizer(raw) {
        return raw.response.docs.map(doc => {
            raw.highlighting[doc.docid].basename = raw.highlighting[doc.docid].basename instanceof Array ?
                raw.highlighting[doc.docid].basename : [raw.highlighting[doc.docid].basename];
            return {
                ...doc,
                nameHtml: (raw.highlighting[doc.docid].basename.join('') || doc.basename) + doc.ext,
                name: doc.basename + doc.ext,
                highlighting: raw.highlighting[doc.docid],
                doc: {
                    docid: doc.docid,
                    name: doc.basename + (doc.ext || ''),
                    size: doc.size
                }
            }
        });
    }

    protected handleFetch() {
        if (this.state.searchKey) {
            if (this.lastSearchKey === this.state.searchKey && (this.state.status === SearchStatus.Fetching || this.state.status === SearchStatus.SearchInError || this.state.results)) {
                return;
            } else {
                this.setState({
                    status: SearchStatus.Fetching,
                    selectIndex: -1
                });
            }
        }
    }

    /**
     * 载入搜索结果
     */
    protected loadSearchResult(data: Array<any>) {
        const { range } = this.props;

        this.lastSearchKey = this.state.searchKey;
        if (range && (range.state === DocState.Unsynchronized ||
            // 未同步文档目录
            range.state === DocState.None && range.relPath !== '')) {
            this.setState({
                status: SearchStatus.SearchUnsynchronized
            })
        } else {
            if (data && this.state.searchKey) {
                this.setState({
                    status: SearchStatus.Ok,
                    results: data.length > 0 ? data : []
                });
            } else {
                this.setState({
                    status: SearchStatus.Ok,
                    results: null
                });
            }
        }
    }

    /**
     * 更改关键字
     */
    protected handleValueChange(key: string) {
        if (key) {
            this.setState({
                searchKey: key.trim()
            });
        } else {
            this.setState({
                searchKey: '',
                results: null,
                errorCase: null,
                status: SearchStatus.Pending
            });
            this.lastSearchKey = '';
        }
    }

    /**
     * 清空搜索关键字
     */
    protected clearSearchKey() {
        this.setState({
            searchKey: ''
        });
        this.lastSearchKey = '';
    }

    /**
     * 更改搜索范围
     */
    protected setRange(range) {
        this.lastSearchKey = '';
        this.setState({ range }, () => {
            // 触发搜索
            this.refs.searchbox.load(this.state.searchKey);
        });
    }

    /**
     * 输入框enter事件
     */
    protected handleEnter() {
        const { selectIndex } = this.state;

        // 当前有选中项
        if (selectIndex >= 0) {
            this.props.onSelectItem(this.state.results[selectIndex]);
        } else {
            this.handleGlobalSearch(this.state.searchKey);
        }
    }

    /**
     * 按tab键触发
     */
    private handleTabChange() {
        this.lastSearchKey = '';
        this.setState({
            range: this.state.range === Range.Current ? Range.All : Range.Current
        }, () => {
            // 触发搜索
            this.refs.searchbox.load(this.state.searchKey);
        })
    }

    /**
     * 按向上键触发
     */
    private handleUpArrow() {
        const { results, selectIndex } = this.state;

        if (results && results.length) {
            if (selectIndex === -1) {
                // 没有任何选中项选择最后一个
                this.setState({ selectIndex: results.length - 1 });
            } else if (selectIndex > 0) {
                // 有选中项且不是第一项，选择其上一个
                this.setState({ selectIndex: selectIndex - 1 });
            } else {
                // 选择项是第一个的时候
                this.setState({ selectIndex: results.length - 1 });
            }
        }
    }

    /**
     * 按向下键触发
     */
    protected handleDownArrow() {
        const { results, selectIndex } = this.state;

        if (results && results.length) {
            if (selectIndex === -1) {
                // 没有选中项选择第一个
                this.setState({ selectIndex: 0 });
            } else if ((selectIndex + 1) < results.length) {
                // 有选中项且不是最后一个，选择下一个
                this.setState({ selectIndex: selectIndex + 1 });
            } else {
                // 有选择项且为最后一个，选择第一
                this.setState({ selectIndex: 0 });
            }
        }
    }

    /**
     * List组件selectIndex发生变化时触发
     */
    protected handleSelectionChange(nextselectIndex: number) {
        this.setState({ selectIndex: nextselectIndex });
    }

    /**
     * 键盘事件处理
     */
    protected handleKeyDown(e) {
        if (e.keyCode === 9) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            this.handleTabChange();
        }
        if (e.keyCode === 38) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            this.handleUpArrow();
        }
        if (e.keyCode === 40) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            this.handleDownArrow();
        }
    }

    /**
     * 跳转至高级检索
     */
    protected handleGlobalSearch(searchKey: string) {
        this.props.onRequestGlobalSearch(searchKey, this.state.range === Range.All ? null : this.props.range ? this.props.range.docid : null);
    }

    /**
     * 处理选中项
     */
    protected async handleSelectItem(doc) {
        this.props.onSelectItem(doc);
        this.setState({
            results: null,
            status: SearchStatus.Pending
        })
    }

    /**
     * 点击文档所在路径
     */
    protected async handleClickDir(doc) {
        this.props.onRequestOpenDir(doc);
        this.setState({
            results: null,
            status: SearchStatus.Pending
        })
    }

    /**
     * 输入字符长度不超过100
     */
    protected handleValidator(value) {
        return value.replace(/\s/g, '').length < 101;
    }
}