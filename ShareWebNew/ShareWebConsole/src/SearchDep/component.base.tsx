import * as React from 'react';
import { noop, includes } from 'lodash';
import { ShareMgnt } from '../../core/thrift/thrift';
import { NodeType } from '../OrganizationTree/helper';

interface Props {
    // 选择事件
    onSelectDep: (sharer: Object) => any;

    // 宽度
    width: string | number;

    // 选择搜索范围
    selectType: Array<NodeType>;

    // 管理员id
    userid?: string;
}

interface State {
    // 搜索结果
    results: Array<Object>;
}

export default class SearchDepBase extends React.Component {
    static defaultProps = {
        onSelectDep: noop,
        selectType: [NodeType.ORGANIZATION, NodeType.DEPARTMENT],
    }

    state = {
        results: []
    }

    /**
     * 根据key获取部门
     * @return 部门数组
     */
    getDepsByKey(key: string): PromiseLike<Array<Object>> {
        if (key) {
            return Promise.all([includes(this.props.selectType, NodeType.DEPARTMENT) || includes(this.props.selectType, NodeType.ORGANIZATION) ?
                ShareMgnt('Usrm_SearchDepartments', [key]) : [],
            includes(this.props.selectType, NodeType.USER) ? ShareMgnt('Usrm_SearchSupervisoryUsers', [this.props.userid, key]) : []
            ]).then(([deps, users]) => [...deps, ...users])
        } else {
            return null
        }

    }

    /**
     * 获取搜索到的结果
     * @param results 部门数组
     */
    getSearchData(results: Array<Object>) {
        this.setState({
            results: results
        })
    }

    /**
     * 选择搜索到的单个部门
     * @param dep 部门 
     */
    selectItem(sharer: Object): void {
        this.props.onSelectDep(sharer);
        this.refs.autocomplete.toggleActive(false);
    }

    /**
     * 按下enter
     */
    handleEnter(e, selectIndex: number) {
        if (selectIndex >= 0) {
            this.selectItem(this.state.results[selectIndex])
        }
    }
}   