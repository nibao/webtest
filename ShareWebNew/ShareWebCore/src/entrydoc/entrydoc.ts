/// <reference path="./entrydoc.d.ts" />

import { map, some, assign, pick, omit, find, uniq, groupBy, zipWith, concat, mapKeys } from 'lodash';
import { cacheDB } from '../gns/gns';
import { cache } from '../../util/cache/cache';
import { get, getByType, getViews } from '../apis/eachttp/entrydoc/entrydoc';
import __ from './locale';

/**
 * 文档类型参数
 */
export enum DocType {
    userdoc = 1,
    groupdoc = 2,
    customdoc = 3,
    sharedoc = 4,
    archivedoc = 5,
}

/**
 * 文档分类
 */
export enum ViewDocType {
    UserDoc = 10,
    ShareDoc = 11,
    GroupDoc = 20,
    ShareGroup = 21,
    CustomDoc = 30,
    ArchiveDoc = 40
}

/**
 * 文档分类的名称
 */
export const ViewTypesName = {
    [ViewDocType.UserDoc]: __('个人文档'),
    [ViewDocType.ShareDoc]: __('共享文档'),
    [ViewDocType.GroupDoc]: __('个人群组文档'),
    [ViewDocType.ShareGroup]: __('共享群组文档'),
    [ViewDocType.CustomDoc]: __('文档库'),
    [ViewDocType.ArchiveDoc]: __('归档库')
}

/**
 * 根据type获取文档分类的名称
 */
export function getViewTypesName(type: number): string {
    const viewTypesName = {
        [ViewDocType.UserDoc]: __('个人文档'),
        [ViewDocType.ShareDoc]: __('共享文档'),
        [ViewDocType.GroupDoc]: __('个人群组文档'),
        [ViewDocType.ShareGroup]: __('共享群组文档'),
        [ViewDocType.CustomDoc]: __('文档库'),
        [ViewDocType.ArchiveDoc]: __('归档库')
    }

    return viewTypesName[type]
}


/**
 * 文档类型对应的名称
 */
const Types = {
    userdoc: __('个人文档'),
    sharedoc: __('共享文档'),
    groupdoc: __('群组文档'),
    customdoc: __('文档库'),
    archivedoc: __('归档库'),
}


// 指定类型的入口文档缓存
let Caches = {};


/**
 * 根据docid获取视图
 */
export function getViewById(docid): Promise<APIs.EACHTTP.EntryDoc.View> {
    return Promise.all([getTypeById(docid), getTopViews()]).then(([doctype, views]) => {
        return views.find(view => view.doc_type === doctype)
    })
}

/**
 * 根据docType获取视图对象
 */
export function getViewByType(docType: DocType): Promise<APIs.EACHTTP.EntryDoc.View> {
    return getTopViews().then(views => views.find(view => view.doc_type === DocType[docType]));
}

/**
 * 获取入口文档顶级视图
 */
export function getTopViews(options?): Promise<Array<APIs.EACHTTP.EntryDoc.View>> {
    return getViews(null, options).then(({ viewsinfo }) => viewsinfo);
}

/**
 * 判断是否是视图对象
 * @param o 任意文档对象
 */
export function isTopView(o): boolean {
    return !!(o && o.doc_type !== undefined);
}

/**
 * 根据doctype获取对应名称
 */
export function getTypeNameByDocType(doctype: string | DocType): string {
    if (typeof doctype === 'string') {
        return Types[doctype];
    }
    else if (typeof doctype === 'number') {
        return Types[DocType[doctype]];
    }
}


/**
 * 根据名称获取doctype
 * @param name 文档类型的名称
 */
export function getDocTypeByName(name: string): DocType {
    switch (name) {
        case __('个人文档'):
            return DocType['userdoc'];

        case __('共享文档'):
            return DocType['sharedoc'];

        case __('群组文档'):
            return DocType['groupdoc'];

        case __('文档库'):
            return DocType['customdoc'];

        case __('归档库'):
            return DocType['archivedoc'];
    }
}

/**
 * 根据docid获取doctype
 * @param docid 
 */
export function getTypeById(docid): Promise<string> {
    return queryAll().then(entries => {
        const finded = find(entries, entry => entry.docid.indexOf(docid) !== -1 || docid.indexOf(entry.docid) !== -1);

        return finded && finded.doctype;
    })
}

/**
 * 获取视图名称
 */
export function getViewName(view) {
    switch (view.doc_type) {
        case 'userdoc':
            return __('个人文档');

        case 'sharedoc':
            return __('共享文档');

        case 'groupdoc':
            return __('群组文档');

        case 'customdoc':
            return __('文档库');

        case 'archivedoc':
            return __('归档库');

        default:
            return '';
    }
}

/**
 * 批量分解入口文档
 */
export function resolveEntries(raw): Array<APIs.EACHTTP.EntryDoc.EntryDoc> {
    return raw.reduce((result, entry) => result.concat(resolveSingleEntry(entry)), []);
}

/**
 * 将单条入口文档分解成文档组成的数组
 */
function resolveSingleEntry(entry: APIs.EACHTTP.EntryDoc.EntryDoc): Array<APIs.EACHTTP.EntryDoc.EntryDoc> {
    const gnsList = splitGNS(entry.docid);
    const docnames = entry.docname.split('\\');

    return gnsList.reduce((prev, gns, i, arr) => {
        return prev.concat(i === arr.length - 1 ?
            // 最后一级文档即为入口文档本身
            assign(omit(entry, ['docname', 'docid']), { docname: docnames[i], docid: gns }) :
            // 否则认为是虚拟目录
            assign(pick(entry, ['doctype', 'typename']), { docname: docnames[i], docid: gns }));
    }, []);
};


/**
 * 获取某一类型顶级入口文档
 */
export function getTopEntriesByType(doctype: string | DocType): Promise<Array<APIs.EACHTTP.EntryDoc.EntryDoc>> {
    return getResolvedByTypeDB(doctype).then(entries => uniq(entries.filter(entry => calcGNSLevel(entry.docid) === 1), entry => entry.docname))
}


/**
 * 将单条gns路径分解成多条
 */
export function splitGNS(GNS: string): Array<string> {
    return GNS.replace(/^gns:\/\//, '').split('/').reduce((prev, path, i, arr) => {
        return prev.concat('gns://' + arr.slice(0, i + 1).join('/'));
    }, []);
}

/**
 * 计算GNS路径的层级
 */
export function calcGNSLevel(gns: string): number {
    return splitGNS(gns).length;
}

/**
 * 获取所有入口文档
 */
export const queryAll: Core.EntryDoc.QueryAll = cache(() => get().then(({ docinfos }) => docinfos));


/**
 * 获取指定类型的入口文档
 */
export function queryByType(doctype: DocType, { update = false } = {}): Promise<Array<APIs.EACHTTP.EntryDoc.EntryDoc>> {

    if (!Caches[DocType[doctype]] || update === true) {
        Caches[DocType[doctype]] = getByType({ doctype }).then(({ docinfos }) => docinfos);
    }

    return Caches[DocType[doctype]];
};

/**
 * 比较指定类型的文档，返回三元数组 [新增，修改，删除] 的入口文档
 * @param doctype 文档类型
 * @param prev 现有的指定类型入口文档
 */
function compare(next: Array<APIs.EACHTTP.EntryDoc.EntryDoc> = [], prev: Array<APIs.EACHTTP.EntryDoc.EntryDoc> = []): Array<Array<APIs.EACHTTP.EntryDoc.EntryDoc>> {
    const added = next.filter(({ docid }) => !some(prev, doc => doc.docid === docid));
    const modified = next.filter(({ docid, otag }) => some(prev, doc => doc.docid === docid && doc.otag !== otag));
    const deleted = prev.filter(({ docid }) => !some(next, doc => doc.docid === docid));

    return [added, modified, deleted];
}

/**
 * 比较指定类型的文档，返回三元数组 [新增，修改，删除] 的入口文档
 * @param doctype 文档类型
 * @param prev
 */
export function getCompared(doctype?: DocType): Promise<Array<Array<APIs.EACHTTP.EntryDoc.EntryDoc>>> {
    const query = doctype ? getByType({ doctype }) : get();

    return query.then(({ docinfos }) => {
        const next = doctype ? { [doctype]: docinfos } : groupByType(docinfos);
        const unzipped = map(next, (entries, doctype) => {
            return compare(next[doctype], Caches[DocType[doctype]]);
        }); // [[added, modified, deleted], [added, modified, deleted], ...]

        if (!doctype) {
            Caches = mapKeys(next, (docs, doctype) => DocType[doctype]);
        } else {
            Caches = assign({}, Caches, mapKeys(next, (docs, doctype) => DocType[doctype]));
        }

        return zipWith(...unzipped, (accumulator, value) => [...accumulator, ...value]); // 合并 unzipped => [added, modified, deleted]
    });
}

/**
 * 将入口文档分类
 * @param entries 入口文档
 */
export function groupByType(entries) {
    return assign({
        userdoc: [],
        sharedoc: [],
        groupdoc: [],
        customdoc: [],
        archivedoc: [],
    }, groupBy(entries, 'doctype'));
}

/**
 * 获取组织好的数据
 */
export function getResolvedAll({ update = false } = {}) {
    return queryAll({ update }).then(raw => resolveEntries(raw));
};

/**
 * 获取组织好的数据并缓存
 */
export const getResolvedAllDB = cacheDB(getResolvedAll);

/**
 * 获取组织好的指定类型数据
 */
export function getResolvedByType(doctype: DocType, { update = false } = {}): Promise<Array<APIs.EACHTTP.EntryDoc.EntryDoc>> {
    return queryByType(doctype, { update }).then(raw => resolveEntries(raw));
}

/**
 * 获取组织好的指定类型数据并缓存
 */
export const getResolvedByTypeDB = cacheDB(getResolvedByType);

/**
 * 获取所有入口文档的docid
 */
export function getIds({ update = false } = {}): Promise<Array<string>> {
    return queryAll({ update }).then(raw => map(raw, doc => doc.docid));
};


/**
 * 获取所有入口文档的docid
 */
export function getIdsByType(doctype: DocType, { update = false } = {}) {
    return queryByType(doctype, { update }).then(raw => map(raw, doc => doc.docid));
};


/**
 * 判断一个目录是否是虚拟目录
 */
export function isVirtual(docid: string): Promise<boolean> {
    return getIds().then(entryIds => some(entryIds, entryId => entryId.indexOf(docid) !== -1 && entryId !== docid));
};


/**
 * 判断一个文档是否是入口文档或虚拟目录
 */
export async function isInEntry(docid) {
    const entryIds = (await getIds({ update: true })) || []

    return entryIds.some(entryId => entryId.indexOf(docid) !== -1)
}