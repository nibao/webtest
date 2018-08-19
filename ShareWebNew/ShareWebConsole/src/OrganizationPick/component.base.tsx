import * as React from 'react';
import { noop, uniq } from 'lodash';
import { NodeType, getNodeType } from '../OrganizationTree/helper';

export default class OrganizationPickBase extends React.Component<Components.OrganizationPick.Props, Components.OrganizationPick.State> {

    static defaultProps = {
        onConfirm: noop,
        onCancel: noop,
        userid: '',
        selectType: [NodeType.ORGANIZATION, NodeType.DEPARTMENT],
        data: [],
        onSelectionChange: noop,
        converterIn: (x) => x
    }

    state = {
        data: []
    }

    componentDidMount() {
        this.setState({
            data: this.props.data.map(this.props.converterIn)
        })
    }

    componentWillReceiveProps({ data }) {
        this.setState({
            data: data.map(this.props.converterIn)
        })
    }

    /**
     * 选择共享者
     * @param value 共享者
     */
    selectDep(value) {
        this.setState({
            data: uniq(this.state.data.concat({
                id: value.id || value.departmentId,
                name: value.name || value.displayName || value.departmentName || (value.user && value.user.displayName),
                type: getNodeType(value),
                original: value
            }), 'id')
        }, () => {
            this.props.onSelectionChange(this.state.data.map(this.props.convererOut))
        })
    }

    /**
     * 删除已选部门
     * @param dep 部门
     */
    deleteSelectDep(sharer: Node) {
        this.setState({
            data: this.state.data.filter(value => value.id !== sharer.id)
        }, () => {
            this.props.onSelectionChange(this.state.data.map(this.props.convererOut))
        })
    }

    /**
     * 清空已选择部门
     */
    clearSelectDep() {
        this.setState({
            data: []
        })
        this.props.onSelectionChange([])
    }
}