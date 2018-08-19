import * as React from 'react';
import { noop } from 'lodash';
import { timer } from '../../util/timer/timer';
import { usrmGetUserDocStatus, usrmGetDefaulSpaceSize, usrmExpandThirdPartyNode, usrmImportThirdPartyOUs, usrmClearImportProgress, usrmGetImportProgress } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';

export enum ImportOptions {
    /**
     * 导入选中的对象及其成员（包括上层的组织结构）
     */
    All,

    /**
     * 导入选中的对象及其成员（不包括上层的组织结构）
     */
    CurrentAndChild,

    /**
     * 仅导入用户账号（不包括组织结构）
     */
    Current

}

export default class ImportOrganizationBase extends WebComponent<any, any> {

    static defaultProps = {
        /**
         * 导入的目标部门的id
         */
        departmentId: '',

        /**
         * 导入的操作者
         */
        userid: '',

        /**
         * 导入成功
         */
        onSuccess: noop,

        /**
         * 导入完成
         */
        onComplete: noop,

        /**
         * 取消导入
         */
        onCancel: noop
    }

    state = {
        spaceStatus: false,
        spaceSize: '',
        option: {
            /**
            * 是否导入用户邮箱
            */
            userEmail: false,

            /**
             * 是否导入用户显示名
             */
            userDisplayName: true,

            /**
             * 是否覆盖已有用户
             */
            userCover: true,

            /**
             * 导入目的地
             */
            departmentId: this.props.departmentId,

            /**
             * 用户的配额空间
             */
            spaceSize: 0,

        },
        importOption: ImportOptions.All,
        selectedData: [],
        progress: -1,
        failMessage: '',
        errorStatus: 0
    }

    static ImportOptions = ImportOptions;

    async componentWillMount() {
        const spaceStatus = await usrmGetUserDocStatus()
        try {
            if (spaceStatus) {
                this.setState({
                    spaceStatus,
                    spaceSize: ((await usrmGetDefaulSpaceSize()) / Math.pow(1024, 3)).toFixed(2)
                })
            } else {
                this.setState({
                    spaceStatus
                })
            }
        } catch (ex) {

        }
    }

    /** 
     * 更改文本框的值
     */
    protected changeDocSpace = (value) => {
        if (value === '' || Number(value) <= 1000000) {
            this.setState({
                spaceSize: value
            })
        } else {
            this.setState({
                spaceSize: this.state.spaceSize
            })
        }

    }

    /**
     * 选择导入方式
     */
    // protected selectedImport = (check: boolean, value: ImportOptions) => {
    //     this.setState({
    //         importOption: value
    //     })
    // }

    /**
     * 用户同名的处理方式
     */
    protected setUserCover = (check: boolean, value: boolean) => {
        this.setState({
            option: { ...this.state.option, userCover: value }
        })
    }

    /**
     * 判断是否是叶子节点
     */
    protected getNodeIsLeaf = (node) => !!(node && node.loginName)


    /**
     * 获取子节点
     */
    protected getChildren = async (node) => {
        const data = await usrmExpandThirdPartyNode([node.thirdId])
        return [...data.ous, ...data.users]
    }

    /**
     * 获取选中节点
     */
    protected getSelectedNode = (data) => {
        this.setState({
            selectedData: data
        })
    }

    /**
     * 导入用户
     */
    protected importThirdUser = async () => {
        let users = [], ous = [];
        for (let data of this.state.selectedData) {
            if (data.loginName) {
                users = [...users, data]
            } else if (this.state.importOption !== ImportOptions.Current) {
                ous = [...ous, { ...data, importAll: true }]
            }
        }

        try {
            await usrmClearImportProgress();
            this.setState({
                progress: 0
            })
            usrmImportThirdPartyOUs([
                ous.map(ou => ({ 'ncTUsrmThirdPartyOU': ou })),
                users.map(user => ({ 'ncTUsrmThirdPartyUser': user })),
                {
                    'ncTUsrmImportOption': { ...this.state.option, spaceSize: this.state.spaceSize === '' ? 0 : Number(this.state.spaceSize) * Math.pow(1024, 3) }
                }, this.props.userid])

            let stopTimer = timer(async () => {
                let importResult = await usrmGetImportProgress();
                if (this.state.progress === 100) {
                    stopTimer()
                    this.props.onSuccess();
                    return;
                }

                if (importResult.failInfos.length) {
                    this.setState({
                        failMessage: importResult.failInfos[0],
                        progress: -1
                    })
                    this.props.onComplete()
                    stopTimer()
                    return;
                }
                if (importResult.totalNum) {
                    if ((importResult.successNum + importResult.failNum) === importResult.totalNum) {
                        this.setState({
                            progress: 100
                        })

                    } else {
                        this.setState({
                            progress: ((importResult.successNum + importResult.failNum) / importResult.totalNum * 100).toFixed(2)
                        })

                    }

                }
            }, 1000)

        } catch (ex) {
            this.setState({
                errorStatus: ex.error.errID
            })
        }
    }

    /**
     * 关闭错误信息
     */
    protected closeFailInfo = () => {
        this.setState({
            failMessage: ''
        })
        this.props.onCancel()
    }

    /**
     * 关闭错误弹窗
     */
    protected closeErrorInfo = () => {
        this.setState({
            errorStatus: 0
        })
        this.props.onCancel()
    }

}