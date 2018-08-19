import { insertStyle } from '../../util/browser/browser'
import { ClassName } from '../../ui/helper'
import { getOEMConfByOptions } from '../oem/oem'

/**
 * 根据OEM配置设定对应皮肤样式
 */
export async function apply(doc?: HTMLDocument) {

    let theme = '#d70000'

    try {
        theme = (await getOEMConfByOptions(['theme']))['theme'] || theme
        theme = theme.startsWith('#') ? theme : `#${theme}`
    } catch (e) { }

    insertStyle({
        [`.${ClassName.BorderColor}`]: {
            borderColor: `${theme}!important;`
        },
        [`.${ClassName.BorderColor__Focus}:focus`]: {
            borderColor: `${theme}!important;`
        },
        [`.${ClassName.BorderTopColor}`]: {
            borderTopColor: `${theme}!important;`
        },
        [`.${ClassName.BorderRightColor}`]: {
            borderRightColor: `${theme}!important;`
        },
        [`.${ClassName.BorderBottomColor}`]: {
            borderBottomColor: `${theme}!important;`
        },
        [`.${ClassName.BorderLeftColor}`]: {
            borderLeftColor: `${theme}!important;`
        },
        [`.${ClassName.BackgroundColor}`]: {
            backgroundColor: `${theme}!important;`
        },
        [`.${ClassName.BackgroundColor__Hover}:hover`]: {
            backgroundColor: `${theme}!important;`
        },
        [`.${ClassName.Color}`]: {
            color: `${theme}!important;`
        },
        [`.${ClassName.Color__Hover}:hover`]: {
            color: `${theme}!important;`
        },
    }, doc)
}