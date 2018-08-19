import * as React from 'react';
import { noop } from 'lodash';
import TextBox from '../../../ui/TextBox/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default function ChangePassword({ captchaPicture, vcode, handleChange = noop, changeNext = noop, onEnter }) {
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