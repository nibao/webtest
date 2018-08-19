import { rename as renameFile, getSuggestName as getFileSuggestName } from '../apis/efshttp/file/file'
import { rename as renameDir, getSuggestName as getDirSuggestName } from '../apis/efshttp/dir/dir'
import { isDir, docname } from '../docs/docs'
import { eventFactory } from '../event/event'
import * as fs from '../filesystem/filesystem'
import { ErrorCode } from '../apis/openapi/errorcode'

export enum EventType {
    GET_NEW_NAME,
    SUCCESS,
    ONDUP,
    ERROR,
    CANCEL
}

/**
 * 同名处理方式
 */
export enum OnDup {
    Skip = -1,      // 跳过
    NoCheck = 0,    // 不检查
    Check = 1,      // 询问
    Rename = 2,     // 自动重命名
    Cover = 3       // 覆盖
}

export const { trigger, subscribe } = eventFactory(EventType)

/**
 * 获取新文件名
 * @param doc 
 */
function getNewName(doc) {
    return new Promise((resolve: (newName: string) => void) => {
        trigger(
            EventType.GET_NEW_NAME,
            null,
            {
                target: doc,
                setNewName(newName) {
                    resolve(newName)
                },
                cancel() {
                    resolve(docname(doc))
                }
            }
        )
    })
}

/**
 * 重命名
 * @param doc 
 * @param name 
 */
export async function rename(doc, name: ((doc: any) => string | Promise<string>) | string | Promise<string> = getNewName) {
    try {
        doc = await (typeof doc === 'function' ? doc() : doc)
        if (doc && doc.docid) {
            const isdir = isDir(doc)
            const { docid, name: oldName } = doc
            try {
                name = await (typeof name === 'function' ? name(doc) : name)
                if (name && typeof name === 'string' && name !== oldName) {
                    if (isdir) {
                        await renameDir({ docid, name, ondup: 1 })
                    } else {
                        await renameFile({ docid, name, ondup: 1 })
                    }
                    fs.update(doc, { name })
                    trigger(EventType.SUCCESS, null, { target: doc, oldName, newName: name })
                }
            } catch (e) {
                if (e && e.errcode) {
                    const { errcode } = e
                    switch (errcode) {
                        case ErrorCode.FullnameDuplicated:
                        case ErrorCode.NameDuplicatedReadonly:
                        case ErrorCode.DiffTypeNameDuplicated:
                            const { name: suggestName } = isdir ?
                                await getDirSuggestName({ docid: docid.slice(0, -fs.GNS_LENGTH - 1), name }) :
                                await getFileSuggestName({ docid: docid.slice(0, -fs.GNS_LENGTH - 1), name })
                            return new Promise((resolve => {
                                trigger(
                                    EventType.ONDUP,
                                    () => resolve(),
                                    {
                                        errcode,
                                        nativeEvent: e,
                                        target: doc,
                                        suggestName,
                                        renameWithSuggestName() {
                                            resolve(rename(doc, suggestName))
                                        },
                                        cancel() {
                                            resolve()
                                        }
                                    }
                                )
                            }))
                        default:
                            return new Promise(resolve => {
                                trigger(
                                    EventType.ERROR,
                                    () => resolve(),
                                    {
                                        errcode,
                                        nativeEvent: e,
                                        target: doc,
                                        newName: name,
                                        cancel() {
                                            resolve()
                                        }
                                    }
                                )
                            })
                    }
                }
            }
        }
    } catch (e) { }
}