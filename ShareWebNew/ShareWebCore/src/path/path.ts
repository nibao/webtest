/// <reference path="../apis/efshttp/link/link.d.ts" />
/// <reference path="../docs/docs.d.ts" />
/// <reference path="./path.d.ts" />

import { isString, pick, last, assign, first, findIndex, dropRight, mapValues, filter } from 'lodash';
import * as sync from '../sync/sync';
import { getDocTypeByName, DocType, getResolvedByType, getResolvedByTypeDB, isInEntry } from '../entrydoc/entrydoc';
import { combineDocs, docname, listDirDB, listByName, findSubs, findById } from '../docs/docs';
import { list as listLinkDir } from '../link/link';
import { cacheDB } from '../gns/gns';

/**
 * 编码路径
 */
export function encode(path: string = ''): string {
    return path.replace(/[#\?%]/g, encodeURIComponent)
}


/**
 * 解码路径
 */
export function decode(path: string = ''): string {
    return path.replace(/%23|%3F|%25/g, decodeURIComponent)
}

/**
 * 计算相对路径，返回完整路径
 * @param current 当前路径
 * @param relative 相对路径
 * @return 返回计算后的完整路径
 */
export function relative(current: string, relative: string): string {
    const currentArr = current ? current.replace(/^\/+|\/+$/g, '').split('/') : [];
    const relativeArr = relative ? relative.replace(/^\/+|\/+$/g, '').split('/') : [];

    return relativeArr.reduce((result, rel) => {
        if (rel === '..') {
            if (result.length) {
                return dropRight(result);
            } else {
                return result;
            }
        } else {
            return [...result, rel];
        }
    }, currentArr).join('/');
}

/**
 * 构建路径数组
 */
function mapPath(doctype: number, path: string | Array<string>, { update = false } = {}) {
    const pathArr = isString(path) ? serializePath(path) : [];

    return getResolvedByTypeDB(doctype, { update }).then((entries) => {
        return pathArr.reduce((chain, name, i) => {
            return chain.then((prev) => {
                const cached = findByPath(pathArr.slice(0, i + 1).join('/'));
                if (!last(prev) && !cached) {
                    return prev.concat(null)
                } else {
                    return cached ?
                        prev.concat(cached)
                        : searchServer(last(prev), name).then((finded) => prev.concat(finded));
                }
            });
        }, Promise.resolve([]));
    });
}


/**
 * 构建外链路径数组
 */
function mapLinkPath(link, path, { update = false } = {}) {
    const pathArr = serializePath(path);

    return pathArr.reduce((chain, name, i) => {
        return chain.then((prev) => {
            return searchServer(assign({}, link, { docid: last(prev).docid }), name).then((finded) => prev.concat(finded));
        });
    }, Promise.resolve([link]));
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
            .reduce((prev, id, i, arr) => prev.concat('gns://' + arr.slice(0, i + 1).join('/')), []);
    }
}

/**
 * 将GNS路径映射成文档对象数组
 * @param docid
 * @return 文档对象数组
 */
export function mapGNS(docid) {
    const gnsArr = splitGNS(docid);

    return gnsArr.reduce((chain, gns) => {
        return chain.then((prev) => {
            return isInEntry(gns).then((result) => {
                if (result === true) {
                    return prev.concat(findById(gns));
                }
                else {
                    return listDirDB(last(prev)).then((docs) => prev.concat(docs.find((doc) => doc.docid === gns)));
                }
            });
        });
    }, Promise.resolve([]));
}


/**
 * 将GNS路径映射成文档对象数组
 * @param link
 * @param docid
 * @return 文档对象数组
 */
export function mapLinkGNS(link: APIs.EFSHTTP.Link.Get, docid?: string) {

    return listLinkDir(link).then(docs => {
        const completeGNSArr = splitGNS(docid); // 完整分割的GNS路径
        const gnsArr = completeGNSArr.slice(completeGNSArr.indexOf(link.docid) + 1)
        return gnsArr.reduce((chain, gns, i) => {
            return chain.then(prev => {
                return i === 0 ?
                    prev.concat(docs.find(doc => doc.docid === gnsArr[i]))
                    : listLinkDir(assign({}, link, { docid: last(prev).docid })).then(docs => prev.concat(docs.find((doc) => doc.docid === gns)));
            })
        }, Promise.resolve([link]))
    });
}


/**
 * 映射全路径为文档对象数组
 * @param path 路径
 */
export function map(path: string): Promise<Array<Core.Docs.Doc>> {
    const [view, ...names] = path.split(/\/+/);
    const type = getDocTypeByName(view);
    const roots = sync.roots(root => type === DocType[root.doctype]);
    const chain = Promise.resolve(roots && roots.length ? roots : sync.updateRecords(type).then(() => sync.roots(root => type === DocType[root.doctype])))

    return names.reduce((result, name, index, total) => {
        return result.then(parents => {
            const match = parents.find(parent => docname(parent) === name);

            // 如果从父目录list结果中能找到名字对应的文档
            if (match) {
                // 最后一级文档总是从服务器list
                if (index === total.length - 1) {
                    return sync.listAsync(match.docid)
                } else {
                    // 如果不是最后一级文档，则先从缓存中查找结果，如果有则优先用缓存
                    // 否则从服务器list并返回，list结果存入缓存下次使用
                    const children = sync.list(match.docid);
                    return children && children.length ? children : sync.listAsync(match.docid);
                }
            } else {
                throw new Error(`doc not existed ${name}`)
            }
        })
    }, chain);
}


/**
 * 映射外链全路径为文档对象数组
 * @param link 外链对象
 * @param path 路径
 */
export function mapLink(link, path): Promise<Array<Core.Docs.Doc>> {
    const root = pick(link, ['client_mtime', 'modified', 'name', 'size']);
    const names = path ? path.split(/\/+/) : [];

    return names.reduce((result, name, index, total) => {
        return result.then(prevs => {
            const parent = last(prevs);

            // 列举外链id
            if (index === 0) {
                return listLinkDir(link).then(docs => {
                    // 找到匹配name的文档对象
                    const match = docs.find(parent => docname(parent) === name);

                    if (match) {
                        return [...prevs, match];
                    } else {
                        // throw new Error(`doc not existed ${name}`);
                        return prevs
                    }
                })
            }
            else {
                // 如果不是最后一级文档，则先从缓存中查找结果，如果有则优先用缓存
                // 否则从服务器list并返回，list结果存入缓存下次使用
                const docs = sync.list(parent.docid);

                return (
                    docs && docs.length ?
                        Promise.resolve(docs) :
                        sync.listLinkAsync(link, parent.docid)
                ).then(docs => {
                    const match = docs.find(parent => docname(parent) === name);

                    if (match) {
                        return [...prevs, match];
                    } else {
                        // throw new Error(`doc not existed ${name}`);
                        return prevs
                    }
                })
            }
        })
    }, Promise.resolve([root]));
}


/**
 * 加载外链路径
 * @param path 路径
 * @param link 外链对象
 */
export function loadLinkPath(link, path) {
    return mapLink(link, path).then(list => sync.listLinkAsync(link, last(list).docid))
}


/**
 * 解析路径
 * @param doctype 文档类型
 * @param path 文档路径
 * @param update 是否需要更新缓存
 * @return 文档对象
 */
export function parsePathOfType(doctype, path, { update = false } = {}) {
    return mapPath(doctype, path, { update }).then(list => last(list));
}


/**
 * 解析外链路径
 * @param link 外链对象
 * @param path 文档路径
 * @param update 是否需要更新缓存
 */
export function parseLinkPath(link, path, { update = false } = {}) {
    return mapLinkPath(link, path, { update }).then(list => last(list));
}

/**
 * 判断是否是视图对象
 */
function isTopView(o) {
    return o.doc_type !== undefined;
}

/**
 * 从服务器检索文件
 */
function searchServer(params, name) {

    return (params.link ? listLinkDir(params) : listDirDB(params)).then(docs => {
        return find(docs, name);
    });
}

/**
 * 从服务器检索文件并缓存
 */
export const searchServerDB = cacheDB(searchServer)


/**
 * 在文档列表中查找匹配文档
 */
function find(list, name) {
    return list.find(doc => docname(doc) === name);
}


/**
 * 序列化路径，移除首尾 / ，并分割成数组
 */
export function serializePath(path: string | Array<string>): Array<string> {
    if (!path) {
        return [];
    }

    return path.replace(/^\/+|\/+$/, '').split('/').map(o => decode(o));
}


/**
 * 从数据中中查找路径
 * @param path 完整路径,eg: '测试用户/目录1/ReadMe.txt'
 * @return 返回匹配的文档对象
 */
function findByPath(path) {
    const pathArr = serializePath(path);

    return pathArr.reduce(function (prev, name, i) {
        // 如果是第一级目录，则只会有一个匹配，直接返回即可
        if (i === 0) {
            return first(listByName(name));
        }
        else {
            if (!prev) {
                return null;
            }
            else {
                return first(findSubs(prev, (doc) => docname(doc) === name));
            }
        }
    }, null);
}