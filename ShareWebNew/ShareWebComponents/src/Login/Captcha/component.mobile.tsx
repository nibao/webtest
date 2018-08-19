import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import TextInput from '../../../ui/TextInput/ui.mobile';
import { ClassName } from '../../../ui/helper';
import * as styles from './styles.mobile.css';
import __ from './locale';

export default function ChangePassword({ captchaPicture, vcode, handleChange = noop, changeNext = noop }) {
    return (
        <div className={styles['captach']}>
            <div className={styles['captach-input']}>
                <TextInput
                    className={classnames(styles['captach-input-size'], ClassName.BorderColor__Focus)}
                    value={vcode}
                    onChange={value => { handleChange(value) }}
                    placeholder={__('请输入验证码')}
                />
            </div>
            <div className={styles['captach-img']}>
                {
                    captchaPicture ?
                        <img src={`data:image/jpeg;base64,${captchaPicture}`} onClick={changeNext} height={45} /> :
                        null
                }

            </div>
        </div>
    )
}