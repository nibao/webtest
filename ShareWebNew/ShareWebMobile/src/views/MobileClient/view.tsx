import * as React from 'react';
import { userAgent } from '../../../util/browser/browser'
import MobileClient from '../../../components/MobileClient/component.mobile';
import ErrorDialog from '../../../ui/ErrorDialog/ui.mobile';

export default class MobileClientView extends React.Component<any, any> {
    state = {
        error: false,
        errmsg: ''
    }

    private onClientMiss(errmsg) {
        this.setState({
            error: true,
            errmsg: errmsg
        })
    }
    private resetError() {
        this.setState({
            error: false,
            errmsg: ''
        })
    }
    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <MobileClient
                    doClientDownload={(URL) => location.replace(URL)}
                    onClientMiss={this.onClientMiss.bind(this)}
                    clientType={userAgent().os}
                />
                {
                    this.state.error ?
                        <ErrorDialog onConfirm={this.resetError.bind(this)}>
                            {this.state.errmsg}
                        </ErrorDialog> : ''

                }
            </div>
        )
    }
}