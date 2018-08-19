import * as React from 'react';
import { trim } from 'lodash';
import { EVFS, ShareMgnt } from '../../core/thrift/thrift';
import { getConfig } from '../../core/config/config';
import WebComponent from '../webcomponent';

export const showLimit = 200;   // 每页限制显示的个数

export default class DocRetainBase extends WebComponent<any, any> {

    state: Console.DocRetain.State = {
        results: [],

        value: '',

        paginator: {
            page: 1,
            total: 0,
            limit: showLimit
        },

        searchingNow: false
    }

    maxCreateTime: number; // 搜索结果中最新的文件的时间

    csfLevelEnum;          // 密级枚举

    useHttps: boolean = true;     // 是否使用https下载

    reqHost: string = '';       // 从存储服务器下载数据时的请求地址

    prefix: string = '';        // 路径前缀

    lastSearchValue: string = ''  // 上一次搜索框的值

    async componentWillMount() {

        const [csfLevels, useHttps, reqHost, prefix] = await Promise.all([
            ShareMgnt('GetCSFLevels'),
            ShareMgnt('GetGlobalConsoleHttpsStatus'),
            ShareMgnt('GetHostName'),
            getConfig('internal_link_prefix')
        ])

        this.csfLevelEnum = csfLevels;
        this.useHttps = useHttps;
        this.reqHost = reqHost;
        this.prefix = prefix
    }

    /**
     * 搜索
     */
    protected async search(value: string): Promise<{ results: ReadonlyArray<Console.DocRetain.Result>, total: number }> {

        if (value !== this.lastSearchValue) {
            // 当搜索框的值与上次相比发生变化
            this.lastSearchValue = value
            const newValue = trim(value)

            if (newValue) {

                this.setState({
                    searchingNow: true
                })

                const { count, maxCreateTime } = await EVFS('GetFileInfoCount', [newValue])
                this.maxCreateTime = maxCreateTime;

                const results = await EVFS('GetPageFileInfo', [{
                    'ncTEVFSGetPageFileInfoParam': {
                        name: newValue,
                        maxCreateTime,
                        start: 0,
                        limit: showLimit
                    }
                }])

                return { results, total: count }
            } else {
                return { results: [], total: 0 }
            }
        } else {
            // 搜索值与上次相比没有发生变化，返回state中的值（主要用于搜索框失焦后再聚焦，不触发搜索）
            return {
                results: this.state.results,
                total: this.state.paginator.total
            }
        }
    }

    /**
     * 搜索完成后触发
     */
    protected handleLoad({results, total}: { results: Array<any>, total: number }): void {
        this.setState({
            results,
            paginator: {
                ...this.state.paginator,
                page: 1,
                total,
            },
            searchingNow: false
        })
    }

    /**
     * 搜索框内容发生变化触发
     */
    protected handleChange(value: string) {
        this.setState({
            value
        })
    }

    /**
     * 查看版本
     */
    protected async viewVersion(record: Console.DocRetain.Result) {
        const versions = await EVFS('GetFileRevisions', [record.docId])

        this.setState({
            current: { ...record, versions }
        })

    }

    /**
     * 翻页
     */
    protected async handlePageChange(page: number) {
        const { value } = this.state;

        const results = await EVFS('GetPageFileInfo', [{
            'ncTEVFSGetPageFileInfoParam': {
                name: trim(value),
                maxCreateTime: this.maxCreateTime,
                start: (page - 1) * showLimit,
                limit: showLimit
            }
        }])

        this.setState({
            results,
            paginator: {
                ...this.state.paginator,
                page
            }
        })
    }
} 
