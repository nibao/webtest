import * as React from 'react';
import FontIcon from '../FontIcon/ui.mobile';
import { FallbackMapper } from './helper';

export default function UIIcon({
    code,
    fallback,
    ...otherProps
}: UI.UIIcon.Props): UI.UIIcon.Element {
    return (
        <FontIcon font="AnyShare" code={code} fallback={fallback || FallbackMapper[code]} {...otherProps} />
    )
}