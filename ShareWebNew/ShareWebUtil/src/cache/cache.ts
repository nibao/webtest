/// <reference path="../../../typings/index.d.ts" />
/// <reference path="./cache.d.ts" />

/**
 * 缓存值
 * @param item 要缓存的值，如果是函数，则缓存函数调用结果
 * @return 返回函数，调用获取缓存值
 */
export function cache(item: any): Utils.Cache.Cached {
    let cached;

    return function ({update = false} = {}) {
        let needUpdate = cached === undefined ? true : update;

        if (needUpdate) {
            cached = typeof item === 'function' ? item() : item;
        }

        return cached;
    }
}