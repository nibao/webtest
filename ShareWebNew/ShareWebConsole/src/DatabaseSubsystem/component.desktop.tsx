import * as React from 'react';
import AddNodeInfos from './AddNodeInfos/component.desktop';
import ExternalDBConfig from './ExternalDBConfig/component.desktop';
import { DBMode } from './helper';
import DatabaseSubsystemBase from './component.base';

export default class DatabaseSubsystem extends DatabaseSubsystemBase {

    render() {
        let { isExternalDB } = this.state
        return (
            <div>
                {
                    isExternalDB === false ?
                        <AddNodeInfos
                            doRedirectServers={this.props.doRedirectServers}
                        />
                        :
                        <ExternalDBConfig
                            isExternalDB={isExternalDB}
                        />
                }
            </div>
        )
    }



}