import * as React from 'react'
import { hashHistory } from 'react-router'
import { get as getUser } from '../../../core/user/user'
import { updateLogin, clearLogin } from '../../helper'

export default class LoginView extends React.Component<any, any> {
    async componentDidMount() {
        const { location } = this.props
        const { userid, tokenid, redirect, platform } = location.query

        clearLogin()

        if (!userid || !tokenid) {
            const nextPath = redirect ? `/?redirect=${redirect}` : '/'

            hashHistory.replace(nextPath)
        } else {
            try {
                const login = await getUser({ userid, tokenid })
                const nextPath = redirect ? redirect : '/home'

                updateLogin({ ...login, userid, tokenid, platform })

                hashHistory.replace(nextPath)

            } catch (ex) {
                const nextPath = redirect ? `/?redirect=${redirect}` : '/'

                hashHistory.replace(nextPath)
            }
        }
    }

    render() {
        return null
    }
}