import * as React from 'react';
import WebComponent from '../../../webcomponent';
import { searchPersons } from '../../../../core/apis/eachttp/contact/contact';

export default class ContactSearchBase extends WebComponent<Components.ContactSearch.Props, Components.ContactSearch.State> {
    state = {
        anchor: null,
        result: null,
    }

    /**
     * 点击匹配项，抛出匹配对象
     */
    protected handleClickMenuItem(res) {
        this.setState({
            result: null
        }, () => {
            this.refs.searchBox.clearInput();
            this.props.onSelect(res);
        })
    }

    /**
     * 输入框聚焦
     */
    protected handleSearchFocus(e) {
        this.setState({
            anchor: this.refs.searchInput,
        })
    }

    /**
     * 搜索函数
     */
    protected search(key) {
        return key.trim() ? searchPersons({ key: key.trim() }) : null
    }

    /**
     * 搜索完毕触发
     */
    protected onLoad(result) {
        if (result) {
            let { userinfos } = result;
            this.setState({
                result: userinfos
            })
        }
        else {
            this.setState({
                result: null
            })
        }
    }

    /**
     * 关闭下拉框
     */
    handleClose(close) {
        close();
        this.setState({
            result: null
        })
    }
}