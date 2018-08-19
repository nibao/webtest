/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import ChipXBase from './ui.base';

import * as styles from './styles.desktop';

export default class ChipX extends ChipXBase {
    render() {
        return (
            <a href="javascript:void(0)" className={styles.chipX} onClick={this.clickHandler.bind(this) }>X</a>
        )
    }
}