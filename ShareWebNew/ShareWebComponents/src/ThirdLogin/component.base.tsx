///<reference path="./component.base.d.ts" />

import * as React from 'react';
import WebComponent from '../webcomponent';
import { noop } from 'lodash';
import { getAuth } from '../../core/auth/auth';

export default class ThirdLoginBase extends WebComponent<Components.ThirdLogin.Props, Components.ThirdLogin.State>{

    static defaultProps = {
        doSSO: noop,
        onAuthSuccess: noop
    }

    state = {
    }

    componentWillMount() {
        getAuth().then(thirdauth => {
            this.setState({
                thirdauth: thirdauth
            })
        })
    }

    protected thirdLoad(): void {
        if (this.state.thirdauth) {
            this.props.doSSO(this.state.thirdauth.config.authServer);
        }
    }
}