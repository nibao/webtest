import * as React from 'react';
import * as classnames from 'classnames'
import Mask from '../Mask/ui.desktop'
import Icon from '../Icon/ui.desktop'
import Centered from '../Centered/ui.desktop';
import * as styles from './styles.desktop.css';
import * as darkLoading from './assets/images/dark.gif'
import * as lightLoading from './assets/images/light.gif'

const ProgressCircle: React.StatelessComponent<UI.ProgressCircle.Props> = function ProgressCircle({
    detail,
    showMask,
    theme,
    fixedPositioned
}) {
    return (
        <div className={styles['container']}>
            {
                showMask ?
                    <Mask />
                    : null
            }
            <div className={classnames({ [styles['position-fixed']]: fixedPositioned, [styles['position-static']]: !fixedPositioned })}>
                <Centered>
                    <div className={classnames(styles['loading-box'], { [styles['grey']]: !showMask })} >
                        <Icon url={theme === 'dark' ? darkLoading : lightLoading} />
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
                </Centered>
            </div>
        </div>
    )
}

ProgressCircle.defaultProps = {
    detail: '',
    showMask: true,
    theme: 'light',
    fixedPositioned: true
}

export default ProgressCircle