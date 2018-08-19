import * as React from 'react';
import * as classnames from 'classnames';
import { ClassName } from '../helper';
import * as styles from './styles.desktop';

export default function HorizonLine({ height = 1 } = {}): UI.HorizonLine.Element {
    return (
        <hr
            style={ { borderBottomWidth: height } }
            className={ classnames(styles['hr'], ClassName.BorderColor) }
        />
    )
}