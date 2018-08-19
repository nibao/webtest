import * as React from 'react';
import { noop, isEqual } from 'lodash';

export default class TabsNavigatorBase extends React.Component<any, any> {
    state = {
        activeIndex: 0
    }

    componentWillMount() {
        this.props.children.some((Tab, index) => {
            if (Tab.props.active) {
                this.navigate(index)
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (!(this.props.children && nextProps.children && nextProps.children.length === this.props.children.length)) {
            this.navigate(0)
        }
    }


    public navigate(activeIndex) {
        this.setState({ activeIndex });
        this.props.onNavigate(activeIndex);
    }
}