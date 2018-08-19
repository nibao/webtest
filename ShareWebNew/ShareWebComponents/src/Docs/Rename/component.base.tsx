import * as React from 'react'

export default class Rename extends React.Component<any, any>{

    constructor(props, context) {
        super(props, context)
        this.ref = this.ref.bind(this)
    }

    state = {
        anchor: null
    }

    /**
     * 设置anchor
     */
    ref(ref) {
        if (ref) {
            this.setState({
                anchor: ref
            })
        }
    }
}