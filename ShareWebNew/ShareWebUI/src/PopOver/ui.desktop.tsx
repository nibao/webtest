import * as React from 'react'
import PopOverBase from './ui.base'

export default class PopOver extends PopOverBase {
    render() {
        const { trigger, triggerEvent } = this.props
        if (trigger) {
            switch (triggerEvent) {
                case 'click':
                    return React.cloneElement(trigger, { onClick: e => this.handleTriggerClick(e, trigger.props) })
                case 'mouseover':
                    return React.cloneElement(
                        trigger,
                        {
                            onMouseEnter: e => this.handleTriggerMouseEnter(e, trigger.props),
                            onMouseLeave: e => this.handleTriggerMouseLeave(e, trigger.props)
                        }
                    )
                default:
                    return trigger
            }
        }
        return null
    }
}