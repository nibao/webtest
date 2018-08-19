import { merge, omit, indexBy } from 'lodash';


/**
 * 文档缓存对象
 * 以docid为键，文档对象为值。
 * 缓存对象以平铺形式保存，不存在层级关系
 */
export let DATABASE = {}

/**
 * 序列化路径，移除首尾 / ，并分割成数组
 */
export function serializePath(path: string): Array<string> {
    if (!path) return [];
    return path.replace(/^\/+|\/+$/g, '').split('/').map(o => decodeURIComponent(o));
}

/**
 * 将单条gns路径按层级拆分成多条
 * @param gns
 * @return 拆分后的GNS路径数组
 */
export function splitGNS(gns): Array<string> {
    if (!gns) {
        return [];
    } else {
        return gns
            .replace(/^gns:\/\//, '')
            .split('/')
            .reduce((prev, id, i, arr) => prev.concat("gns://" + arr.slice(0, i + 1).join('/')), []);
    }
}

/**
 * 缓存结果
 * @param fn
 */
export function cacheDB(fn) {
    return function (...args) {
        return fn(...args).then((result) => {
            updateCache(result);
            return result;
        });
    };
}

/**
 * 更新缓存
 */
export function updateCache(docs: Array<Core.Docs.Doc | Core.Docs.VirtualDoc>) {
    return DATABASE = merge(DATABASE, indexBy(docs, 'docid'));
}


/**
 * 移除docid下的子目录
 * @param {docid} 文档对象
 */
export function omitSubs({docid}: Core.Docs.Doc) {
    return DATABASE = omit(DATABASE, (doc, gns) => {
        // 只删除非入口文档子目录
        return gns.indexOf(docid) !== -1 && gns.length > docid.length && !doc.doctype
    });
}