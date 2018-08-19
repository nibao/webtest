import * as React from 'react';
import * as classnames from 'classnames';
import Icon from '../../ui/Icon/ui.mobile';
import FlexBox from '../../ui/FlexBox/ui.mobile';
import PersonalBase from './component.base';
import * as styles from './styles.mobile.css';
import * as  bust from './assets/bust.png';

export default class Personal extends PersonalBase {
    render() {
        return (
            <div className={styles['personal']}>
                    <FlexBox>
                        <FlexBox.Item width="3rem" align="center middle">
                            <Icon url={bust} size={'2rem'} />
                        </FlexBox.Item>
                        <FlexBox.Item align="left middle">
                            <div>
                                {this.state.userName}
                            </div>
                            <div className={styles['dispaly-name']}>
                                {this.state.account}
                            </div>
                        </FlexBox.Item>
                    </FlexBox>
            </div>
        )
    }
}
