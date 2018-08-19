import { eventFactory } from '../event/event'
import { getSuggestName as getSuggestNameDir, copy as copyDir } from '../apis/efshttp/dir/dir'
import { copy as copyFile, getSuggestName as getSuggestNameFile } from '../apis/efshttp/file/file'
import * as fs from '../filesystem/filesystem'
import { ErrorCode } from '../apis/openapi/errorcode'
import { isDir } from '../docs/docs'

export enum Ondup {
    /**
     * 跳过
     */
    Skip = -1,

    /**
     * 询问
     */
    Query = 1,

    /**
     * 重命名
     */
    Rename,

    /**
     * 覆盖
     */
    Cover
}

export enum EventType {
    /**
     * 获取复制的目标地址
     */
    GetDest,

    /**
     * 复制成功
     */
    Success,

    /**
     * 复制失败
     */
    Error,

    /**
     * 复制的同名冲突
     */
    Ondup,

    /**
     * 取消复制
     */
    Cancel
}

export const { trigger, subscribe } = eventFactory(EventType)

/**
 * 默认策略
 */
const DefaultStrategy = {
    [ErrorCode.FullnameDuplicated]: Ondup.Query,
    [ErrorCode.DiffTypeNameDuplicated]: Ondup.Query,
    [ErrorCode.NameDuplicatedReadonly]: Ondup.Query,
    [ErrorCode.GNSInaccessible]: false,
    [ErrorCode.PermissionRestricted]: false,
    [ErrorCode.MissingDestination]: false,
    [ErrorCode.PermissionMismath]: false,
    [ErrorCode.QuotaExhausted]: false,
    [ErrorCode.CopyToSelfDisabled]: false,
    [ErrorCode.CSFLevelMismatch]: false,
    [ErrorCode.CopyToWatermarkLibraryDisabled]: false,
    [ErrorCode.AccountFrozen]: false,
    [ErrorCode.DocumentFrozen]: false
}

/**
 * 获取复制到的目标地址
 * @param doc 
 */
function getDest(dest: Core.Docs.Doc) {
    return new Promise((resolve: (dest: Core.Docs.Doc) => void) => {
        trigger(
            EventType.GetDest,
            null,
            {
                dest,
                // 确定
                copyTo(dest) {
                    resolve(dest)
                },
                // 取消
                cancel() {
                    resolve('')
                }
            }
        )
    })
}

/**
 * 复制
 * @param docs 被复制的文件数组
 * @param dest 复制到的目标路径
 */
export async function copy(docs: (() => Core.Docs.Docs | Core.Docs.Doc) | Core.Docs.Doc | Core.Docs.Docs, dest: ((doc: Core.Docs.Doc) => Core.Docs.Doc | Promise<Core.Docs.Doc>) | Core.Docs.Doc | Promise<Core.Docs.Doc> = getDest) {
    try {
        docs = await (typeof docs === 'function' ? docs() : docs)

        if (!Array.isArray(docs)) {
            docs = [docs]
        }

        dest = await (typeof dest === 'function' ? dest(docs[0]) : dest)

        if (dest) {
            let strategy = { ...DefaultStrategy }

            for (const doc of docs) {
                strategy = await copyTo(doc, dest, strategy)
            }
        }
    } catch (e) {
    }
}

/**
 * 单个复制操作
 * @param doc 单个文件
 * @param dest 复制到的目标路径
 * @param strategy 策略
 */
async function copyTo(doc: Core.Docs.Doc, dest: Core.Docs.Doc, strategy: any) {
    try {
        const newDoc = isDir(doc) ?
            await copyDir({ docid: doc.docid, destparent: dest.docid, ondup: Ondup.Rename })
            :
            await copyFile({ docid: doc.docid, destparent: dest.docid, ondup: Ondup.Rename })

        // 复制完成之后，需要在fs中插入一条新的文件夹信息
        fs.insert({ ...doc, ...newDoc })

        trigger(
            EventType.Success,
            null,
            {
                dest,
                newDoc
            }
        )

        return strategy
    } catch (e) {
        if (e && e.errcode) {
            const { errcode } = e

            // 跳过
            if (strategy[errcode] === Ondup.Skip) {
                return strategy
            }

            switch (errcode) {
                // 相同类型的同名冲突
                case ErrorCode.FullnameDuplicated:
                // 不同类型的同名冲突
                case ErrorCode.DiffTypeNameDuplicated:
                // 没有修改权限的同名冲突
                case ErrorCode.NameDuplicatedReadonly:
                    const { name: suggestName } = isDir(doc) ?
                        await getSuggestNameDir({ docid: dest.docid, name })
                        :
                        await getSuggestNameFile({ docid: dest.docid, name })

                    await new Promise(resolve => {
                        trigger(
                            EventType.Ondup,
                            () => resolve(),
                            {
                                errcode,
                                nativeEvent: e,
                                dest,
                                suggestName,
                                doc,
                                // 使用推荐的名字新建
                                copyWithSuggestName() {
                                    resolve(copyTo(doc, dest, strategy))
                                },
                                // 覆盖
                                cover() {
                                    resolve(copyTo(doc, dest, strategy))
                                },
                                // 取消
                                cancel() {
                                    resolve()
                                }
                            }
                        )
                    })

                    return strategy

                default:
                    await new Promise((resolve, reject) => {
                        trigger(
                            EventType.Error,
                            () => resolve(),
                            {
                                errcode,
                                nativeEvent: e,
                                dest,
                                doc,
                                cancel(setDefault = false) {
                                    if (setDefault) {
                                        strategy[errcode] = Ondup.Skip
                                    }

                                    resolve()
                                },
                                break() {
                                    reject(false)
                                }
                            }
                        )
                    })

                    return strategy
            }
        }
    }
}