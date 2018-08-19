import * as React from 'react'
import AsFileSystem from '../../core/filesystem/filesystem'

export default class AsFileSystemProvider extends React.Component<any, any>{

    static childContextTypes = {
        fileSystem: React.PropTypes.instanceOf(AsFileSystem)
    }

    state = {
        fileSystem: null
    }

    getChildContext() {
        return {
            fileSystem: this.state.fileSystem
        }
    }

    componentDidMount() {
        if (this.props.root) {
            this.setState({
                fileSystem: new AsFileSystem(this.props.root)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.root && nextProps.root !== this.props.root) {
            this.setState({
                fileSystem: new AsFileSystem(nextProps.root)
            })
        }
    }

    render() {
        return this.state.fileSystem ? this.props.children : null
    }
}