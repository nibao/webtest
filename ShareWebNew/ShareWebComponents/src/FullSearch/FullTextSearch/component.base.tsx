import * as React from 'react';
import * as _ from 'lodash';
import { search, customAttribute } from '../../../core/apis/efshttp/search/search';
import { customAttribute as getCustomAttrs } from '../../../core/attributes/attributes';
import { getConfig } from '../../../core/config/config';
import { add, del, check } from '../../../core/apis/efshttp/favorites/favorites';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { DateType } from './helper';
import WebComponent from '../../webcomponent';
import __ from './locale';


export default class FullTextSearchBase extends WebComponent<Components.FullSearch.FullTextSearch.Props, Components.FullSearch.FullTextSearch.State> {

    static defaultProps = {
        searchKeys: '',
        searchRange: { docid: '', root: true },
        searchTags: ''
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }


    state = {

        /**
         * 搜索结果数组
         */
        resultDocs: null,

        /**
         * 搜索结果高亮内容数组
         */
        resultHighlight: {},

        /**
         * 搜索结果中收藏文件数组
         */
        resultCollections: {},

        /**
         * 搜索结果中标签展示状态
         */
        resultTagsShown: {},

        /**
         * 搜索结果列表选中项
         */
        resultSelection: [],

        /**
         * 是否在加载，防止用户提前打开更多筛选项报错
         */
        isLoading: true,

        /**
         * 是否正在搜索, 只是显示一个搜索进度条
         */
        isSearching: false,

        /**
         * 是否显示更多筛选项
         */
        enableMoreCondition: false,

        /**
         * 搜索关键字
         */
        keys: '',

        /**
         * 请求得到的自定义属性集合
         */
        customAttributes: [],

        /**
         * 文档标签
         */
        tagKeys: [],

        /**
         * 总搜索结果条目数
         */
        count: 0,

        /**
         * 搜索条件不满足时的警告
         */
        warning: false,

        /**
         * 搜索关键字有效字段(仅当keys不为空时有效)
         * ['basename', 'content']
         */
        keysfields: ['basename', 'content']


    }

    /**
     * 配置信息
     */
    configs = {};

    /**
     * 延迟触发关键词搜索历史的定时器
     */
    keySearchTimeout: number | null = null;

    /**
     * 延迟触发实时排序的定时器
     */
    sortTimeout: number | null = null;

    /**
     * 搜索范围数组
     */
    searchRange = [];

    /**
     * 用于发送请求的自定义属性数组
     * {
     *    attr: 7, condition: "=", level: 1, value: 1
     * }
     */
    customattr = [];

    /**
     * 搜索关键字有效字段(仅当keys不为空时有效)
     * ['basename', 'content']
     */
    keysfields = ['basename', 'content'];

    /**
     * 大小范围
     */
    sizeRange = {};

    /**
     * 搜索匹配后缀，以点开头
     * ['.exe', '.bat']
     */
    ext = [];

    /**
     * 懒加载页
     */
    lazyStart = 0;

    /**
     * 开始、结束时间范围
     */
    dateRange = [0, 0];

    /**
     * 时间范围类型 ： 不限 0 | 创建 1 | 修改 2
     */
    dateType = DateType.UNLIMITED;

    /**
     * 分页加载起始位置
     */
    start = 0;

    /**
     * 请求返回的查询记录条数
     */
    rows = 20;

    /**
     * 0 查找range下的有权限文件;
     * 1 查找range下的有权限文件和发现共享文件
     * 2 查找range下的发现共享文件
     */
    style = 0;


    /**
     * 排序规则:默认按相关度排序
     */
    sort = '';

    /**
     * 其他类型
     */
    otherTypeInputValue = '';

    /**
     * 懒加载列表实例
     */
    lazyloadListDom = null;

    /**
     * 标签输入框保存状态
     */
    isTagInput = false;

    /**
     * 上一次搜索条件
     */
    lastCondition = null;

    /**
     * 点击搜索按钮时的搜索关键字
     */
    keys = '';

    /**
     * 点击搜索按钮时的标签
     */

    tagKeys = [];

    /**
     * 点击搜索按钮时更多筛选项按钮的状态
     */
    enableMoreCondition = false;


    async componentWillMount() {

        // 请求可用的自定义属性集合
        let customAttributes = await customAttribute();

        customAttributes = (customAttributes === 404 || customAttributes === '404') ? [] : customAttributes

        for (let index = 0; index < customAttributes.length; index++) {
            let attr = customAttributes[index];
            // 若自定义属性集合内含有枚举或层级属性，请求其内容
            if (attr.type === 1 || attr.type === 0) {
                let children = await getCustomAttrs(attr.id);
                let headChild = { name: __('不限'), child: [], unlimited: true, id: -1, level: 1 };
                attr.child = [headChild, ...children];
                attr.parent = null;
                attr.selectValue = headChild;
                attr.titleNode = headChild;
                attr.level = 0;
            }

            // 若自定义属性集合内含有数值或时间属性，添加rangeInfo对象参数，用于保存具体数值和类型
            if (attr.type === 2 || attr.type === 4) {
                attr.rangeInfo = {
                    rangeLeftValue: '',
                    rangeRightValue: '',
                    rangeLeftType: '',
                    rangeRightType: ''
                };
            }
        }

        let tagKeys = this.props.searchTags ? [this.props.searchTags] : [];
        this.searchRange = this.props.searchRange.root ? [] : [this.props.searchRange.docid.replace(/\:/g, '\?') + '*']

        // 获取配置
        this.configs = await getConfig();
        this.setState({
            customAttributes,
            tagKeys,
            keys: this.props.searchKeys,
            enableMoreCondition: tagKeys.length !== 0

        }, async () => {
            this.enableMoreCondition = this.state.enableMoreCondition
            this.keys = this.props.searchKeys
            this.tagKeys = tagKeys
            if (this.state.keys || this.props.searchTags) {
                this.handleLoadSearchKeys();
            }

            // 保证数据加载完毕
            await new Promise((resolve) => this.setState({ isLoading: false }, resolve));

        })

    }

    /**
     * 点击重置按钮
     */
    protected handleReset() {
        this.setState({
            isLoading: true,
            isSearching: false,
            keys: '',

        }, async () => {
            // 请求可用的自定义属性集合
            let { customAttributes } = this.state;

            customAttributes.map((attr) => {
                // 若自定义属性集合内含有枚举或层级属性，请求其内容
                if (attr.type === 1 || attr.type === 0) {
                    let headChild = { name: __('不限'), child: [], unlimited: true, id: -1, level: 1 };
                    attr.parent = null;
                    attr.selectValue = headChild;
                    attr.titleNode = headChild;
                    attr.titleNode.parent = attr;
                }

                // 若自定义属性集合内含有数值或时间属性，添加rangeInfo对象参数，用于保存具体数值和类型
                if (attr.type === 2 || attr.type === 4) {
                    attr.rangeInfo = {
                        rangeLeftValue: '',
                        rangeRightValue: '',
                        rangeLeftType: '',
                        rangeRightType: ''
                    };
                }

            })

            this.configs = await getConfig();
            this.isTagInput = false;
            this.keySearchTimeout = null;
            this.sortTimeout = null;
            this.searchRange = [];
            this.customattr = [];
            this.sizeRange = {};
            this.ext = [];
            this.keysfields = ['basename', 'content'];
            this.lazyStart = 0;
            this.dateRange = [0, 0];
            this.dateType = DateType.MODIFIED;
            this.start = 0;
            this.rows = 20;
            this.style = 0;
            this.sort = '';
            this.keys = '';
            this.tagKeys = [];
            this.enableMoreCondition = false;
            this.setState({
                customAttributes,
                tagKeys: [],
                keysfields: ['basename', 'content']
            }, async () => {
                // 保证数据加载完毕
                await new Promise((resolve) => this.setState({ isLoading: false }, resolve));
                this.refs.conditionBox.resetState();

            })




        });
    }


    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.searchKeys, nextProps.searchKeys)) {
            this.setState({
                keys: nextProps.searchKeys
            })
        }

    }

    /**
     * 搜索函数
     */
    protected handleSearch({ start, keys }) {
        this.setState({
            keys
        }, () => {
            this.keys = keys;
            this.tagKeys = this.state.tagKeys;
            this.enableMoreCondition = this.state.enableMoreCondition;
            this.start = start
            this.handleLoadSearchKeys();
        })

    }

    /**
     * 搜索结果滚动翻页
     */
    protected handleChangePage() {
        this.handleLoadSearchKeys(false);

    }

    /**
     * 点击收藏按钮
     */
    protected async handleClickCollectButton(doc) {
        // 更新DOCS内选中doc的收藏状态
        let { resultCollections } = this.state;

        try {
            if (resultCollections[doc['docid']]) {
                await del(doc);
                this.context.toast(__('取消收藏'))
            } else {
                await add(doc);
                this.context.toast(__('收藏成功'))
            }


            resultCollections[doc['docid']] = !resultCollections[doc['docid']]
            this.setState({
                resultCollections
            })
        } catch (error) {
            error.errcode ?
                this.props.onError(error.errcode, doc)
                :
                this.context.toast(__('AnyShare 客户端已离线'));

        }


    }

    /**
     * 排序功能 
     */
    protected handleClickSortSelection(type) {
        this.sort = type.value;
        this.start = 0;
        this.handleLoadSearchKeys(true);

    }

    /**
     * 搜索函数
     */
    protected handleLoadSearchKeys(keepCondition = false) {
        let start = this.start;
        let rows = this.rows;
        let style = this.style;
        let sort = this.sort;
        // 搜索关键词去空,多个以空格区分的关键词分割后用%20拼接成字符串
        let keys = this.keys.trim().split(/\s+/g).join('%20')

        // 搜索范围数组最后一项为参数，若没有docid则传入doctype
        let range = this.searchRange;

        // 匹配内容
        let keysfields = this.keysfields;

        // 时间范围
        let [beginDate, endDate] = this.dateRange;
        let begin = beginDate === 0 ? 0 : beginDate.getTime() * 1000;
        let end = endDate === 0 ? 0 : endDate.getTime() * 1000;

        let dateType = this.dateType;
        let createtime = {};
        if (dateType === DateType.CREATED) {

            if (begin !== 0 && end !== 0) {
                createtime = { 'condition': '[]', lvalue: begin, rvalue: end }
            } else if (end !== 0) {
                createtime = { 'condition': '<', value: end }
            } else if (begin !== 0) {
                createtime = { 'condition': '>', value: begin }
            } else {
                createtime = {}
            }
            begin = 0
            end = 0
        }

        // 搜索大小范围参数
        let size = this.sizeRange;

        let ext = [];
        let customattr = [];
        let tags = [];

        // 更多筛选项展开时才纳入搜索条件
        if (this.enableMoreCondition) {
            // 文档类型参数
            ext = this.otherTypeInputValue.trim() ? _.uniq(this.ext.concat(this.otherTypeInputValue)) : this.ext

            // 自定义属性
            customattr = this.customattr;

            // 文档标签参数
            tags = this.tagKeys;

            // 如果标签未保存，显示红色边框警告
            if (this.isTagInput) {
                this.refs.conditionBox.refs.tagComboArea.showWarningBorder();

            }
        }

        if (!this.lastCondition || !keepCondition) {
            if (!keys.trim() && ext.length === 0 && !tags[0] && _.keys(size).length === 0 && customattr.length === 0 &&
                (dateType === DateType.CREATED ? _.keys(createtime).length === 0 : begin === 0 && end === 0)) {
                this.setState({ warning: !keepCondition })
                return;
            } else {
                this.setState({ warning: false })
            }

            if (this.isTagInput) {
                return;
            }
        }


        if (this.start === 0) {
            // 如果start为0，代表不是懒加载触发的请求，清空当前搜索结果
            this.setState({
                resultCollections: [],
                resultDocs: [],
                resultHighlight: {},
                resultTagsShown: {},
                count: 0
            });
            this.resetState();
        }



        this.setState({
            isSearching: true
        }, async () => {

            try {

                if (!keepCondition) {
                    this.lastCondition = { rows, style, range, begin, end, keys, keysfields, ext, tags, size, customattr, createtime };
                }

                let { highlighting: resultHighlight, response: { docs: resultDocs, next: next, hits: count } } = await search(
                    keepCondition ?
                        { ...this.lastCondition, sort, start }
                        : { start, rows, style, range, begin, end, keys, keysfields, ext, sort, tags, size, customattr, createtime }
                )


                // 获取收藏状态
                let resultCollections = resultDocs.length ?
                    (await check({ docids: resultDocs.map(({ docid }) => docid) })).
                        reduce((resultCollections, { docid, favorited }) => ({ ...resultCollections, [docid]: favorited }), {})
                    :
                    {}

                // 设置标签展示状态
                let resultTagsShown = resultDocs.reduce((resultTagsShown, { docid }) => ({ ...resultTagsShown, [docid]: false }), {})

                // 搜索条件中的标签优先显示
                resultDocs = resultDocs ? resultDocs.map((doc) => {
                    // 如果搜索条件中不含标签，则移除结果中的标签
                    return { ...doc, tags: tags.length ? [...tags, ..._.difference(doc.tags, this.tagKeys)] : [] }
                })
                    :
                    null;

                this.setState({
                    keysfields,
                    count: count ? count : this.state.count,
                    resultTagsShown: { ...this.state.resultTagsShown, ...resultTagsShown },
                    resultCollections: { ...this.state.resultCollections, ...resultCollections },
                    resultDocs: this.state.resultDocs ? [...this.state.resultDocs, ...resultDocs] : resultDocs,
                    resultHighlight: { ...this.state.resultHighlight, ...resultHighlight },
                }, () => {
                    this.start = next;
                    this.setState({
                        isSearching: false
                    })
                })

            } catch (error) {
                this.context.toast(error.errcode ? getErrorMessage(error.errcode) : __('AnyShare 客户端已离线'));
                this.setState({
                    isSearching: false
                })
            }
        })
    }

    /**
     * 更多条件按钮点击触发
     */
    protected handleMoreConditionChange() {
        this.setState({
            enableMoreCondition: !this.state.enableMoreCondition
        })
    }

    /**
     * 搜索关键词变更
     */
    protected handleSearchKeysChange(keys) {
        this.setState({
            keys
        })
    }

    /**
     * 搜索范围条件变更
     */
    protected async handleSearchRangeChange(searchRange) {
        let range = [];
        if (searchRange['data'].hasOwnProperty('docid')) {
            range = [searchRange['data']['docid'].replace(/\:/g, '\?') + '*']
        } else {
            if (searchRange['data']['doc_type'] === 'father') {
                range = []
            } else {
                // 若选择的是顶层视图，由于无法通过接口请求个人群组文档和共享群组文档的范围GNS，统一为获取该视图下所有入口文档的GNS列表
                range = searchRange['children'].reduce((preList, node) => { return [...preList, node.data] }, [])
                if (range.length === 0) {
                    range = ['gns?//']
                } else {
                    range = range.map((doc) => { let range = doc.docid + '*'; return range.replace(/\:/g, '\?') })

                }

            }
        }

        this.searchRange = range
    }

    /**
     * 搜索内容范围条件变更
     */
    protected handleKeysFieldsChange(keysfields) {
        this.keysfields = keysfields;
    }

    /**
     * 搜索内容大小条件变更
     */
    protected handleSizeRangeChange(sizeRange) {
        this.sizeRange = sizeRange;
    }

    /**
     * 后缀名条件变更
     */
    protected handleExtChange(ext) {
        this.ext = ext;
    }

    /**
     * 自定义属性条件变更
     */
    protected handleCustomAttrChange(customattr) {
        this.customattr = customattr;
    }

    /**
     * 文档标签变更
     */
    protected handleTagKeysChange(tagKeys) {
        this.setState({
            tagKeys
        })
    }

    /**
     * 时间条件变更
     */
    protected handleDateChange(dateRange, dateType) {
        this.dateRange = dateRange;
        this.dateType = dateType;
    }

    /**
     * 点击展示更多标签块按钮
     */
    protected handleClickShowTags(doc) {
        let { resultTagsShown } = this.state;
        resultTagsShown[doc.docid] = !resultTagsShown[doc.docid];
        this.setState({
            resultTagsShown
        })
    }

    /**
     * 点击标签块添加至筛选条件中
     */
    protected handleClickAddTags(tag) {
        let { tagKeys } = this.state;
        tagKeys.indexOf(tag) === -1 && tagKeys.length < 30 ?
            this.setState({
                tagKeys: [...this.state.tagKeys, tag],
                enableMoreCondition: true
            }, () => {
                // 点击标签同时，更多条件栏的滚动条自动定位到该标签的位置
                this.refs.conditionBox.autoLocate();
            })
            :
            this.setState({
                enableMoreCondition: true
            }, () => {
                // 点击标签同时，更多条件栏的滚动条自动定位到该标签的位置
                this.refs.conditionBox.autoLocate();
            })
    }

    /**
     * 其他类型输入框变动
     */
    protected handleOtherTypeInputChange(input) {
        this.otherTypeInputValue = input;
    }

    /**
     * 鼠标聚焦或者任意条件被点击
     */
    protected handleWarningChange() {
        this.setState({
            warning: false
        })
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

    /**
     * 获取标签输入框的保存状态
     */
    protected handleTagInputStatusChange(isTagInput) {
        this.isTagInput = isTagInput;
    }
}