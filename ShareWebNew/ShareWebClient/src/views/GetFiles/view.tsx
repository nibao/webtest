import * as React from 'react'
import { hashHistory } from 'react-router'
import { download, subscribe, EventType, ErrorCode } from '../../../core/download/download'
import * as fs from '../../../core/filesystem/filesystem'

export default class GetFiles extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context)
        this.handleError = this.handleError.bind(this)
    }

    unsubscribe: Array<() => void> = []

    async componentWillMount() {
        const { link } = this.props.location.query;
        try {
            download(await fs.getLinkRoot(link, ''), { checkPermission: false });
        } catch (e) {
            this.handleError(e);
        }
    }

    componentDidMount() {
        this.unsubscribe = [
            subscribe(EventType.DOWNLOAD_ERROR, this.handleError)
        ]
    }

    handleError(e) {
        if (e.errcode === ErrorCode.LINK_AUTH_FAILED) {
            const { link } = this.props.location.query;
            hashHistory.replace(`/link/${link}`);
        }

    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    render() {
        return null
    }
}