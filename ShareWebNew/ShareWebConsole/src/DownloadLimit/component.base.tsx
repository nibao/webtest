import * as React from 'react';
import { addDocDownloadLimitInfo, editDocDownloadLimitObject, editDocDownloadLimitValue, deleteDocDownloadLimitInfo, getDocDownloadLimitInfoCnt, getDocDownloadLimitInfoByPage, searchDocDownloadLimitInfoByPage, searchDocDownloadLimitInfoCnt } from '../../core/thrift/downloadlimit/downloadlimit';
import { ShareMgnt, EVFS } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { NodeType } from '../OrganizationTree/helper';
import WebComponent from '../webcomponent';
import __ from './locale';


interface Props {
    /**
     * 管理员id
     */
    adminId: string;

    /**
     * 管理员账号
     */
    account: string;

    /**
     * 当前用户显示名
     */
    displayName: string;

    /**
     * 重定向到登陆页
     */
    doRedirect: () => void;

    /**
     * 编辑管理员成功
     */
    onEditManagerSuccess: () => void;

}

interface State {
    data: Array,
    searchKey: string,
    showSetMail: boolean,
    showOrganizationPicker: boolean,
    showEditNum: boolean,
    mode: Mode,
    editUsers: Array,
    limit: boolean,
    limitNum: number | string,
    //选中项
    select: object,
    validateState: any,
    start: number,
}

//新增或编辑模式
enum Mode {
    ADD,

    Edit
}

const EMPTY_LIMIT_NUM = 0;

const ADD_LIMIT_VALUE = 50;

export default class DownloadLimitBase extends WebComponent<Props, any> implements State {

    state: State = {
        data: [],
        searchKey: '',
        //显示设置邮箱
        showSetMail: false,
        //显示添加用户弹出框
        showOrganizationPicker: false,
        //显示编辑下载次数弹出框
        showEditNum: false,
        editUsers: [],
        limit: false,
        limitNum: 50 | '',
        select: {},
        //验证状态
        validateState: null,
        start: 0,
        mode: Mode.ADD

    }

    componentWillMount() {
        this.initData()
    }

    private initData() {
        EVFS('GetUserDonwloadLimitStatus', []).then(
            limit => {
                this.setState({
                    limit
                })
            }
        )
        this.refreshData();
    }

    private refreshData() {
        getDocDownloadLimitInfoCnt().then(cnt => {
            getDocDownloadLimitInfoByPage(this.state.start, cnt).then(data => {
                this.setState({
                    data
                })
            });
        });

    }

    showSetMail() {
        this.setState({
            showSetMail: true
        })
    }

    hideSetMail() {
        this.setState({
            showSetMail: false
        })
    }

    editManagerSuccess() {
        this.props.onEditManagerSuccess();
        this.hideSetMail()
    }

    toggleAddLimitDownload(showOrganizationPicker) {
        this.setState({
            showOrganizationPicker
        })
    }

    confirmAddLimitDownload(data) {
        if (this.state.mode === Mode.ADD) {
            addDocDownloadLimitInfo({
                limitValue: ADD_LIMIT_VALUE,
                userInfos: data.reduce((prevs, item) => (
                    item.nodeType === NodeType.USER ? [...prevs, this.getNcTDocDownloadLimitObject({ objectId: item.objectId, objectName: item.objectName })] : prevs
                ), []),
                depInfos: data.reduce((prevs, item) => (
                    item.nodeType !== NodeType.USER ? [...prevs, this.getNcTDocDownloadLimitObject({ objectId: item.objectId, objectName: item.objectName })] : prevs
                ), [])
            }).then(res => {
                this.refreshData();
                this.logAdd(data.map((info, index) => (
                    index === data.length - 1 ? info.objectName : info.objectName + ','
                )), ADD_LIMIT_VALUE);
            });
        } else {
            editDocDownloadLimitObject(
                this.state.select.id,
                data.reduce((prevs, item) => (
                    item.nodeType === NodeType.USER ? [...prevs, this.getNcTDocDownloadLimitObject({ objectId: item.objectId, objectName: item.objectName })] : prevs
                ), []),
                data.reduce((prevs, item) => (
                    item.nodeType !== NodeType.USER ? [...prevs, this.getNcTDocDownloadLimitObject({ objectId: item.objectId, objectName: item.objectName })] : prevs
                ), [])
            ).then(res => {
                this.setState({
                    data: this.state.data.map(info => (
                        this.state.select.id === info.id ?
                            {
                                ...info,
                                userInfos: data.reduce((prevs, item) => (
                                    item.nodeType === NodeType.USER ? [...prevs, { objectId: item.objectId, objectName: item.objectName }] : prevs
                                ), []),
                                depInfos: data.reduce((prevs, item) => (
                                    item.nodeType !== NodeType.USER ? [...prevs, { objectId: item.objectId, objectName: item.objectName }] : prevs
                                ), [])
                            }
                            :
                            info
                    ))
                })
                this.logEdit(data.map((info, index) => (
                    index === data.length - 1 ? info.objectName : info.objectName + ','
                )), this.state.select.limitValue);
            })
        }
        this.toggleAddLimitDownload(false);
    }

    setLoadingStatus() {
        // CoverLayer(1, __('正在加载......'))
    }

    private getNcTDocDownloadLimitObject(ncTDocDownloadLimitObject) {
        return { ncTDocDownloadLimitObject }
    }

    /**
    * 搜索模板
    */
    searchData(key: string) {
        if (key) {
            return searchDocDownloadLimitInfoCnt(key).then(cnt => {
                return searchDocDownloadLimitInfoByPage(key, this.state.start, cnt)
            })
        } else {
            return this.refreshData()
        }
    }

    onLoad(data) {
        this.setState({
            data
        })
    }

    /**
     * 搜索关键字发生改变
     * @param key 
     */
    searchChange(key: string) {
        this.setState({
            searchKey: key
        })
    }

    /**
    * 新增用户
    */
    addUser() {
        this.setState({
            showOrganizationPicker: true,
            editUsers: [],
            mode: Mode.ADD
        })
    }

    /**
     * 编辑用户
     * @param users 
     */
    editUser(users, depts, edit) {
        this.setState({
            showOrganizationPicker: true,
            editUsers: [
                ...users.map(user => (this.convererInData(user, NodeType.USER)
                )),
                ...depts.map(dept => (this.convererInData(dept, NodeType.DEPARTMENT)
                ))],
            select: edit,
            mode: Mode.Edit
        })
    }

    /**
    * 编辑下载次数
    */
    editLimitNum(limitNum, edit) {
        this.setState({
            showEditNum: true,
            select: edit,
            limitNum
        })
    }


    /**
     * 删除下载限制
     * @param id 
     */
    deleteDownload(id, record) {
        deleteDocDownloadLimitInfo(id).then(res => {
            this.setState({
                data: this.state.data.filter(o => o.id !== id)
            })
            let data = [...record.userInfos, ...record.depInfos];
            this.logDelete(
                data.map((info, index) => (
                    index === data.length - 1 ? info.objectName : info.objectName + ','
                )), record.limitValue)
        })
    }

    /**
      * 转换数据
      */
    convererOutData(value) {
        return {
            objectId: value.id,
            objectName: value.name,
            nodeType: value.type
        }
    }

    /**
     * 转换数据
     */
    convererInData(value, type) {
        return {
            id: value.objectId,
            name: value.objectName,
            type
        }
    }


    changeLimit(limit) {
        EVFS('SetUserDownloadLimitStatus', [limit]).then(res => {
            this.setState({
                limit
            })
            this.logSwitch(limit);
        })
    }

    cancelEditLimitNum() {
        this.setState({
            showEditNum: false,
            validateState: null
        })
    }

    setLimitNum(limitNum) {
        this.setState({
            limitNum,
            validateState: null
        })
    }

    set() {
        if (this.state.limitNum === '') {
            this.setState({
                validateState: EMPTY_LIMIT_NUM
            })
            return
        }
        editDocDownloadLimitValue(this.state.select.id, this.state.limitNum).then(res => {
            this.setState({
                data: this.state.data.map(info =>
                    this.state.select.id === info.id ? { ...info, limitValue: this.state.limitNum } : info
                ),
                showEditNum: false
            })
            let data = [...this.state.select.userInfos, ...this.state.select.depInfos];
            this.logEdit(data.map((info, index) => (
                index === data.length - 1 ? info.objectName : info.objectName + ','
            )), this.state.limitNum);
        })

    }

    /**
     * 开启/关闭限制用户下载开关日志
     * @param limit 开关状态
     */
    private logSwitch(limit: boolean) {
        manageLog(ManagementOps.SET, limit ? __('启用 限制指定用户每日文件下载次数') : __('关闭 限制指定用户每日文件下载次数'), '', Level.INFO);
    }

    /**
     * 新增用户日志
     * @param users 
     * @param limitValue 
     */
    private logAdd(users, limitValue) {
        manageLog(ManagementOps.SET, __('设置了“${result}”的每日下载文件最大次数：${limitValue}次', { result: users, limitValue }), '', Level.INFO);
    }

    /**
     * 编辑用户日志
     * @param users 
     * @param limitValue 
     */
    private logEdit(users, limitValue) {
        manageLog(ManagementOps.SET, __('设置了“${result}”的每日下载文件最大次数：${limitValue}次', { result: users, limitValue }), '', Level.INFO);
    }

    /**
     * 删除用户日志
     * @param users 
     * @param limitValue 
     */
    private logDelete(users, limitValue) {
        manageLog(ManagementOps.SET, __('取消了“${result}”的每日下载文件最大次数：${limitValue}次', { result: users, limitValue }), '', Level.INFO);

    }

} 