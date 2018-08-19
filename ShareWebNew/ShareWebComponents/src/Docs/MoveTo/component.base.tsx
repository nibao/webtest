import * as React from 'react'
import { noop } from 'lodash'
import { move as moveFile } from '../../../core/apis/efshttp/file/file';
import { move as moveDir } from '../../../core/apis/efshttp/dir/dir';
import { isDir, docname } from '../../../core/docs/docs'
import * as fs from '../../../core/filesystem/filesystem'

export enum MoveStatus {
    Init,
    Pick,
    Progress,
    Error
}

export default class MoveTo extends React.Component<any, any>{

    static defaultProps = {
        onSingleMoveComplete: noop
    }

    state = {
        status: MoveStatus.Init,
        error: null
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                status: MoveStatus.Pick
            })
        }, 100)
    }

    async move(param, dest) {
        const { docs } = this.props
        const success = [], failed = []
        for (let doc of docs) {
            const move = isDir(doc) ? moveDir : moveFile
            try {
                this.setState({
                    status: MoveStatus.Progress
                })
                const { docid, isdirexist, name } = await move({ docid: doc.docid, destparent: dest.docid, ondup: 2 })
                this.props.onSingleMoveComplete(doc)
                success.push(doc)
                if (!isDir(doc) || !isdirexist) {
                    // 文件被移动成功，或者 文件夹移动后isdirexist为false，调用this.props.onSingleMoveComplete(doc)
                    fs.del(doc)
                    fs.insert({ ...doc, docid, name: name ? name : docname(doc) })
                }
            } catch (e) {
                try {
                    await new Promise((resolve, reject) => {
                        this.setState({
                            status: MoveStatus.Error,
                            error: {
                                apiError: e,
                                deferred: { resolve, reject }
                            }
                        })
                    })
                } catch (e) {
                    failed.push(doc)
                    break
                }
            }
        }
        this.setState({
            status: MoveStatus.Init
        }, () => {
            setTimeout(() => this.props.onComplete(success, failed, dest), 300)
        })
    }

    cancel() {
        this.setState({
            status: MoveStatus.Init
        }, () => {
            setTimeout(this.props.onCancel, 300)
        })
    }
}