///<reference path="./component.base.d.ts" />
import * as React from 'react';
import { get as getUser } from '../../core/apis/eachttp/user/user';
import WebComponent from '../webcomponent';


export default class PersonalBase extends WebComponent<Components.Personal.Props, any> implements Components.Personal.Base {

    state = {
        userName: '',
        account: ''
    }

    componentDidMount() {
        getUser({}).then(userInfo => {
            this.setState({
                userName: userInfo.name,
                account: userInfo.account
            })
        })
    }
}