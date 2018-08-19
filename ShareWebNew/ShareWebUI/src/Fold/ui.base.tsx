import * as React from 'react'
import { noop } from 'lodash'

export default class Fold extends React.Component<UI.Fold.Props, UI.Fold.State>{

    static defaultProps = {
        labelProps: {
        },
        open: true,
        onToggle: noop
    }

    state = {
        open: this.props.open
    }

    componentWillReceiveProps({ open }) {
        this.setState({
            open
        })
    }

    toggle() {
        this.setState({
            open: !this.state.open
        }, () => {
            this.props.onToggle()
        })
    }
}