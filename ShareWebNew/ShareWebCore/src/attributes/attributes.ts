import { customAttributeValue } from '../apis/efshttp/file/file';

/**
 * 获取自定义属性
 */
export function customAttribute(attributeid) {
    return customAttributeValue({ attributeid })
}