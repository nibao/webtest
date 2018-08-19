import * as React from 'react';
import { noop } from 'lodash'
import WebComponent from '../../webcomponent';

export default class EditCSFBase extends WebComponent<Components.CSFEditor.EditCSF.Props, Components.CSFEditor.EditCSF.State> {

    static defaultProps = {
        onConfirm: noop,

        onCancel: noop
    }

    state = {
        selectedCSF: 0,
        csfOptions: []
    }

    docs: Array<Core.Docs.Docs> = this.props.docs;

    componentWillMount() {
        const { csfOptions } = this.props;

        this.setState({
            selectedCSF: this.props.defaultValue || 0,
            csfOptions
        })
    }

    /**
     * 改变密级选项
     */
    changeSelectedCSF(level) {
        this.setState({
            selectedCSF: level
        })
    }
}