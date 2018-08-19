import * as React from 'react'
import * as classnames from 'classnames'
import { last } from 'lodash'
import QuickSearch from '../../QuickSearch/component.desktop'
import CrumbsBase from './component.base'
import { docname } from '../../../core/docs/docs'
import { bindEvent, unbindEvent } from '../../../util/browser/browser'
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
                <div className={styles['crumbs']} ref={this.ref.bind(this)}>
                    {
                        crumbs.length > 1 ?
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
                            </div> :
                            null
                    }
                    <div className={classnames(styles['crumbs-wrapper'], { [styles['overflow']]: overflow })}>
                        {
                            crumbs.map((doc, i) => (
                                i === crumbs.length - 1 ?
                                    <div className={styles['crumb']}>
                                        <span> {doc ? docname(doc) : __('全部文档')} </span>
                                    </div> :
                                    <div className={styles['crumb']}>
                                        <span
                                            className={styles['crumb-link']}
                                            onClick={() => this.loadDoc(doc)}
                                        >
                                            {doc ? docname(doc) : __('全部文档')}
                                        </span>
                                        <span className={styles['divider']}>&gt;</span>
                                    </div>
                            ))
                        }
                    </div>
                </div>
                <div className={styles['search']}>
                    <QuickSearch
                        rows={20}
                        range={last(crumbs)}
                        onSelectItem={(doc) => this.selectItem(doc)}
                        onRequestGlobalSearch={(key, range) => this.toGlobalSearch(key, range)}
                        onRequestOpenDir={(doc) => this.handleRequestOpenDir(doc)}
                    />
                </div>
            </div>
        )
    }
}