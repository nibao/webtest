import * as React from 'react'
import FlashVideoBase, { mountFlash } from './ui.base'

export default class FlashVideo extends FlashVideoBase {
    render() {
        let { flashPath } = this.props
        return (
            <div
                style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                dangerouslySetInnerHTML={mountFlash({ name: this.name, flashPath, callback: this.callbackName })}
            >
            </div>
        )
    }
}