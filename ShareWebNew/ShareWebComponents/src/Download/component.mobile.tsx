import * as React from 'react'
import DownloadBase from './component.base'
import Exceptions from './Exceptions/component.mobile'
import * as styles from './styles.desktop.css'

export default class Download extends DownloadBase {
    render() {
        const { onGetURLSuccess, onGetURLError } = this.props
        return (
            <div>
                {
                    typeof onGetURLError === 'function' ?
                        null :
                        <Exceptions />
                }
                {
                    typeof onGetURLSuccess === 'function' ?
                        null :
                        <iframe className={styles['iframe']} src={this.state.url} />
                }
            </div>
        )
    }
}