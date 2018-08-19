import * as React from 'react';
import { noop } from 'lodash';
import { ECMSManagerClient } from '../../core/thrift2/thrift2';
import WebComponent from '../webcomponent'
export default class DatabaseSubsystemBase extends WebComponent<Components.DatabaseSubsystem.Props, Components.DatabaseSubsystem.State>{

    static defaultProps = {
        doRedirectServers: noop
    }

    state = {
        showAddNodeInfos: false,
        isExternalDB: false,
    }

    async componentWillMount() {
        let isExternalDB = await ECMSManagerClient.is_external_db();
        this.setState({
            isExternalDB
        })
    }


}