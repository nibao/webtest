import * as React from 'react'
import CreateFolderBase, { ErrorCode } from '../../CreateFolder/component.base'
import { getSuggestName } from '../../../core/apis/efshttp/dir/dir'
import __ from './locale'

export default class CreateDirBase extends CreateFolderBase {

    validateMessages = {
        [ErrorCode.NameInvalid]: __('文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。'),
        [ErrorCode.NameEndWithDot]: __('文件夹名称不能以 “.” 结尾。')
    }

    componentDidMount() {
        super.componentDidMount()
        getSuggestName({ docid: this.props.doc.docid, name: __('新建文件夹') }).then(({ name }) => {
            this.updateValue(name)
            this.setState({
                anchor: this.refs['container']
            })
        })
    }

    /**
     * 清除errCode
     */
    protected clearErrCode() {
        this.setState({
            errCode: 0
        })
    }
}