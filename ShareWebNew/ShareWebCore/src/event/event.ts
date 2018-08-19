/**
 * 事件系统工厂函数
 * @param eventTypes 事件类型
 * @returns
 *  subscribe 订阅事件
 *  trigger 触发事件
 */
export function eventFactory(eventTypes = {}) {
    
    /** 事件 handlers */
    const Handlers = {}

    /** 
     * 获取事件处理 handlers
     * @param eventType  
     **/
    function getEventHandlers(type: string | number) {
        return Array.isArray(Handlers[type]) ? Handlers[type] : []
    }

    /** 触发事件
     * @param eventType 事件类型
     * @param defaultHandler 默认handler
     * @param args 参数 
     **/

    function trigger(type: string | number, defaultHandler?, ...args) {
        const handlers = getEventHandlers(type)
        if (handlers.length) {
            handlers.forEach(handler => handler(...args))
            return
        }
        if (typeof defaultHandler === 'function') {
            defaultHandler(...args)
        }
    }

    /**
     * 订阅事件
     * @param type 事件类型
     * @param handler 事件处理函数
     */
    function subscribe(type: string | number, handler) {
        if (typeof eventTypes[type] === 'undefined') {
            throw `event ${type} does not exist`
        }

        if (typeof handler !== 'function') {
            throw `handler must be function`
        }

        if (!Handlers[type]) {
            Handlers[type] = []
        }

        if (Handlers[type].indexOf(handler) === -1) {
            Handlers[type] = [...Handlers[type], handler]
        }

        /** 取消订阅 */
        return function unsubscribe() {
            if (Array.isArray(Handlers[type])) {
                Handlers[type] = Handlers[type].filter(fn => fn !== handler)
            }
        }
    }

    return { trigger, subscribe }
}