/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import {noop} from 'lodash';

export default class ChipXBase extends React.Component<any, any> {
    static defaultProps = {
        onClick: noop
    }

    clickHandler(e) {
        this.props.onClick()
    }
}