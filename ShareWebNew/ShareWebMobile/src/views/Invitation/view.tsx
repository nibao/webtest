import * as React from 'react';
import ShareJoin from '../../../components/ShareJoin/component.mobile';
import FlexBox from '../../../ui/FlexBox/ui.mobile';
import * as styles from './styles.css';

const InvitationView: React.StatelessComponent<any> = function ({ 
    params
}) {
    return (
        <div className={styles['container']}>
            <FlexBox>
                <FlexBox.Item align="center middle">
                    <ShareJoin invitationid={params.invitation} />
                </FlexBox.Item>
            </FlexBox>
        </div>
    )
}

export default InvitationView