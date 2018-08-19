import * as React from 'react';
import { noop } from 'lodash';
import { PureComponent } from '../../ui/decorators';
import { search } from '../../core/apis/eachttp/contact/contact';
import __ from './locale';


interface Props {

    /**
     * 宽度
     */
    width?: number;

    /**
     * 下拉框选中值
     */
    onSelect: (select: any) => any;

}

interface State {

    /**
     * 查询结果
     */
    results: Array<any>;
}

@PureComponent
export default class ConcatSearcherBase extends React.Component<any, any>{

    static defaultProps = {

        width: 130,

        onSelect: noop

    }

    props: Props;

    state: State = {

        results: [],

    }

    onLoad(result) {
        if (result) {
            this.refs.autocomplete.toggleActive(true);
            let { groups, userinfos } = result;
            this.setState({
                results: userinfos ? userinfos.concat(groups) : groups
            })
        }
        else {
            this.refs.autocomplete.toggleActive(false);
            this.setState({
                results: null
            })
        }


    }

    search(key) {
        if (!key) {
            return Promise.resolve(null);
        } else {
            return search({ key });
        }
    }

    handleClick(value) {
        this.refs.autocomplete.toggleActive(false);
        this.props.onSelect(value)
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