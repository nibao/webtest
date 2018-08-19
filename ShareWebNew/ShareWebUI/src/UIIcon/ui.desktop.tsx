/// <reference path="./index.d.ts" />

import * as React from 'react';
import FontIcon from '../FontIcon/ui.desktop';
import { FallbackMapper } from './helper';

const UIIcon: React.StatelessComponent<UI.UIIcon.Props> = function UIIcon({
    code,
    fallback,
    ...otherProps
}) {
    return (
        <FontIcon
            font="AnyShare"
            code={code}
            fallback={fallback || FallbackMapper[code]} {...otherProps}
        />
    )
}

export default UIIcon