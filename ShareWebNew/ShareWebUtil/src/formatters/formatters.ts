import { isDate, zipObject, padLeft, findIndex } from 'lodash';
import { today } from '../date/date'
import __ from './locale'

/**
 * 格式化日期
 * @param time 时间戳或日期对象
 * @param format 格式 
 */
export function formatTime(time?: number | Date, format: string = 'yyyy/MM/dd HH:mm:ss'): string {
    if (!arguments.length) {
        return '';
    }

    let d = isDate(time) ? time : new Date(time);
    let year = d.getFullYear();
    let month = padLeft(String(d.getMonth() + 1), 2, '0');
    let date = padLeft(String(d.getDate()), 2, '0');
    let hour = padLeft(String(d.getHours()), 2, '0');
    let minute = padLeft(String(d.getMinutes()), 2, '0');
    let second = padLeft(String(d.getSeconds()), 2, '0');

    return format.replace(/\b(\w+)\b/g, function (match) {
        switch (match) {
            case 'yyyy':
                return year;

            case 'MM':
                return month;

            case 'dd':
                return date;

            case 'HH':
                return hour;

            case 'mm':
                return minute;

            case 'ss':
                return second;

        }
    });
}

/**
 * 格式化时分秒
 * @param time 时间 秒
 */
export function secToHHmmss(time) {
    return `${Math.floor(time / 3600)}:${padLeft(Math.floor(time % 3600 / 60), 2, '0')}:${padLeft(Math.round(time % 60), 2, '0')}`
}


/**
 * 大小格式化
 * @param bytes 字节大小
 * @param fixed 保留位数 minUnit 最小显示单位
 * @return 返回格式化后的大小字符串
 */
export function formatSize(bytes: number, fixed: number = 2, { minUnit = 'B' } = {} as { minUnit: string }): string {
    if (bytes === undefined) {
        return ''
    }

    const [size, unit] = transformBytes(bytes, { minUnit })

    if (bytes === size) {
        return size + unit;
    } else {
        const sizeStr = size.toString()

        // 不能使用toFixed(fixed)，会导致类似4.99998被入为5.00
        const indexOfPoint = sizeStr.indexOf('.') === -1 ? 0 : sizeStr.indexOf('.');
        return sizeStr.slice(0, indexOfPoint + fixed + 1) + unit;
    }
}

/**
 * 速率格式化
 * @param bytes 字节大小
 * @param fixed 保留位数 minUnit 最小显示单位
 * @return 返回格式化后的大小字符串
 */
export function formatRate(bytes: number, fixed: number = 2, { minUnit = 'B' } = {} as { minUnit: string }): string {
    if (bytes === undefined) {
        return ''
    }
    const [size, unit] = transformBytes(bytes, { minUnit });
    return size.toFixed(fixed) + unit + '/s';
}

/**
 * 转换字节数
 * @param bytes 字节大小
 * @param units 单位集合
 * @param minUnit 最小单位
 * @return size 大小 unit单位
 */
export function transformBytes(bytes: number, { minUnit = 'B' } = {} as { minUnit: string }): [number, string] {
    // 单位集合
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    // 最小显示单位
    let minUnitIndex = findIndex(units, value => value === minUnit);
    // 下标，用来计算适合单位的下标
    let index;
    for (index = minUnitIndex; index <= units.length; index++) {
        if (index === units.length || bytes < Math.pow(1024, index + 1)) {
            break;
        }
    }
    return [bytes / Math.pow(1024, index), units[index]];
}


/**
 * 根据字符串模板从字符串中提取键值对
 * @param input 要匹配的文本
 * @param template 匹配模板
 * @returns 返回匹配到的键值对
 */
export function matchTemplate(input: string, template: string): Object {
    let names = [];
    let regExpStr = template.replace(/\${\s*(\w+?)\s*}/g, function () {
        names.push(arguments[1]);
        return '(.+)';
    });
    let pattern = new RegExp(regExpStr);
    let result = pattern.exec(input);
    let values = result.slice(1);

    return zipObject(names, values);
}

/**
 * 裁切字符串长度
 * @param input string 输入字符串
 * @param [options] {object} 裁切选项
 * @param [options.limit = 20] {number} 限制字符长度
 * @param [options.indicator = '...'] {string} 截取表示字符串
 * @return string
 */
export function shrinkText(input: string = '', { limit = 20, indicator = '...' } = {}): string {
    const CHS_CHAR_REG = /[\u0391-\uFFE5]/g;
    const indicatorWidth = indicator.length + (indicator.match(CHS_CHAR_REG) || []).length; // 每个中文字符记数+1
    const allowStringWidth = limit - indicatorWidth; // 允许的字符宽度
    let rawCut = String(input).slice(0, allowStringWidth); // 先进行无差别切片, 包含中文和英文
    let rawCutChsCount = rawCut.match(CHS_CHAR_REG);
    let inputCutCount = input.match(CHS_CHAR_REG) ? input.match(CHS_CHAR_REG).length : 0

    if ((input.length + inputCutCount) <= limit) {
        return input;
    } else {
        // 当最近非ASCII字符在限制长度之外
        if (!rawCutChsCount) {
            return rawCut + indicator;
        }
        // 当非ASCII字符在限制长度内
        else {
            const chars = rawCut.split('');
            let charCount = 0;
            let i = 0; // 切片尾指针

            for (let len = chars.length; i < len; i++) {
                charCount += chars[i].match(CHS_CHAR_REG) ? 2 : 1;

                if (charCount <= allowStringWidth) {
                    continue;
                } else {
                    break;
                }
            }

            return rawCut.slice(0, i) + indicator;
        }
    }

}

/**
 * 格式化颜色，色值加 #
 */
export function formatColor(input) {
    return /^#/.test(String(input)) ? input : `#${input}`
}

/**
 * 裁剪文件名(省略中间的字符串)，除英文字符外的字符认为长度为2
 * @param name 要裁剪的字符串
 * @param param1 最大长度，默认70
 */
export function decorateText(name, { limit = 70 }) {
    function sumLens(str) {
        let charCode = -1, realLength = 0;
        for (let i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
                realLength += 1;
            } else {
                realLength += 2;
            }
        }
        return realLength;
    }


    if (!name) {
        return '';
    }
    let realLength = sumLens(name)
    let len = name.length, charCode = -1;


    if (realLength > limit) {
        let reset = Math.floor(limit / 2);
        let tmpIndex = 0;
        let tmpLens = 0;
        let resLeftStr = '';
        let resRightStr = '';
        while (tmpLens < reset) {
            charCode = name.charCodeAt(tmpIndex);
            (charCode >= 0 && charCode <= 128) ? tmpLens += 1 : tmpLens += 2;
            resLeftStr += name[tmpIndex];
            tmpIndex += 1;

        }
        tmpIndex = len - 1;
        tmpLens = 0;
        while (tmpLens < reset) {
            charCode = name.charCodeAt(tmpIndex);
            (charCode >= 0 && charCode <= 128) ? tmpLens += 1 : tmpLens += 2;
            resRightStr += name[tmpIndex];
            tmpIndex -= 1;

        }

        if (sumLens(resLeftStr) + sumLens(resRightStr) === sumLens(name)) {
            return name
        } else {
            return resLeftStr + '...' + resRightStr.split('').reverse().join('');
        }

    }
    return name;

}

/**
 * 格式化日期
 * @param {number} modified-后台传递的原始时间戳/1000
 * @returns {string} 按照今天，昨天和其他时间的方式显示
 */
export function formatTimeRelative(modified: number): string {

    const startOfToday: number = (new Date(today().getFullYear(), today().getMonth(), today().getDate(), 0, 0, 0, 0)).getTime() // 获取今天开始时间的时间戳 00:00:00

    const endOfToday: number = startOfToday + (24 * 3600 * 1000 - 1); // 今天结束时间的时间戳 23:59:59

    const startOfYesterday: number = startOfToday - (24 * 3600 * 1000); // 昨天开始时间的时间戳 00:00:00

    const endOfYesterday: number = startOfToday - 1; // 昨天结束时间的时间戳 23:59:59

    if (modified >= startOfToday && modified <= endOfToday) {
        return `${__('今天')} ${formatTime(modified, 'HH:mm:ss')}`
    } else if (modified >= startOfYesterday && modified <= endOfYesterday) {
        return `${__('昨天')} ${formatTime(modified, 'HH:mm:ss')}`
    } else {
        return formatTime(modified)
    }

}
