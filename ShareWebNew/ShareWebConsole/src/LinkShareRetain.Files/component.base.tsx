import * as React from 'react'
import { trim } from 'lodash'
import { getConfig } from '../../core/config/config';
import { EVFS, ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { formatterName } from '../../core/linkshareretain/linkshareretain'
import __ from './locale';

const ShowLimit = 200;   // 每页限制显示的个数

export default class LinkShareRetainFilesBase extends React.Component<Console.LinkShareRetainFiles.Props, any> {

    state: Console.LinkShareRetainFiles.State = {
        results: [],

        value: '',

        paginator: {
            page: 1,
            total: 0,
            limit: ShowLimit
        },

        searchingNow: false,

        fileInfo: null
    }

    maxId: number;         // 搜索结果中最大的id, 翻页发送请求需要

    useHttps: boolean;     // 是否使用https下载

    reqHost: string;       // 从存储服务器下载数据时的请求地址

    lastSearchValue: string = null;   // 上次搜索框的值

    prefix: string = '';     // 路径前缀

    componentWillMount() {
        this.init()
    }

    /**
     * 初始化
     * (1)获取useHttps，reqHost
     * (2)检查验证码是否已经验证过，如果没有验证，显示'安全验证'页面；如果验证过，显示'文件留底'页面
     */
    async init() {
        const [useHttps, reqHost, prefix] = await Promise.all(
            [
                ShareMgnt('GetGlobalConsoleHttpsStatus'),
                ShareMgnt('GetHostName'),
                getConfig('internal_link_prefix')
            ])
        this.useHttps = useHttps;
        this.reqHost = reqHost;
        this.prefix = prefix;

        this.listAllLinkShareRetainFiles()
    }

    /**
     * 显示所有文件
     */
    async listAllLinkShareRetainFiles() {
        const {results, total} = await this.search('')

        this.setState({
            results,
            searchingNow: false,
            paginator: {
                ...this.state.paginator,
                page: 1,
                total
            }
        })
    }

    /**
     * 搜索
     * @param value 搜索值
     */
    async search(value: string): Promise<{ results: ReadonlyArray<any>, total: number }> {

        if (value !== this.lastSearchValue) {
            // 当搜索值发生变化了在搜索
            this.lastSearchValue = value;
            const newValue = trim(value)
            this.setState({
                searchingNow: true
            })

            const {count, maxId} = await EVFS('GetOutLinkAccessInfoCount', [newValue])
            this.maxId = maxId;
            const results = await EVFS('GetPageOutLinkAccessInfo', [{
                'ncTEVFSGetPageOutLinkAccessInfoParam': {
                    name: newValue,
                    maxId,
                    start: 0,
                    limit: ShowLimit
                }
            }])

            return { results, total: count }
        } else {
            // 搜索值没有发生变化，返回state中的值
            return {
                results: this.state.results,
                total: this.state.paginator.total
            }
        }
    }

    /**
     * 搜索完成
     */
    handleLoad({results, total}: { results: ReadonlyArray<any>, total: number }): void {
        this.setState({
            results,
            searchingNow: false,
            paginator: {
                ...this.state.paginator,
                page: 1,
                total
            }
        })
    }

    /**
     * 搜索框的值发生变化
     */
    async handleValueChange(value: string) {
        this.setState({
            value
        })

        // 为了解决清空搜索框却不触发搜索
        if (!trim(value) && !this.state.searchingNow) {
            this.listAllLinkShareRetainFiles()
        }
    }

    /**
     * 记录日志
     */
    log(docname: string, modified: number, rev: number): Promise<void> {
        return manageLog(
            ManagementOps.DOWNLOAD,
            __('下载外链留底文件“${name}”', { name: docname }),
            __('版本ID：${id}', { id: rev }),
            Level.INFO
        );
    }

    /**
     * 下载文件
     */
    async downloadFile({gns, rev, fileName}) {
        const {auth_request, name, modified} = await EVFS('OSDownload',
            [gns, '', 'QUERY_STRING', this.reqHost, this.useHttps, formatterName(fileName, rev)])

        this.log(name, modified, rev).then(() => {
            window.location.assign(auth_request[1])
        })
    }

    /**
     * 翻页
     */
    async handlePageChange(page: number) {
        const { value } = this.state;
        const results = await EVFS('GetPageOutLinkAccessInfo', [{
            'ncTEVFSGetPageOutLinkAccessInfoParam': {
                name: trim(value),
                maxId: this.maxId,
                start: (page - 1) * ShowLimit,
                limit: ShowLimit
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

    /**
     * 查看详情
     * @param id 记录id
     */
    async viewFileInfo(id: string) {
        this.setState({
            fileInfo: await EVFS('GetOutLinkFileInfo', [id])
        })
    }
}