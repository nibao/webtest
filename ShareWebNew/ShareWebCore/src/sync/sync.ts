/// <reference path="../docs/docs.d.ts" />
/// <reference path="../entrydoc/entrydoc.d.ts" />

import { find, some, assign, filter, reduce, omit, constant } from 'lodash';
import { docname } from '../docs/docs';
import { list as listdir } from '../apis/efshttp/dir/dir';
import { listDir as listLinkDir } from '../apis/efshttp/link/link';
import { DocType, getCompared, queryByType, resolveEntries, getDocTypeByName, getResolvedByType, getViewByType } from '../entrydoc/entrydoc';

interface Records {
    [docid: string]: Core.Docs.Doc
}

let Records: Records = {
}

/**
 * 列举文件时对列举结果额外过滤
 * @param doc 文档对象
 * @return 返回是否要保留该文档对象
 */
interface ListFilter {
    (doc: Core.Docs.Doc): boolean
}

/**
 * 根据新增、修改、删除变化更新当前的文档数据
 * @param param0 文档变化
 * @param records 要处理的文档集合，以docid为key
 */
function updateByCompared([added = [], modified = [], deleted = []], records: Records): Records {
    const removedResult = deleted.reduce(remove, records);
    const modifiedResult = modified.reduce(modify, removedResult);
    const finalResult = added.reduce(add, modifiedResult);

    return finalResult;
}

/**
 * 通过更新入口文档更新文档数据
 * @param doctype 文档类型
 */
export function updateRecords(doctype?: DocType): Promise<Records> {
    return getCompared(doctype).then(([added, modified, deleted]) => {
        return updateByCompared([resolveEntries(added), resolveEntries(modified), resolveEntries(deleted)], Records);
    }).then(records => Records = records)
}

/**
 * 列举docid下的子文件
 * @param docid 要列举的目录docid
 * @param listFilter 对列举结果做额外过滤
 * @return 返回文档对象数组
 */
export function list(docid: string, listFilter: ListFilter = constant(true)): Array<Core.Docs.Doc> {
    return filter(Records, (record) => (record.docid.indexOf(docid) !== -1 && record.docid.length - docid.length) === 33 && listFilter(record)) // '/9EC5E8C5B13A4BDA9E3DA8BD2F9E1762'.length === 33
}

/**
 * 列举
 * @param docid 要列举的目录docid
 * @param listFilter 对列举结果做额外过滤
 * @return 返回文档对象数组
 */
export function listAsync(docid: string, listFilter: ListFilter = constant(true)): Promise<Array<Core.Docs.Doc>> {
    return listdir({ docid }).then(({ dirs, files }) => {
        const docs = [...dirs, ...files];

        // 更新缓存records
        Records = updateByCompared([docs, [], []], Records);

        return docs.filter(listFilter);
    });
}

/**
 * 列举外链目录
 * @param link 外链对象
 * @param docid 要列举的目录docid
 * @param listFilter 对列举结果做额外过滤
 * @return 返回文档对象数组
 */
export function listLinkAsync(link, docid, listFilter: ListFilter = constant(true)): Promise<Array<Core.Docs.Doc>> {
    return listLinkDir(assign({}, link, { docid, by: 'name', sort: 'asc' })).then(({ dirs, files }) => {
        const docs = [...dirs, ...files];

        // 更新缓存records
        Records = updateByCompared([docs, [], []], Records);

        return docs.filter(listFilter);
    });
}

/**
 * 列举根文档
 * @param listFilter 对列举结果做额外过滤
 * @return 返回文档对象数组
 */
export function roots(listFilter: ListFilter = constant(true)): Array<Core.Docs.Doc> {
    return filter(Records, record => record.docid.length === 38 && listFilter(record)) // 'gns://618EEDE68AC5434CA1B853AC0ABFD7B5'.length
}

/**
 * 获取文档对象
 * @param docid 
 */
export function get(docid: string): Core.Docs.Doc {
    return Records[docid];
}

/**
 * 新增文档对象
 * @param records 要处理的文档集合，以docid为key
 * @param doc 文档对象
 */
function add(records: Records, doc): Records {
    return assign(records, { [doc.docid]: doc });
}

/**
 * 文档内容发生变化，删除相关子文档，下次list时重新获取数据
 * @param records 要处理的文档集合，以docid为key
 * @param doc 文档对象
 */
function modify(records: Records, doc): Records {
    return reduce(records, (result, record) => {
        if (record.docid.indexOf(doc.docid) !== -1) {
            if (record.docid !== doc.docid) {
                return omit(result, [doc.docid])
            } else {
                return assign(result, { [doc.docid]: doc })
            }
        } else {
            return result
        }
    }, records)
}

/**
 * 移除文档对象
 * @param records 要处理的文档集合，以docid为key
 * @param doc 文档对象
 */
function remove(records: Records, doc): Records {
    return reduce(records, (result, record) => {
        return record.docid.indexOf(doc.docid) !== -1 ?
            omit(result, [doc.docid]) :
            result
    }, records)
}
