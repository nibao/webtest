import * as React from 'react';
import { size } from '../../core/apis/efshttp/dir/dir';
import { getErrorMessage } from '../../core/errcode/errcode';
import WebComponent from '../webcomponent';
import { noop } from 'lodash';
import __ from './locale';

function formatter(errorCode) {
    if (errorCode === 404006) {
        return __('文件或文件夹不存在')
    }
    return getErrorMessage(errorCode);

}

export default class ViewSizeBase extends WebComponent<Components.ViewSize.Props, Components.ViewSize.State> {

    requests = null

    static defaultProps = {
        docs: [],

        // 是否是回收站
        onlyrecycle: false,

        // 统计完成后回调函数
        onStatisticsCompleted: noop,

        onStaticsConfirm: noop,

        onStaticsCancel: noop
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        isQuering: true,
        size: {
            // 总文件数
            filenum: 0,
            // 总文件夹数
            dirnum: 0,
            // 总大小
            totalsize: 0,
            // 回收的大小
            recyclesize: 0,

        },
        docs: [],
        errorCode: 0,
        showError: false,
        errorDoc: null

    }

    componentWillMount() {
        this.initData(this.props.docs, this.props.onlyrecycle);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.docs !== nextProps.docs) {
            this.initData(nextProps.docs, nextProps.onlyrecycle);
        }
    }

    initData(docs, onlyrecycle) {
        this.requests = docs.map(doc => {
            const req = size({ docid: doc.docid, onlyrecycle: onlyrecycle }, {})
            return { req, doc }
        })
        Promise.all(this.requests.map(({ req, doc }) => {
            return req.catch(err => { throw { err, doc } })
        })).then((sizes) => {
            this.setState({
                size: sizes.reduce((prevs, cur, index, array) => ({
                    filenum: prevs.filenum + cur.filenum,
                    dirnum: prevs.dirnum + cur.dirnum,
                    totalsize: prevs.totalsize + cur.totalsize,
                    recyclesize: prevs.recyclesize + cur.recyclesize
                }), { filenum: 0, dirnum: 0, totalsize: 0, recyclesize: 0 }),
                docs: docs.map((doc, index) => ({ ...doc, _size: sizes[index].totalsize })),
                isQuering: false
            }, () => this.props.onStatisticsCompleted(this.state.docs))
        }, error => {
            this.setState({
                showError: true,
                errorCode: error.err.errcode,
                errorDoc: error.doc
            })

        })

    }

    confirm() {

        this.props.onStaticsConfirm();
    }

    cancel() {
        if (this.requests) {
            for (let { req } of this.requests) {
                if (req.abort) {
                    req.abort()
                }
            }
        }
        this.requests = null
        this.props.onStaticsCancel();
    }

    close(goToEntry) {
        this.setState({
            showError: false,
            errorCode: 0
        })
        if (this.requests) {
            for (let { req } of this.requests) {
                if (req.abort) {
                    req.abort()
                }
            }
        }
        this.requests = null
        this.props.onStaticsCancel(true, goToEntry);
    }
}
