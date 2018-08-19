import * as React from 'react';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { createWindow } from '../../core/client/client';

interface Props {
    id: string
}

export default class StatusHintsBase extends React.Component<Props, any>{

    static defaultProps = {
        id: ''
    }

    state = {
        helper: '',
    }

    componentWillMount() {
        this.getHelper();
    }

    async getHelper() {
        const { helper } = await getOEMConfByOptions(['helper']);
        this.setState({
            helper
        })

    }

    viewHelp() {
        const { host } = getOpenAPIConfig(['host']);
        
        createWindow(`${host}` + this.state.helper, { id: this.props.id.slice(1, -1) });
    }
}