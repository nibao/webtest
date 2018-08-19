import * as React from 'react'

export default class Gallery extends React.Component<any, any>{
    container: HTMLDivElement
    thumbnails: Array<HTMLDivElement> = []

    constructor(props, context) {
        super(props, context)
        this.getContainer = this.getContainer.bind(this)
        this.getThumbnails = this.getThumbnails.bind(this)
    }

    componentDidUpdate(prevProps) {
        const { index } = this.props
        if (this.container && this.thumbnails[index] && index !== prevProps.index) {
            const { top: containerTop, bottom: containerBottom } = this.container.getBoundingClientRect()
            const { top, bottom } = this.thumbnails[index].getBoundingClientRect()
            if (top < containerTop) {
                this.container.scrollTop = this.container.scrollTop - containerTop + top
                // this.container.scrollTo({ top: this.container.scrollTop - containerTop + top })
            } else if (bottom > containerBottom) {
                this.container.scrollTop = this.container.scrollTop - containerBottom + bottom
                // this.container.scrollTo({ top: this.container.scrollTop - containerBottom + bottom })
            }
        }
    }

    getContainer(element) {
        if (element) {
            this.container = element
        }
    }

    getThumbnails(element, i) {
        if (element) {
            this.thumbnails[i] = element
        }
    }
}