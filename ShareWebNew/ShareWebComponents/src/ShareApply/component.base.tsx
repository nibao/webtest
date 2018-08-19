import * as React from 'react';
import { noop, pairs } from 'lodash';
import { getApplys, getShareApplyHistory } from '../../core/apis/eachttp/audit/audit';
import { getConfig } from '../../core/config/config';
import { getBasename } from '../../core/myshare/myshare';
import { REQUESTTYPE, AUDITSTATUS, convertAccessType, convertAccessContent } from './helper';
import __ from './locale';

export default class ShareApplyBase extends React.Component<Components.ShareApply.Props, Components.ShareApply.State> {
    static defaultProps = {
        doDirOpen: noop,
        doFilePreview: noop,
        doDownload: noop,
    }

    state = {
        type: REQUESTTYPE.ALL,
        unauditedDocs: [],
        auditedDocs: [],
        allAppplications: [],
        filterResults: undefined,
        selection: undefined,
        searchKey: '',
        searchValue: [],
        csfTextArray: [],
    }

    /**
     * 页面加载时获取数据
     */
    async componentDidMount() {
        await this.getCsfLevels()
        await this.initAllAppplications()
        this.setState({
            filterResults: this.state.allAppplications
        })
    }

    /**
     * 初始化待审核数据
     */
    protected async initUnAuditedDocs() {
        const { csfTextArray } = this.state
        // 请求待审核数据并添加审核状态为“待审核”,转换显示属性（name-文档名称，csfText-文件密级，accessType-申请类型，accessContent-申请内容）
        try {
            let unauditedDocs = [];
            (await getApplys()).applyinfos.map((applyinfo) => {
                const newApplyInfo = Object.assign(applyinfo, {
                    auditStatus: AUDITSTATUS.PENDING,
                    name: getBasename(applyinfo.docname),
                    csfText: applyinfo['csflevel'] ? csfTextArray[applyinfo['csflevel'] - 5] : '---',
                    accessType: convertAccessType(applyinfo['apptype']),
                    applyCsfName: applyinfo.apptype === 5 && applyinfo['detail']['applycsflevel'] ? csfTextArray[applyinfo['detail']['applycsflevel'] - 5] : null,
                })
                newApplyInfo.accessContent = convertAccessContent(applyinfo, newApplyInfo.applyCsfName)

                unauditedDocs = [...unauditedDocs, newApplyInfo]
                return unauditedDocs
            })

            this.setState({
                unauditedDocs
            })
        } catch (error) {
            throw error
        }
    }

    /**
     * 初始化已审核数据
     */
    protected async initAuditedDocs() {
        // TODO:确定start和limit的值
        try {
            let auditedDocs = [];
            (await getShareApplyHistory({ start: 0, limit: -1 })).applyinfos.map((applyinfo) => {
                const { csfTextArray } = this.state

                const newApplyInfo = Object.assign(applyinfo, {
                    createdate: applyinfo.requestdate,
                    name: getBasename(applyinfo.docname),
                    csfText: applyinfo['csflevel'] ? csfTextArray[applyinfo['csflevel'] - 5] : '---',
                    accessType: convertAccessType(applyinfo['apptype']),
                    applyCsfName: applyinfo.apptype === 5 && applyinfo['detail']['applycsflevel'] ? csfTextArray[applyinfo['detail']['applycsflevel'] - 5] : null
                })

                // 已审核的数据根据approveindex和vetoindex是否为-1（-1表示没人通过或者没人否决），添加审核状态“已通过”“已否决”，当两者同时为-1是表示免审核，此时不显示审核员名称，用auditornames来判断
                if (applyinfo.approveindex !== -1 && applyinfo.vetoindex === -1) {
                    newApplyInfo.auditStatus = AUDITSTATUS.PASSED
                } else if (applyinfo.approveindex === -1 && applyinfo.vetoindex !== -1) {
                    newApplyInfo.auditStatus = AUDITSTATUS.VETOED
                } else {
                    newApplyInfo.auditStatus = AUDITSTATUS.FREEAUDIT
                }

                newApplyInfo.accessContent = convertAccessContent(applyinfo, newApplyInfo.applyCsfName)


                auditedDocs = [...auditedDocs, newApplyInfo]
                return auditedDocs
            })
            this.setState({
                auditedDocs: auditedDocs
            })
        } catch (error) {
            throw error
        }
    }

    /** 
     * 合并已审核和待审核数据，并按发起时间排序
     */
    protected async initAllAppplications() {
        await this.initAuditedDocs()
        await this.initUnAuditedDocs()
        const { unauditedDocs, auditedDocs } = this.state
        const allAppplications = unauditedDocs.concat(auditedDocs)

        // 根据createdate属性进行排序
        this.setState({
            allAppplications: allAppplications.sort(this.compare('createdate'))
        })
    }

    /**
     * 按照属性进行排序
     */
    protected compare(property) {
        return function (obj1, obj2) {
            const value1 = obj1[property];
            const value2 = obj2[property];
            return value2 - value1;     // 降序
        }
    }

    /**
     * 系统密级从低到高排序
     */
    private sortSecu(obj) {
        return pairs(obj).sort(function (a, b) {
            return a[1] - b[1];
        }).map(([text]) => {
            return text
        })
    }

    /**
     * 获取密级枚举信息
     */
    private getCsfLevels() {
        return getConfig('csf_level_enum').then(csf_level_enum => {
            this.setState({
                csfTextArray: this.sortSecu(csf_level_enum)
            })
        })
    }

    /**
     * 选择的申请类型发生变化是触发（全部申请，已审核，未审核）
     * @param {any} type 选中的申请类型
     */
    protected handleTypeChange(type) {
        const { searchValue } = this.state
        this.setState({
            type,
        }, () => {
            this.refreshShareList(searchValue)
        })
    }

    /**
     * 搜索结果发生变化时触发
     * @param {any} searchValue 
     */
    protected handleFilterResultChange(searchValue) {
        this.refreshShareList(searchValue)
    }

    /**
     * 刷新显示列表
     */
    private refreshShareList(searchValue) {
        const { type, allAppplications, auditedDocs, unauditedDocs } = this.state
        let docs
        // 根据type属性，选择在那种类型中进行过滤
        switch (type) {
            case REQUESTTYPE.ALL:
                docs = allAppplications
                break;
            case REQUESTTYPE.AUDITED:
                docs = auditedDocs
                break;
            case REQUESTTYPE.PENDING:
                docs = unauditedDocs
                break;
        }

        // 过滤结果
        // const filterResults = docs.filter(doc => {
        //     return searchValue.every((item) => {
        //         switch (item.key) {
        //             case 'name':
        //                 return doc['docname'].indexOf(item.value) !== -1

        //             case 'security':
        //                 return doc['csfText'].indexOf(item.value) !== -1

        //             case 'requestType':
        //                 return doc['accessType'].indexOf(item.value) !== -1

        //             case 'requestContent':
        //                 return doc['accessContent']['prevContent'].indexOf(item.value) !== -1 || doc['accessContent']['midContent'].indexOf(item.value) !== -1 || doc['accessContent']['nextContent'].indexOf(item.value) !== -1

        //             case 'reviewer':
        //                 return doc['auditornames'].indexOf(item.value) !== -1
        //         }

        //     })
        // })

        this.setState({
            filterResults: docs,
            searchValue,
            selection: undefined
        })
    }

    /**
     * 搜索框弹出的下拉列表中显示的文字字样
     */
    protected handleRenderOption(key, value) {
        switch (key) {
            case 'name':
                return __('文档名称：${value}', { value: value });

            case 'security':
                return __('文件密级：${value}', { value: value });

            case 'requestType':
                return __('申请类型：${value}', { value: value });

            case 'requestContent':
                return __('申请内容：${value}', { value: value });

            case 'reviewer':
                return __('审核员：${value}', { value: value });
        }
    }

    /**
     * 搜索框生成的每一个小条目的文字字样
     */
    protected handleRenderComboItem(key, value) {
        switch (key) {
            case 'name':
                return `${__('文档名称')}：${value}`;

            case 'security':
                return `${__('文件密级')}：${value}`;

            case 'requestType':
                return `${__('申请类型')} ：${value}`;

            case 'requestContent':
                return `${__('申请内容')}：${value}`;

            case 'reviewer':
                return `${__('审核员')} ：${value}`;
        }
    }

    /**
     * 只有当文件是待审核时才处理打开文件（已审核的文件后端接口未提供docid，暂时屏蔽打开和下载功能）
     */
    protected handleFilePreview(record) {
        if (record['auditStatus'] === AUDITSTATUS.PENDING) {
            this.props.doFilePreview(record)
        }
    }
}
