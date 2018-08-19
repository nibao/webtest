import * as React from 'react';
import {assign} from 'lodash';
import { noop } from 'lodash';
import { getRoots, getSubDeps, getSubUsers } from '../../../ShareWebCore/src/apis/eachttp/department/department';
import {NodeTypes} from './helper';

interface Props {
    /**
     * 选中一个Tree触发
     */
    onSelect: (data: any) => any;
}

interface State {
    treeData: { depinfos: Array<any> }; // 显示的数据
}

export default class DepatrmentTreeBase extends React.Component<any, any> {

    static defaultProps: Props = {
        onSelect: noop
    }

    state: State = {
        treeData: {depinfos: []},
    }

    selected: null;

    componentWillMount() {
        this.getRootsDep();
    }
     
    /**
    * 获取用户所能访问的根部门信息
    */
    getRootsDep(): void {
        getRoots({ }).then((treeData) => {
            let depinfos = treeData.depinfos.map((data) => (
                { nodeType: NodeTypes.ROOTDEP, ...data }
            ))
            this.setState({
                treeData: {depinfos}
            });
        })
    }

    /**
     * 选中
     */
    handleSelect(target: any): void {
        let data = target.props.data;

        if (this.selected) {
            if (this.selected !== target) {
                this.selected.setState({ selected: false });
                this.selected = target;
                target.setState({
                    selected: true
                });
            }
        } else {
            this.selected = target;
            target.setState({
                selected: true
            });
        }

        if (data.isconfigable || data.nodeType === NodeTypes.SUBUSER) {
            // 用户的isconfigable为true 或者 选中了子用户， 将data传出去
            this.props.onSelect(data);
        }
    }
    
    /**
     * 展开
     * @data: depinfo
     */
    loader(data: any) {
        let {depid} = data;
        return Promise.all([getSubDeps({ depid }), getSubUsers({ depid })]).then(([{depinfos}, {userinfos}]) => {
            let newDepinfos = depinfos.map((depinfo) => (
                { nodeType: NodeTypes.SUBDEP, ...depinfo }
            ))
            let newUserinfos = userinfos.map((userinfo) => (
                { nodeType: NodeTypes.SUBUSER, ...userinfo }
            ))
            assign(data, { depinfos: newDepinfos, userinfos: newUserinfos })
            this.forceUpdate();
        })
    }
}

