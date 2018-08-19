/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop.css';

const WizardStep: React.StatelessComponent<UI.WizardStep.Props> = function WizardStep({ title, active, onEnter, onBeforeLeave, onLeave, children }) {
    return (
        <div className={classnames([styles['content']], { [styles['active']]: active })}>
            {
                children
            }
        </div>
    )
}

export default WizardStep;