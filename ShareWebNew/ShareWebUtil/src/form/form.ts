/// <reference path="../../../typings/index.d.ts" />

import {reduce, assign} from 'lodash';

/**
 * 从表单中提取键值对
 * @desc 表单中的元素必须设置“name”字段
 */
export function getFormData(form: HTMLFormElement): Object {
    return reduce(form.elements, (result, element) => {
        let elementName = element.name;
        let elementValue = element.value;

        if (elementName) {
            return assign(result, { [elementName]: elementValue });
        } else {
            return result;
        }
    }, {})
}

/**
 * 将表达域提取为JSON数据
 */
export function JSONify(form: HTMLFormElement): string {
    return JSON.stringify(getFormData(form));
}