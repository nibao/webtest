import * as React from 'react'
import { noop } from 'lodash'
import { getLinkRoot } from '../../../core/filesystem/filesystem'
import { get } from '../../../core/apis/efshttp/link/link'
import { EmptyLinkPassword } from '../../../core/permission/permission'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'

export default class PasswordValidationBase extends React.Component<Components.LinkDocs.PasswordValidation.Props, Components.LinkDocs.PasswordValidation.State> {
    static defaultProps = {
        link: '',

        onValidateSuccess: noop,

        onError: noop
    }

    state = {
        value: '',

        errCode: 0
    }

    /**
     * 密码输入框的值发生变化
     */
    protected handleChange(value: string) {
        this.setState({
            value
        })
    }

    /**
     * 验证密码是否正确
     */
    protected async validate() {
        const { value } = this.state

        if (value) {
            try {
                const { link } = this.props
                const linkDoc = await getLinkRoot(link, value)

                this.props.onValidateSuccess({ ...linkDoc, link, password: value })

            }
            catch ({ errcode }) {
                // 超过次数限制
                if (errcode === ErrorCode.LinkVisitExceeded) {
                    this.props.onError(errcode)
                } else {
                    this.setState({
                        errCode: errcode
                    })
                }
            }
        } else {
            // 密码输入框为空
            this.setState({
                errCode: EmptyLinkPassword
            })
        }
    }
}