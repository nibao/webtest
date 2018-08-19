import * as React from 'react';
import { noop } from 'lodash';
import TextBox from '../../../ui/TextBox/ui.desktop';
import * as styles from './styles.view';
import __ from './locale';

const Captcha: React.StatelessComponent<Components.LoginCluster.Captcha> = function Captcha({
    captchaPicture,
    vcode,
    handleChange = noop,
    changeNext = noop,
    onEnter
}) {
    return (
        <div className={styles['captach']}>
            <div className={styles['captach-input']}>
                <TextBox
                    value={vcode}
                    onChange={value => { handleChange(value) }}
                    placeholder={__('请输入验证码')}
                    width={120}
                    onEnter={onEnter}
                    className={styles['captach-input-size']}
                />
            </div>
            <div className={styles['captach-img']}>
                <img src={`data:image/jpeg;base64,${captchaPicture}`} onClick={changeNext} height={39} />
            </div>
        </div>
    )
}

export default Captcha