import * as React from 'react';
import SSOBase, { Status } from './component.base';
import ErrorOverlay from '../ErrorOverlay/component.mobile';

export default class SSO extends SSOBase {
    render() {
        return this.state.status === Status.PENDING || this.state.status === Status.OK ?
            <div></div> :
            <ErrorOverlay error={this.state.status} />
    }
}