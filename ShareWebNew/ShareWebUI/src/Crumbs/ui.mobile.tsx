import { last } from 'lodash';
import * as React from 'react';
import LinkIcon from '../LinkIcon/ui.mobile';
import CrumbsBase from './ui.base';
import * as styles from './styles.mobile.css';
import * as back from './assets/back.mobile.png';

export default class Crumbs extends CrumbsBase {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['action']}>
                    {
                        this.state.crumbs.length > 1 ?
                            <LinkIcon className={styles['back']} size={'.75rem'} url={back} onClick={this.back.bind(this)} />
                            : null
                    }
                </div>
                <div className={styles['path']}>
                    {
                        this.state.crumbs.length ? this.props.formatter(last(this.state.crumbs)) : ''
                    }
                </div>
            </div>
        )
    }
}