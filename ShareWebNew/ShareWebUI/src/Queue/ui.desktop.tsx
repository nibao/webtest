import * as React from 'react';
import { progress } from '../../util/accessor/accessor';

interface Props {
    data: Array<any>;

    loader: () => Promise<any>;
}

interface State {
    percentage: number;
}

export default class Queue extends React.Component<Props, any> {
    componentWillReceiveProps({data}) {
        progress((percentage) => this.setState({ percentage }))(this.props.loader)(this.props.data)
    }

    state: State;

    props: Props;

    render() {
        return (
            <ProgressBar percentage={this.state.percentage} />
        )
    }
}


export default class Clean extends React.Component<any, any> {
    render() {
        return (
            <Queue
                data={[1, 2, 3]}
                loader={x => Promise.resolve(x)}
            />
        )
    }
}