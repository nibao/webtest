import * as React from 'react';
import { assign, uniq, noop } from 'lodash';
import { getGroups, get } from '../../core/apis/eachttp/contact/contact';

interface Props {
    /**
     * 选中一个Tree触发
     */
    onSelect: (data: any) => any;
}

export default class ConcactBase extends React.Component<any, any> {

    static defaultProps: Props = {
        onSelect: noop
    }

    state = {
        groups: [],
    }

    selected: null;

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

        this.props.onSelect(data);

    }

    componentWillMount() {
        this.getGroups();
    }

    getGroups(): void {
        getGroups({}).then(({ groups }) => {
            this.setState({
                groups
            });
        }, xhr => {
            this.setState({
                errorMsg: xhr.errmsg
            })
        });
    }

    getUserInfos(group: any): PromiseLike<void> {
        return get({groupid: group.id}).then(({ userinfos }) => {
            assign(group, { userinfos });
            this.forceUpdate();
        }, xhr => {
            this.setState({
                errorMsg: xhr.errmsg
            })
        });
    }
}