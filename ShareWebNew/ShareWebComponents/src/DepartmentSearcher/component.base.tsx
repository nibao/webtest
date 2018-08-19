import * as React from 'react';
import { noop } from 'lodash';
import { search } from '../../../ShareWebCore/src/apis/eachttp/department/department';

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

export default class DepatrmentSearcherBase extends React.Component<any, any> {

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
            return search({ key });
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
            const {depinfos, userinfos} = result;
            this.setState({
                results: [...depinfos, ...userinfos]
            });
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

    handleEnter(e, selectIndex: number) {
        if (selectIndex >= 0) {
            this.handleClick(this.state.results[selectIndex])
        }
    }
}