import * as React from 'react';
import { formatTime } from '../../util/formatters/formatters';
import WebComponent from '../webcomponent';


export default class ViewVersionDialognBase extends WebComponent<Components.ViewVersionDialog.Props, any> {
    static defaultProps = {

    }

    /**
     * 时间戳转日期 精确到分
     * @param versionDoc 文档对象
     */
    protected convertToDate(versionDoc) {
        return formatTime(versionDoc['modified'] / 1000, 'yyyy/MM/dd HH:mm');

    }
}