import * as React from 'react';
import Overlay from '../../../ui/Overlay/ui.desktop';
import { getErrorMessage } from '../../../core/errcode/errcode';
import * as styles from './styles.desktop';
import __ from './locale';

export default function AuthorizeError({ authorizeError }) {
    return (
        <Overlay position="top center">
            <div className={styles['overlay-box']}>
                {
                    getErrorMessage(authorizeError.errcode) || authorizeError.errmsg || authorizeError.message || __('未知异常')
                }
            </div>
        </Overlay>
    )
}
