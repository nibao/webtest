import * as React from 'react';
import { map } from 'lodash';
import Panel from '../../ui/Panel/ui.desktop';
import CSFDetailsBase from './component.base'
import * as styles from './styles.desktop';
import __ from './locale';

export default class CSFDetails extends CSFDetailsBase {
    render() {
        const { csfDetails } = this.state
        const { onConfirm } = this.props

        return (
            <Panel>
                <Panel.Main>
                    {
                        map(csfDetails, (value, key) => {
                            return (
                                <div className={styles['details']}>
                                    <span className={styles['detail-title']}>{key}</span>
                                    <span
                                        className={styles['detail-content']}
                                        title={value}
                                        >
                                        {value}
                                    </span>
                                </div>
                            )
                        })
                    }
                </Panel.Main>
                <Panel.Footer>
                    <Panel.Button onClick={onConfirm}>
                        {__('确定')}
                    </Panel.Button>
                </Panel.Footer>
            </Panel>
        )
    }
}
