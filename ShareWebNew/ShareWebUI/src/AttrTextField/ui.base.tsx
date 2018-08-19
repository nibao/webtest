///<reference path="./ui.base.d.ts" />

import * as React from 'react';
import { assign, map, floor, padLeft } from 'lodash';
import { shrinkText } from '../../util/formatters/formatters';
import { clock } from '../../util/date/date';
import { ExpandStatus, AttrType } from './helper';
import __ from './locale';

export default class AttrTextFieldBase extends React.Component<UI.AttrTextField.Props, any> implements UI.AttrTextField.Base {
    state = {
        status: ExpandStatus.HIDE
    }

    attribute = {
        name: '',
        value: null,
        type: 0,
        id: 0,
        formatName: '',
        formatValue: '',
        expandStatus: ExpandStatus.HIDE
    }

    componentWillMount() {
        this.InitAttr();
    }

    /**
     * 传入的资源改变时 重新加载
     */
    componentWillReceiveProps(newProps) {
        this.InitAttr(newProps);
    }

    InitAttr(newProps = this.props) {

        let format = {
            formatName: '',
            formatValue: '',
            expandStatus: ExpandStatus.HIDE
        };
        let attr = newProps.attr;
        format.formatName = shrinkText(attr.name, { limit: 11 });

        if (attr.value !== undefined) {
            switch (attr.type) {
                case AttrType.TEXT:
                    format.formatValue = shrinkText(attr.value, { limit: 52, indicator: '' });
                    if (format.formatValue !== attr.value) {
                        format.expandStatus = ExpandStatus.EXPAND;
                    }
                    break;
                case AttrType.TIME:
                    const { hours, minutes, seconds } = clock(attr.value);
                    format.formatValue = [hours, minutes, seconds].map(x => padLeft(x, 2, '0')).join(':')
                    break;
                case AttrType.NUMBER:
                    format.formatValue = attr.value;
                    break;
                case AttrType.ENUM:
                    format.formatValue = attr.value[0];
                    break;
                case AttrType.LEVEL:
                    format.formatValue = attr.value.join('>');
                    break;
            }
        } else {
            format.formatValue = "---";
        }

        this.attribute = assign({}, attr, format);

        this.setState({ status: format.expandStatus });
    }

    /**
     * 秒数转换成时分秒
     */
    formatSecond(second) {
        if (second) {
            let dataArray = [];
            dataArray[0] = floor(second / 3600);
            dataArray[1] = floor((second - dataArray[0] * 3600) / 60);
            dataArray[2] = (second - dataArray[0] * 3600) % 60;
            return dataArray;
        } else {
            return ['', '', ''];
        }
    }
}