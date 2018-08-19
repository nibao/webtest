import * as React from 'react';
import FlexBox from '../FlexBox/ui.desktop'
import Mask from '../Mask/ui.desktop'
import Icon from '../Icon/ui.desktop'
import * as styles from './styles.mobile';
import * as loading from './assets/images/light.gif'

export default function ProgressCircle({ detail }) {
    return (
        <div>
            <Mask />
            <div className={styles['loading-container']}>
                <FlexBox>
                    <FlexBox.Item align={'center middle'}>
                        <div className={styles['loading-box']} >
                            <Icon url={loading} />
                            {
                                detail ?
                                    (
                                        <div className={styles['loading-message']}>
                                            {detail}
                                        </div>
                                    ) :
                                    null
                            }
                        </div>
                    </FlexBox.Item>
                </FlexBox>
            </div>
        </div>
    )
}