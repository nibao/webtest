import { isString, isObject } from 'lodash'

/**
 * 缩放窗口适应内容
 * @param nwWindow NW窗口
 * @param size.width 内容宽度
 * @param size.height 内容高度
 */
export function fitSize(nwWindow, { width, height }) {
    const frameWidth = nwWindow.window.outerWidth - nwWindow.window.innerWidth;
    const frameHeight = nwWindow.window.outerHeight - nwWindow.window.innerHeight;

    nwWindow.resizeTo(width + frameWidth, height + frameHeight);
}

/**
 * 获取NWWindow
 * @param id 窗口id
 */
export function getNWWindow(id: string | Window) {
    const appWindow = isString(id) ?
        (
            chrome.app.window.get(id)
        ) :
        (
            isObject(id) ?
                id : null
        )

    return appWindow ? nw.Window.get(appWindow.contentWindow) : null
}