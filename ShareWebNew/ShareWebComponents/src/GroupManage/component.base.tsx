/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { getUserQuota } from '../../core/apis/eachttp/quota/quota';
import { get } from '../../core/apis/eachttp/managedoc/managedoc';
import { get as getUser } from '../../core/apis/eachttp/user/user';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { del, add, editQuota, edit } from '../../core/apis/eachttp/groupdoc/groupdoc';
import WebComponent from '../webcomponent';
import { Status } from './helper';

export default class GroupManageBase extends WebComponent<any, any> implements Components.GroupManage.Base {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDel = this.handleDel.bind(this);
        this.handleCancle = this.handleCancle.bind(this);
        this.handleConfirmCreate = this.handleConfirmCreate.bind(this);
        this.computeMaxSize = this.computeMaxSize.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    static defaultProps = {
        onClose: noop
    }

    state = {
        data: [],
        activeId: null,
        activeIndex: null,
        warning: false,
        status: Status.NoPop,
        delModel: false,
        errcode: null,
        extraMsg: null
    }

    async componentWillMount() {
        try {
            /**
             * 检测个人文档是否开启
             */
            const { docinfos } = await get();

            const userdoc = docinfos.filter(item => item.doctype === 'userdoc');
            if (userdoc.length) {
                const { quotainfos } = await getUserQuota();
                if (quotainfos.length) {
                    let allQuota = 0;
                    let used = 0;
                    // 计算最大可分配空间
                    quotainfos.forEach((item) => {
                        allQuota += item.quota;
                        if (item.doctype === 'userdoc') {
                            used = item.used;
                        }
                    });
                    const fixedQuota = allQuota - used;

                    this.fixedQuota = fixedQuota > 0 ? fixedQuota : 0;
                    this.setState({
                        status: Status.Normal,
                        data: quotainfos.filter((item) => item.doctype === 'groupdoc').sort((a, b) => a.docname.localeCompare(b.docname))
                    })
                }
            } else {
                this.setState({
                    status: Status.NoUserDoc
                })
            }
        } catch (e) {
            this.setState({
                errcode: e.errcode
            })
        }

    }

    /**
     * 关闭群组管理组件
     */
    ConfirmDialog() {
        this.setState({
            status: Status.NoPop
        })
    }

    /**
     * 计算所选文档的最大可分配空间
     * @param id 文档id
     */
    computeMaxSize(id) {
        let elseQuota = 0;
        this.state.data.forEach((item) => {
            if (item.docid !== id) {
                elseQuota += Number(item.quota);
            }
        })

        const maxsize = this.fixedQuota - elseQuota;

        return maxsize > 0 ? maxsize : 0;
    }

    /**
     * 检查能否打开编辑/删除/创建状态
     */
    check() {
        const activeId = this.state.activeId;

        if (activeId) { // 有正在编辑的条目并且不是此条
            this.setState({
                warning: true
            });
            return false;
        } else {
            return true;
        }
    }

    /**
     * 创建群组文档
     */
    handleCreate() {
        if (this.check()) {
            this.setState({
                activeId: 'create',
                activeIndex: 0
            });
        } else {
            this.refs.groups.srcollToIndex(this.state.activeIndex)
        }
    }

    /**
     * 打开编辑状态
     * @param id 点击的群组的id
     * @param index 点击的群组在列表中的index
     */
    handleEdit(id, index) {
        if (this.check()) {
            // 没有正在编辑的条目
            this.setState({
                activeId: id,
                activeIndex: index
            });
        } else {
            this.refs.groups.srcollToIndex(this.state.activeIndex);
        }
    }

    /**
     * 确认创建
     * @param name 文档名称
     * @param name 文档配额
     */
    async handleConfirmCreate({ name, quota }) {
        try {
            const { docid } = await add({
                name,
                quota
            });
            this.setState({
                data: [{ docid, docname: name, quota, used: 0 }].concat(this.state.data),
                activeId: null,
                activeIndex: null,
                warning: false
            });
        } catch (e) {
            if (e.errcode === 403179 || e.errcode === 403180) {
                this.props.onClose()
            } else {
                this.setState({
                    errcode: e.errcode
                })
            }
        }
    }

    /**
     * 保存群组编辑
     * @param docid 群组文档id
     * @param name 群组文档名称
     * @param quota 群组文档配额
     */
    async handleSave({ docid, name, quota }) {
        const data = this.state.data;
        try {
            await Promise.all([editQuota({ quota, docid }), edit({ name, docid })]);
            const newData = data.map((item) => {
                if (item.docid === docid) {
                    return Object.assign({}, item, {
                        docname: name,
                        quota
                    })
                } else {
                    return item;
                }
            });
            this.setState({
                data: newData,
                activeId: null,
                activeIndex: null,
                warning: false,
            });
        } catch (e) {
            if (e.errcode === 403179 || e.errcode === 403180) {
                this.props.onClose()
            } else {
                this.setState({
                    errcode: e.errcode
                })
            }
        }
    }

    /**
     * 取消编辑群组
     */
    handleCancle() {
        this.setState({
            activeId: null,
            activeIndex: null,
            warning: false
        })
    }

    /**
     * 删除群组
     * @param id 点击的群组的id
     * @param used 所选群组已使用空间
     */
    handleDel(id) {
        if (this.check()) {
            this.delId = id;
            this.setState({
                delModel: true
            })
        } else {
            this.refs.groups.srcollToIndex(this.state.activeIndex);
        }
    }

    /**
     * 确认删除群组
     * @param docid 需要刪除的群组的id
     */
    async handleConfirmDel(docid) {
        this.setState({
            delModel: false
        })
        try {
            await del({ docid });
            const newData = this.state.data.filter((item) => item.docid !== docid);
            this.setState({
                data: newData
            })
        } catch (e) {
            this.setState({
                errcode: e.errcode
            })
        }
    }

    /**
     * 取消删除
     */
    handleCancleDel() {
        this.setState({
            delModel: false // 关闭删除框
        })
    }

    /**
     * 关闭提示框
     */
    handleCloseMessageDialog() {
        this.setState({
            status: Status.Normal, // 关闭提示框
        })
    }

    /**
     * 确认错误提示
     */
    confirmErrorMsg() {
        this.setState({
            errcode: null
        })
    }

    handleError(errcode, extraMsg) {
        this.setState({
            errcode: errcode,
            extraMsg: extraMsg
        })
    }
}