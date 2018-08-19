import * as React from 'react';
import { noop } from 'lodash';
import LinkIcon from '../LinkIcon/ui.mobile';
import FlexBox from '../FlexBox/ui.mobile';
import * as styles from './styles.mobile.css';
import * as close from './assets/close.mobile.png';

export default function DialogHeader({ onClose = noop, closable = false, children }: UI.DialogHeader.Props) {
    return (
        <div className={styles['container']}>
            <div className={styles['padding']}>
                <FlexBox>
                    <FlexBox.Item align="left middle">
                        {
                            children
                        }
                    </FlexBox.Item>
                    <FlexBox.Item align="right middle">
                        {
                            closable ? <LinkIcon size="20" url={close} onClick={onClose} /> : null
                        }
                    </FlexBox.Item>
                </FlexBox>
            </div>
        </div>
    )
}