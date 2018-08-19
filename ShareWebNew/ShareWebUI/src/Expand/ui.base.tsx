import * as React from 'react'

export default class ExpandBase extends React.Component<UI.Expand.Props, UI.Expand.State>{
    static defaultProps = {
        open: false
    }

    state = {
        marginTop: 0,
        loaded: false,
        animation: false
    }

    componentDidMount() {
        this.setState({
            marginTop: -this.refs['content'].offsetHeight,
            loaded: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    animation: true
                })
            })
        })
    }

    componentDidUpdate() {
        const marginTop = -this.refs['content'].offsetHeight
        if (marginTop !== this.state.marginTop) {
            this.setState({
                marginTop
            })
        }
    }
}