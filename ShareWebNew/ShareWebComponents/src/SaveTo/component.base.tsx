import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { convertPath } from '../../core/apis/efshttp/file/file';
import { DocType, queryByType } from '../../core/entrydoc/entrydoc';

export enum Status {
    // 正常状态
    NORMAL,

    // 成功
    SUCCESS,

    // 个人文档关闭状态
    USERDOC_CLOSED,

    // 无异常
    PENDING
}

export enum Type {
    // 内链
    SHARE,
    // 外链
    SHARELINK
}

interface Props {
    // 文档列表
    docs: Array<Core.Docs.Doc>;

    // 转存类型
    type: Type;

    // 外链
    link?: APIs.EFSHTTP.Link.Get;

    // 转存完成
    onSaveComplete: () => any;

    // 重新跳转
    onRedirect: () => any;

    // 外链转存错误
    onLinkError?: (errcode: number) => void;
}

interface State {
    // 转存状态
    status: Status
}

export default class SaveToBase extends WebComponent<any, any> {
    static defaultProps = {
        docs: [],
        type: Type.SHARE,
        completeSave: noop,
        onRedirect: noop,
        onLinkError: noop
    }

    state = {
        status: Status.PENDING,
    }
    // 目标路径
    targetpPath = '';

    // 
    componentWillMount() {
        queryByType(DocType.userdoc, { update: true }).then(res => {
            if (res.length) {
                this.setState({
                    status: Status.NORMAL
                })
            } else {
                this.setState({
                    status: Status.USERDOC_CLOSED
                })
            }
        })
    }

    /**
     * 转存完成
     * @param result 成功的文件 
     * @param target 目标路径
     */
    saveToSuccess(result, target) {
        if (result.success.length) {
            this.targetpPath = target.docid;
            this.setState({
                status: Status.SUCCESS
            })
        } else {
            this.setState({
                status: Status.NORMAL
            })
            this.props.onSaveComplete()
        }
    }

    /**
     * 点击查看
     */
    onChangeToTarget() {
        this.props.onRedirect(this.targetpPath);
        this.props.onSaveComplete();
    }

}