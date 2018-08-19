import * as React from 'react';
import { uniqueId, first, last, dropRight } from 'lodash';
import LinkChip from '../LinkChip/ui.desktop';
import CrumbsBase from './ui.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class Crumbs extends CrumbsBase {
    render() {
        return (
            <div className={styles['container']}>
                {
                    this.state.crumbs.length > 1 ?
                        <div>
                            <LinkChip className={styles['back']} onClick={() => this.back(last(dropRight(this.state.crumbs)))} >{__('回到上一层')}</LinkChip>
                            <span className={styles['spliter']}>|</span>
                            <ol className={styles['crumbs']}>
                                {
                                    this.state.crumbs.map((crumb, i) => (
                                        <li className={styles['crumb']}>
                                            <div className={styles['crumbWrap']}>
                                                <span className={styles['joiner']}>&gt; </span>
                                                <LinkChip className={styles['link']} onClick={this.clickCrumb.bind(this, crumb)}>
                                                    {
                                                        this.props.formatter(crumb)
                                                    }
                                                </LinkChip>
                                            </div>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                        :
                        <span>
                            {
                                this.state.crumbs.length ? this.props.formatter(first(this.state.crumbs)) : null
                            }
                        </span>
                }
            </div>
        )
    }
}