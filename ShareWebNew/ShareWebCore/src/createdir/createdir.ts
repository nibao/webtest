import { eventFactory } from '../event/event'
import { create, getSuggestName } from '../apis/efshttp/dir/dir'
import * as fs from '../filesystem/filesystem'
import { ErrorCode } from '../apis/openapi/errorcode'

export enum Ondup {
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
    GetNewName,

    /**
     * 新建文件夹成功
     */
    Success,

    /**
     * 新建文件夹失败
     */
    Error,

    /**
     * 同名冲突
     */
    Ondup,

    /**
     * 取消新建文件夹
     */
    Cancel
}

export const { trigger, subscribe } = eventFactory(EventType)

/**
 * 获取新建文件夹的文件名
 * @param doc 
 */
function getNewName(dest) {
    return new Promise((resolve: (newName: string) => void, reject: (newName: string) => void) => {
        trigger(
            EventType.GetNewName,
            null,
            {
                target: dest,
                // 确定
                createDir(newName) {
                    resolve(newName)
                },
                // 取消
                cancel() {
                    reject('')
                }
            }
        )
    })
}

export async function createDir(dest: any, name: ((doc: any) => string | Promise<string>) | string | Promise<string> = getNewName) {
    try {
        dest = await (typeof dest === 'function' ? dest() : dest)

        try {
            name = await (typeof name === 'function' ? name(dest) : name)
            const newDir = await create({ docid: dest.docid, name, ondup: Ondup.Rename })

            // 新建文件夹完成之后，需要在fs中插入一条新的文件夹信息
            fs.insert(newDir)

            trigger(
                EventType.Success,
                null,
                {
                    target: dest,
                    name
                }
            )

        } catch (e) {
            if (e && e.errcode) {
                const { errcode } = e

                switch (errcode) {
                    // 相同类型的同名冲突
                    case ErrorCode.FullnameDuplicated:
                    // 不同类型的同名冲突
                    case ErrorCode.DiffTypeNameDuplicated:
                    // 没有修改权限的同名冲突
                    case ErrorCode.NameDuplicatedReadonly:
                        const { name: suggestName } = await getSuggestName({ docid: dest.docid, name })

                        return new Promise(resolve => {
                            trigger(
                                EventType.Ondup,
                                () => resolve(),
                                {
                                    errcode,
                                    nativeEvent: e,
                                    target: dest,
                                    suggestName,
                                    // 使用推荐的名字新建
                                    createWithSuggestName() {
                                        resolve(createDir(dest, suggestName))
                                    },
                                    // 合并
                                    createWithOverWrite() {
                                        resolve(createDir(dest, name))
                                    },
                                    // 取消
                                    cancel() {
                                        resolve()
                                    }
                                }
                            )
                        })

                    default:
                        return new Promise(resolve => {
                            trigger(
                                EventType.Error,
                                () => resolve(),
                                {
                                    errcode,
                                    nativeEvent: e,
                                    target: dest,
                                    cancel() {
                                        resolve()
                                    }
                                }
                            )
                        })
                }
            }
        }
    } catch (e) {

    }
}