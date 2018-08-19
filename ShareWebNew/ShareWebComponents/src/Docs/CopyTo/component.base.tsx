import * as React from 'react'
import { copy as copyFile } from '../../../core/apis/efshttp/file/file';
import { copy as copyDir } from '../../../core/apis/efshttp/dir/dir';
import { isDir } from '../../../core/docs/docs'
import * as fs from '../../../core/filesystem/filesystem'

export enum CopyStatus {
    Init,
    Pick,
    Progress,
    Error
}

export default class CopyTo extends React.Component<any, any>{

    state = {
        status: CopyStatus.Init,
        error: null
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                status: CopyStatus.Pick
            })
        }, 100)
    }

    async copy(param, dest) {
        const { docs } = this.props
        const success = [], failed = []
        for (let doc of docs) {
            const copy = isDir(doc) ? copyDir : copyFile
            try {
                this.setState({
                    status: CopyStatus.Progress
                })
                await copy({ docid: doc.docid, destparent: dest.docid, ondup: 2 })
                const newDoc = {
                    ...doc,
                    ...docInfo
                }
                // 在fs中加入newDoc
                fs.insert(newDoc)
                success.push(doc)
            } catch (e) {
                try {
                    await new Promise((resolve, reject) => {
                        this.setState({
                            status: CopyStatus.Error,
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
            status: CopyStatus.Init
        }, () => {
            setTimeout(() => this.props.onComplete(success, failed, dest), 300)
        })
    }

    cancel() {
        this.setState({
            status: CopyStatus.Init
        }, () => {
            setTimeout(this.props.onCancel, 300)
        })
    }
}