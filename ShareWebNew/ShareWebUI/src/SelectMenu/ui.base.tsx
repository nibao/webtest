import * as React from 'react'

export default class SelectMenu extends React.Component<UI.SelectMenu.Props> {

    static defaultProps: UI.SelectMenu.Props = {
        triggerEvent: 'mouseover',
        freezable: false,
        anchorOrigin: ['left', 'bottom'],
        targetOrigin: ['left', 'top'],
        onRequestCloseWhenClick: close => close()
    }

    state = {
        value: this.props.value
    }

    componentWillReceiveProps({ value }) {
        if (typeof value !== 'undefined') {
            this.setState({
                value
            })
        }
    }

    handleClick(e, item) {
        if (typeof item.props.onClick === 'function') {
            item.props.onClick(e)
        }
        if (!e.defaultPrevented) {
            this.setState({
                value: item.props.value
            }, () => {
                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(this.state.value)
                }
            })
        }
    }
}