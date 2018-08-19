/// <reference path="./search.d.ts" />

/**
 * 搜索范围
 */
export enum Range {
    // 当前目录
    Current,

    // 仅当前目录
    CurrentOnly,

    // 所有目录
    All
}

/**
 * 构建快速检索参数
 */
export function buildQuickParam(keyword: string, rows: number): Core.Search.Params {
    let params = {
        'start': 0,
        'rows': rows,
        'style': 0, // 查找range下有权限的文件
        'keys': keyword.replace(/"/g, '"').replace(/\s/g, '%20'),
        'keysfields': ['basename', 'content'], // 关键字既可以为文件名，也可以作为内容关键字
        'sort': '-modified'
    };
    return params;
}

/**
 * 将docid数组转换为range
 * @param docids
 * @returns {Array}
 */

export function buildRanges(docids, currentOnly) {
    return docids.map(docid => {
        return formatRange(docid, currentOnly);
    })
};

/**
 * 将docid转为全文检索的range
 * @param docid
 * @returns {string} 返回全文检索range
 */

export function formatRange(docid, currentOnly) {
    let suf = currentOnly ? '' : '*';
    return docid.replace('gns://', 'gns?//') + suf;
};

/**
 * 搜索状态
 */
export enum SearchStatus {
    /**
     * 无操作
     */
    Pending,

    /**
     * 正在搜索
     */
    Fetching,

    /**
     * 搜索出错
     */
    SearchInError,

    /**
     * 完成搜索
     */
    Ok,

    /**
     * 搜索未同步文件/文件夹
     */
    SearchUnsynchronized
}