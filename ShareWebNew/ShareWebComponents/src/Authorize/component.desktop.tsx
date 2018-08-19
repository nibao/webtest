import * as React from 'react';
import { getErrorMessage } from '../../core/errcode/errcode';
import AuthorizeBase from './component.base';
import PasswordInvalid from './PasswordInvalid/component.desktop';
import AuthorizeError from './AuthorizeError/component.desktop';

export default class Authorize extends AuthorizeBase {

    render() {
        const { authorizeError, pwdInvalidErrcode } = this.state;
        return (
            <div>
                {
                    pwdInvalidErrcode ?
                        <PasswordInvalid
                            pwdInvalidErrcode={pwdInvalidErrcode}
                            onConfirm={() => { this.handleModifyPassword() }}
                            onCancel={() => { this.handleCancelModifyPassword() }}
                        />
                        : null
                }
                {
                    authorizeError ?
                        <AuthorizeError
                            authorizeError={authorizeError}
                        />
                        : null
                }
            </div>
        )
    }
}