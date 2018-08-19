import { eventFactory } from '../event/event'
import { getDirLockInfo, getLockInfo } from '../apis/eachttp/autolock/autolock'
import { getSuggestName as getSuggestNameDir, move as moveDir } from '../apis/efshttp/dir/dir'
import { move as moveFile, getSuggestName as getSuggestNameFile } from '../apis/efshttp/file/file'
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

/**
 * 移动子文件被锁定的文件夹，选择
 */
export enum OnLock {
    /**
     * 查询
     */
    Query,

    /**
     * 移动
     */
    Move,

    /**
     * 取消
     */
    Cancel
}

export enum EventType {
    /**
     * 获取移动的目标地址
     */
    GetDest,

    /**
     * 移动成功
     */
    Success,

    /**
     * 移动失败
     */
    Error,

    /**
     * 移动的同名冲突
     */
    Ondup,

    /**
     * 取消移动
     */
    Cancel
}

export const { trigger, subscribe } = eventFactory(EventType)

// 文件夹下的某个子文件被锁定
export const DirLocked = 10

/**
 * 策略
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
    [ErrorCode.PathInvalid]: false,
    [ErrorCode.CSFLevelMismatch]: false,
    [ErrorCode.DeleteOutboxDisabled]: false,
    [ErrorCode.MoveToWatermarkLibraryDisabled]: false,
    [ErrorCode.SourceDocLocked]: false,
    [ErrorCode.AccountFrozen]: false,
    [ErrorCode.DocumentFrozen]: false,
    [DirLocked]: false
}

/**
 * 获取移动到的目标地址
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
                moveTo(dest) {
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
 * 移动
 * @param docs 被移动的文件数组
 * @param dest 移动到的目标路径
 */
export async function move(docs: (() => Core.Docs.Docs | Core.Docs.Doc) | Core.Docs.Doc | Core.Docs.Docs, dest: ((doc: Core.Docs.Doc) => Core.Docs.Doc | Promise<Core.Docs.Doc>) | Core.Docs.Doc | Promise<Core.Docs.Doc> = getDest) {
    try {
        docs = await (typeof docs === 'function' ? docs() : docs)

        if (!Array.isArray(docs)) {
            docs = [docs]
        }

        dest = await (typeof dest === 'function' ? dest(docs[0]) : dest)

        if (dest) {
            let strategy = { ...DefaultStrategy }

            for (const doc of docs) {
                await moveTo(doc, dest, strategy)
            }
        }
    } catch (e) {
    }
}



/**
 * 单个移动操作
 * @param doc 单个文件
 * @param dest 
 */
async function moveTo(doc: Core.Docs.Doc, dest: Core.Docs.Doc, strategy) {
    try {
        // 如果是文件夹且doc.onLock为查询，检测一下是否有子文件被锁定
        if (isDir(doc) && !doc.onLock) {

            const { islocked } = await getDirLockInfo({ docid: doc.docid })
            if (islocked) {
                throw { errcode: DirLocked }
            }
        }

        const newDoc = isDir(doc) ?
            await moveDir({ docid: doc.docid, destparent: dest.docid, ondup: Ondup.Rename })
            :
            await moveFile({ docid: doc.docid, destparent: dest.docid, ondup: Ondup.Rename })

        // 移动完成之后，需要在fs中删除原先的doc，并插入一条新的文件信息
        if (!isDir(doc) || !newDoc.isdirexist) {
            // 移动文件夹成功之后，文件夹不存在（有一种特殊的情况，当文件夹下的某些文件被锁定，移动文件夹成功之后，当前文件夹还在）
            fs.del(doc)
        }

        fs.insert({ ...doc, ...newDoc })

        trigger(
            EventType.Success,
            null,
            {
                dest,
                newDoc
            }
        )
    } catch (e) {
        if (e && e.errcode) {
            const { errcode } = e

            switch (errcode) {
                // 文件夹下有被锁定的子文件
                case DirLocked:
                    switch (strategy[DirLocked]) {
                        // 取消移动文件夹
                        case OnLock.Cancel:
                            return

                        // 继续移动文件夹
                        case OnLock.Move:
                            await moveTo({ ...doc, onLock: OnLock.Move }, dest, strategy)
                            return

                        // 查询
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
                                        strategy,
                                        move(setDefault = false) {
                                            if (setDefault) {
                                                strategy[errcode] = OnLock.Move
                                            }

                                            resolve(moveTo({ ...doc, onLock: OnLock.Move }, dest, strategy))
                                        },
                                        cancel(setDefault = false) {
                                            if (setDefault) {
                                                strategy[errcode] = OnLock.Cancel
                                            }

                                            resolve()
                                        },
                                        break() {
                                            reject(false)
                                        }
                                    }
                                )
                            })

                    }

                    break

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
                                moveWithSuggestName() {
                                    resolve(moveTo(doc, dest, strategy))
                                },
                                // 覆盖
                                cover() {
                                    resolve(moveTo(doc, dest, strategy))
                                },
                                // 取消
                                cancel() {
                                    resolve()
                                }
                            }
                        )
                    })

                    break

                default:

                    if (strategy[errcode] === Ondup.Skip) {
                        return
                    }

                    let locker
                    if (errcode === ErrorCode.SourceDocLocked) {
                        // 源文件被锁定，获取锁定者信息
                        const { lockername } = await getLockInfo({ docid: doc.docid })
                        locker = lockername
                    }

                    await new Promise((resolve, reject) => {
                        trigger(
                            EventType.Error,
                            () => resolve(),
                            {
                                errcode,
                                nativeEvent: e,
                                dest,
                                doc,
                                locker,
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
            }
        }
    }
}