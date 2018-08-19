import * as React from 'react';
import { noop, uniq } from 'lodash';
import { search as searchDepartment } from '../../../ShareWebCore/src/apis/eachttp/department/department';
import { search as searchContact } from '../../../ShareWebCore/src/apis/eachttp/contact/contact';

interface Props {
    /**
     * 选择下拉框中的内容触发
     */
    onSelect: (data: any) => any;

    /**
     * 宽度
     */
    width?: number;

}

interface State {
    results: Array<any>; // 搜索的结果
}

export default class VisitorSearcherBase extends React.Component<any, any> {

    static defaultProps: Props = {
        onSelect: noop
    }

    state: State = {
        results: null,
    }

    /**
     * 搜索函数
     * @param key 搜索关键字
     */
    loader(key: string) {
        if (key) {
            return Promise.all([searchDepartment({ key }), searchContact({ key })]);
        }
        else {
            return Promise.resolve(null);
        }
    }

    /**
     * 数据加载完成触发
     * @param result 搜索结果
     */
    handleLoad(result: any): void {
        if (result) {
            const [{depinfos, userinfos: userDeps}, {userinfos: userConts, groups}] = result;
            let userinfos = uniq([...userDeps, ...userConts], 'userid');
            this.setState({
                results: [...depinfos, ...userinfos, ...groups]
            })
        } else {
            this.setState({
                results: null,
            });
            this.refs.autocomplete.toggleActive(false);
        }

    }

    /** 
     * 选中下拉框内容
     * @param data选中的数据
     */
    handleClick(data: any): void {
        this.refs.autocomplete.toggleActive(false);
        this.setState({
            results: null
        });
        if (data) {
            this.props.onSelect(data);
        }
    }

    /**
     * 处理enter事件
     */
    handleEnter(e, selectIndex: number) {
        if (selectIndex >= 0) {
            this.handleClick(this.state.results[selectIndex])
        }
    }
}