import * as React from 'react';
import { noop, last, dropRight, constant } from 'lodash';
import { PureComponent } from '../decorators';

interface Props extends React.Props<any> {
    crumbs: Array<any>;

    onClick?(crumb: any): void;

    formatter?(crumb: any): string;

    onChange?(crumbs: Array<any>): any;
}

@PureComponent
export default class CrumbsBase extends React.Component<Props, any> {

    static defaultProps = {
        crumbs: [],

        onClick: noop,

        onChange: noop,

        formatter: (crumb) => crumb
    }


    state = {
        crumbs: this.props.crumbs
    }


    componentWillReceiveProps({crumbs}) {
        if (crumbs !== this.props.crumbs && crumbs !== this.state.crumbs) {
            this.setState({ crumbs: crumbs })
        }
    }


    protected back(crumb) {
        const nextCrumbs = this.state.crumbs.slice(0, this.state.crumbs.indexOf(crumb) + 1)

        this.setState({
            crumbs: nextCrumbs
        }, () => this.fireOnChangeEvent(nextCrumbs))
    }

    protected clickCrumb(crumb) {
        this.fireOnClickEvent(crumb);
        this.back(crumb)
    }

    private fireOnClickEvent(crumb) {
        this.props.onClick(crumb);
    }

    private fireOnChangeEvent(crumbs) {
        this.props.onChange(crumbs);
    }
}