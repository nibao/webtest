import * as React from 'react';
import SecureValidation from '../LinkShareRetain.SecureValidation/component.view'
import RetainFiles from '../LinkShareRetain.Files/component.view'
import LinkShareRetainBase from './component.base';

export default class LinkShareRetain extends LinkShareRetainBase {
    render() {
        const {vCodeVerified} = this.state;

        return (
            <div>
                {
                    vCodeVerified
                        ? <RetainFiles prefix={this.props.prefix} />
                        : <SecureValidation onValidateSuccess={() => this.setState({ vCodeVerified: true })} />
                }
            </div >
        )
    }
}