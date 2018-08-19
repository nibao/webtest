/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { find } from 'lodash';
import { getUserQuota } from '../../core/apis/eachttp/quota/quota';
import { ClassName } from '../../ui/helper'
import WebComponent from '../webcomponent';

export default class QuotaBase extends WebComponent<Components.Quota.Props, any> implements Components.Quota.Base {
    static defaultProps = {
    }

    state = {
        data: [],
        usedQuota: 0,
        totalQuota: 0
    }

    constructor(props) {
        super(props);
    }

    getUserQuota() {
        getUserQuota().then((quotas) => {

            let userQuota = find(quotas.quotainfos, quota => quota.doctype === 'userdoc');

            if (userQuota) {
                let usedQuota = userQuota.used;
                let totalQuota = userQuota.quota;
                let usedRatio = Number((usedQuota / totalQuota).toFixed(2));
                let unusedRatio = 1 - usedRatio;

                let data = [
                    {
                        value: usedRatio,
                        color: '#e60012',
                        className: ClassName.BackgroundColor
                    }, {
                        value: unusedRatio,
                        color: '#EFEFEF'
                    }
                ];

                this.setState({ data, usedQuota, totalQuota });
            }
        });
    }

    componentDidMount() {
        this.getUserQuota();
    }
}