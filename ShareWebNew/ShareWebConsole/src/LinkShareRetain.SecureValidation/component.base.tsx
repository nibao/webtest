import * as React from 'react'
import { noop, includes } from 'lodash'
import { login } from '../../core/thrift/sharemgnt/sharemgnt';
import session from '../../util/session/session'

export default class LinkShareRetainSecureValidationBase extends React.Component<Console.LinkShareRetainSecureValidation.Props, Console.LinkShareRetainSecureValidation.State> {

    static defaultProps = {
        onValidateSuccess: noop
    }

    state = {
        vCode: '',

        error: null
    }

    componentWillUnmount() {
        if (this.state.error && includes([20130, 20135], this.state.error.errID)) {
            // 密码输错超过次数限制，需要跳到登录界面
            location.replace('/');
        }
    }


    /**
     * 校验登录密码是否正确
     */
    protected async validate() {
        if (this.state.error && includes([20130, 20135], this.state.error.errID)) {
            // 密码输错超过次数限制，需要跳到登录界面
            location.replace('/');
        } else {
            const { vCode } = this.state
            const userName = session.get('username')
            const userType = session.get('userInfo').user.userType

            try {
                await login([userName, vCode, userType, {}])

                // 密码验证成功
                session.set('linkShareVCodeVerified', true)

                this.props.onValidateSuccess()
            }
            catch (ex) {
                // 密码验证失败
                this.setState({
                    error: ex && ex.error ? ex.error : ex,
                })
            }
        }
    }
}