import { noop } from 'lodash';
import { isIE8, origin, bindEvent } from '../browser/browser';

// 集中注册消息处理函数到此对象
const Messages = {};

const listener = bindEvent(window, 'message', handleMessage);

/**
 * 处理消息
 * @param e 消息事件
 */
function handleMessage(e) {
    const {data, origin: postOrigin} = e;

    // 只允许同源传递消息
    if (postOrigin !== origin()) {
        return;
    } else {
        // IE8 只支持字符串类型的postMessage
        const [what, detail] = isIE8() ? JSON.parse(data) : data;
        const handler = Messages[what];

        if (handler) {
            handler(detail);
        }
    }
}

/**
 * 注册消息处理
 * @param what 消息
 * @param handler 消息详细数据
 */
export function listen(what, handler = noop) {
    Messages[what] = handler.bind(null)
}

/**
 * 解注册消息处理
 * @param what 消息
 */
export function unlisten(what) {
    delete Messages[what];
}

/**
 * 发送消息
 * @param what 消息
 * @param data 数据
 * @param target 目标
 */
export function post(what, detail, target = window.opener) {
    const message = [what, detail];

    // IE8 只支持字符串类型的postMessage
    target.postMessage(isIE8() ? JSON.stringify(message) : message, location.host);
}

