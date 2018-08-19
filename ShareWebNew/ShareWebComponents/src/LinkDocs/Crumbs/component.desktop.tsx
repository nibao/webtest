import * as React from 'react'
import * as classnames from 'classnames'
import { docname } from '../../../core/docs/docs'
import { bindEvent, unbindEvent } from '../../../util/browser/browser'
import CrumbsBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class Crumbs extends CrumbsBase {
    componentDidMount() {
        bindEvent(window, 'resize', this.checkOverflow)
    }

    componentWillUnmount() {
        unbindEvent(window, 'resize', this.checkOverflow)
    }

    componentWillReceiveProps() {
        this.setState({
            overflow: false
        })
    }

    componentDidUpdate() {
        if (this.crumbs) {
            if ((this.crumbs.scrollWidth > this.crumbs.offsetWidth)) {
                if (!this.state.overflow) {
                    this.setState({
                        overflow: true
                    })
                }
            }
        }
    }

    render() {
        const { crumbs } = this.props
        const { overflow } = this.state

        return (
            <div className={styles['container']}>
                <div
                    className={styles['crumbs']}
                    ref={this.ref.bind(this)}
                >
                    <div className={classnames(styles['crumb'], styles['back'])}>
                        <span
                            className={styles['crumb-link']}
                            onClick={this.loadParent.bind(this)}
                        >
                            {__('返回')}
                        </span>
                        <span className={styles['divider']}>|</span>
                        {
                            overflow ?
                                <span>...</span> :
                                null
                        }
                    </div>
                    <div className={classnames(styles['crumbs-wrapper'], { [styles['overflow']]: overflow })}>
                        {
                            crumbs.map((doc, i) => (
                                i === crumbs.length - 1 ?
                                    <div className={styles['crumb']}>
                                        <span> {docname(doc)} </span>
                                    </div>
                                    :
                                    <div className={styles['crumb']}>
                                        <span
                                            className={styles['crumb-link']}
                                            onClick={() => this.loadDoc(doc)}
                                        >
                                            {docname(doc)}
                                        </span>
                                        <span className={styles['divider']}>&gt;</span>
                                    </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}