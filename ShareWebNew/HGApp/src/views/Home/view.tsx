import * as React from 'react'
import * as classnames from 'classnames'
import FileSystemProvider from '../../../components/FileSystemProvider/component.base'
import * as styles from '../styles.css'

export default class HomeView extends React.Component<any, any>{

    render() {
        const { children } = this.props
        return <div>{children}</div>
    }
}