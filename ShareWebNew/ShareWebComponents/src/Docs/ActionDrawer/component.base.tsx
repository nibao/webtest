import * as React from 'react'

export default class ActionDrawer extends React.Component<any, any> {
    trigger(e, handler) {
        this.close(e)
        if (typeof handler === 'function') {
            handler(this.props.docs)
        }
    }

    /**
     * 关闭抽屉
     * @param e 
     */
    close(e) {
        this.props.onRequestClose(e)
    }
}