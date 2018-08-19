import * as React from 'react';

export default class ToolbarBase extends React.Component<Components.PDFViewer.Toolbar.Props, any>{
    scaleRate = this.props.scaleRate
    pageNumber = this.props.pageNumber

    scaleTimeoutId
    pageTimeoutId

    componentWillReceiveProps(nextProps) {
        if (nextProps.scaleRate !== this.props.scaleRate || nextProps.pageNumber !== this.props.pageNumber) {
            this.scaleRate = nextProps.scaleRate;
            this.pageNumber = nextProps.pageNumber;
        }
    }

    handleScale(scaleRate) {
        scaleRate = parseInt(scaleRate);
        this.scaleRate = scaleRate;
        if (this.scaleRate <= 10) {
            this.scaleRate = 10;
        } else if (this.scaleRate >= 400) {
            this.scaleRate = 400;
        }
        window.clearTimeout(this.scaleTimeoutId);
        this.scaleTimeoutId = window.setTimeout(() => {
            this.props.onScale(this.scaleRate)
        }, 200)
    }

    handlePage(page) {
        this.pageNumber = page;
        window.clearTimeout(this.pageTimeoutId)
        this.pageTimeoutId = window.setTimeout(() => {
            this.props.onPage(this.pageNumber)
        }, 200)
    }
}