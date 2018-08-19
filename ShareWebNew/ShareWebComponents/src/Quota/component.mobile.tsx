import * as React from 'react';
import { map } from 'lodash';
import { formatSize } from '../../util/formatters/formatters';
import StackBar from '../../ui/StackBar/ui.mobile';
import QuotaBase from './component.base';
import * as styles from './styles.mobile.css';
import __ from './locale';

export default class Quota extends QuotaBase {
    render() {
        return (
            <div className={styles.container}>
                {
                    this.renderBar()
                }
                <div className={styles.text}>{__('容量：')}{formatSize(this.state.usedQuota)}/{formatSize(this.state.totalQuota)}</div>
            </div>
        )
    }

    renderBar() {
        return (
            <StackBar>
                {
                    map(this.state.data, x => {
                        return (
                            <StackBar.Stack
                                rate={x.value}
                                background={x.color}
                                className={x.className}
                            />

                        )
                    })

                }
            </StackBar>
        )
    }
}