import * as React from 'react';
import UserAgreementPageBase from './component.base';
import * as styles from './styles.view.css';

export default class UserAgreementPage extends UserAgreementPageBase {
    render() {
        const { agreementText } = this.state;
        return (
            <div className={styles['container']}>
                <div className={styles['middle']}>
                    <div className={styles['inner']}>
                        {agreementText}
                    </div>
                </div>
            </div>
        )
    }
}