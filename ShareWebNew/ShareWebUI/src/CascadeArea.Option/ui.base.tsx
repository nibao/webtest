import * as React from 'react';
import { PureComponent } from '../decorators';

@PureComponent
export default class CascadeAreaOptionBase extends React.Component<any, any> {
    static defaultProps = {
        formatter(o) {
            return o;
        }
    }

    state = {
    }

    propagateSelect(selection = []) {
        this.setState({ selected: true });
        this.props.onPropagateSelect([].concat(this, selection));
    }

    formatText() {
        return this.props.formatter(this.props.value);
    }

    handleClick(e) {

        this.propagateSelect();

        e.stopPropagation();
    }
}