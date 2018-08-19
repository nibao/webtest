import * as WebUploader from 'webuploader'
import { assign, merge } from 'lodash'
import { getOpenAPIConfig } from '../openapi/openapi'
import { useHTTPS } from '../../util/browser/browser'
import { getSuggestName as getFileSuggestName, OSBeginUpload as beginFileUpload, OSEndUpload as endFileUpload } from '../apis/efshttp/file/file'
import { OSBeginUpload as beginLinkUpload, OSEndUpload as endLinkUpload } from '../apis/efshttp/link/link'
import { create as createDir, getSuggestName as getDirSuggestName } from '../apis/efshttp/dir/dir'
import { bindEvent } from '../../util/browser/browser'
import { eventFactory } from '../event/event'
import * as fs from '../filesystem/filesystem'

/**
 * 上传大小限制
 */
let FILE_SIZE_LIMIT = Infinity

/**
 * 上传错误类型
 */
export enum ErrorCode {
    ExceedSizeLimit = -1,           // 文件大小超出限制
    IllegalName = -2,               // 文件名不合法
    LinkAuthFailed = 401002,        // 外链密码不正确
    NoSpace = 403001,               // 配额空间不足
    NoCreatePermission = 403002,    // 没有新建权限
    FileLocked = 403031,            // 文件被锁定
    SameTypeDup = 403039,           // 相同类型的同名冲突
    SameNameNoPerm = 403040,        // 没有修改权限的同名冲突
    DiffTypeDup = 403041,           // 不同类型的同名冲突
    LowerCSFLevel = 403065,         // 用户密级不足
    LargeFileLimit = 403070,        // 网络受到限制
    NoStorage = 403104,             // 存储空间不足
    ArchiveCover = 403125,          // 归档库不允许覆盖
    UserFreezed = 403171,           // 用户已冻结
    DocFreezed = 403172,            // 文档已被冻结
    FileTypeLimited = 403181,       // 文件上传失败
    FileNotExist = 404006,          // 文件不存在
    LinkNotExist = 404008,          // 外链不存在
    SiteRemoved = 404017            // 站点被移除或者站点离线
}

/**
 * 上传事件类型
 */
export enum EventType {
    /** 运行环境错误 */
    UPLOAD_RUNTIME_ERROR,

    /** 解析上传目录开始 */
    UPLOAD_PAESR_DIR_START,

    /** 解析上传目录结束 */
    UPLOAD_PAESR_DIR_END,

    /** 文件加入上传队列 */
    UPLOAD_FILE_QUEUED,

    /** 多个文件加入上传队列 */
    UPLOAD_FILES_QUEUED,

    /** 文件移出上传队列 */
    UPLOAD_FILE_DEQUEUED,

    /** 文件取消上传 */
    UPLOAD_FILE_CANCELED,

    /** 开始上传 */
    UPLOAD_START,

    /** 停止上传 */
    UPLOAD_STOP,

    /** 上传发请求之前 */
    UPLOAD_BEFORE_SEND,

    /** 发送上传请求 */
    UPLOAD_ACCEPT,

    /** 上传进度 */
    UPLOAD_PROGRESS,

    /** 上传成功 */
    UPLOAD_SUCCESS,

    /** 上传完成 成功，失败都会触发 */
    UPLOAD_COMPLETE,

    /** 全部上传完成 */
    UPLOAD_FINISHED,

    /** 重置上传 */
    UPLOAD_RESET,

    /** 上传同名冲突 */
    UPLOAD_DUP,

    /** 上传出错 */
    UPLOAD_ERROR,
}

export const { subscribe, trigger } = eventFactory(EventType)

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

/**
 * 默认文件夹错误处理策略
 */
const DefaultDirStrategy = {
    [ErrorCode.DiffTypeDup]: OnDup.Check,
    [ErrorCode.SameNameNoPerm]: OnDup.Check,
    [ErrorCode.SameTypeDup]: OnDup.Check,
    [ErrorCode.NoSpace]: false,
    [ErrorCode.FileNotExist]: false,
    [ErrorCode.NoCreatePermission]: false,
    [ErrorCode.IllegalName]: false,
    [ErrorCode.UserFreezed]: false,
    [ErrorCode.DocFreezed]: false,
    [ErrorCode.SiteRemoved]: false
}

/**
 * 默认文件错误处理策略
 */
const DefaultFileStrategy = {
    [ErrorCode.DiffTypeDup]: OnDup.Check,
    [ErrorCode.SameNameNoPerm]: OnDup.Check,
    [ErrorCode.SameTypeDup]: OnDup.Check,
    [ErrorCode.NoSpace]: false,
    [ErrorCode.FileNotExist]: false,
    [ErrorCode.NoCreatePermission]: false,
    [ErrorCode.ArchiveCover]: false,
    [ErrorCode.NoStorage]: false,
    [ErrorCode.FileLocked]: false,
    [ErrorCode.LargeFileLimit]: false,
    [ErrorCode.LinkNotExist]: false,
    [ErrorCode.LowerCSFLevel]: false,
    [ErrorCode.ExceedSizeLimit]: false,
    [ErrorCode.IllegalName]: false,
    [ErrorCode.UserFreezed]: false,
    [ErrorCode.DocFreezed]: false,
    [ErrorCode.SiteRemoved]: false,
    [ErrorCode.FileTypeLimited]: false
}

/**
 * 文件状态
 */
export const FileStatus = {
    Inited: 'inited',
    Queued: 'queued',
    Progress: 'progress',
    Completed: 'complete',
    Error: 'error',
    Interrupt: 'interrupt',
    Invalid: 'invalid',
    Cancelled: 'cancelled'
}

/**
 * 用于 upload reset，创建文件夹时判断，如果已 reset， 
 * 跳过所有文件，并且文件不会加入上传队列
 * @todo 构建文件夹上传任务，任务完成后，创建后续文件
 * 及子文件夹，创建失败通过标记决定跳过当前文件夹或后续
 * 所有文件夹。文件上传依赖所在的文件夹上传任务，文件夹
 * 上传成功再执行文件上传。以实现文件夹创建过程的开始、
 * 暂停操作
 */
let reseting = false

/**
 * 创建文件夹
 * @param dir 
 */
async function uploadCreateDir(dir) {
    const { suggestName, name, dest, strategy } = dir
    if (reseting) {
        throw true
    }
    try {
        if (/\.$/.test(suggestName || name) || !/^[^\\\/:*?"<>|]{0,244}$/.test(suggestName || name)) {
            throw { errcode: ErrorCode.IllegalName }
        }
        const attrs = await createDir({ docid: dest.docid, name: suggestName || name, ondup: dir.ondup })
        const { link, password, perm, usrdisplayname, usrloginname } = dest
        return fs.insert(merge({ link, password, perm, usrdisplayname, usrloginname }, { name: suggestName || name, size: -1, ...attrs }))
    } catch (e) {
        switch (e.errcode) {
            case ErrorCode.DiffTypeDup:
            case ErrorCode.SameTypeDup:
            case ErrorCode.SameNameNoPerm:
                switch (strategy[e.errcode]) {
                    case OnDup.Skip:
                        dir.ondup = OnDup.Skip
                        throw false
                    case OnDup.Cover:
                        dir.ondup = OnDup.Cover
                        return await uploadCreateDir(dir)
                    case OnDup.Rename:
                        dir.suggestName = (await getDirSuggestName({ docid: dest.docid, name })).name
                        return await uploadCreateDir(dir)
                    default:
                        const { name: suggestName } = (await getDirSuggestName({ docid: dest.docid, name }))
                        await new Promise((resolve, reject) => {
                            const target = dir
                            trigger(
                                EventType.UPLOAD_DUP,
                                () => reject(false),
                                {
                                    target,
                                    dest: target.dest,
                                    errcode: e.errcode,
                                    nativeEvent: e,
                                    suggestName,
                                    uploadWithSuggestName(setDefault = false) {
                                        target.suggestName = suggestName
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Rename
                                        }
                                        resolve()
                                    },
                                    rename(name) {
                                        if (name && typeof name === 'string') {
                                            target.suggestName = name
                                        } else {
                                            target.suggestName = suggestName
                                        }
                                        resolve()
                                    },
                                    cover(setDefault = false) {
                                        target.ondup = OnDup.Cover
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Cover
                                        }
                                        resolve()
                                    },
                                    skip(setDefault = false) {
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Skip
                                        }
                                        reject(false)
                                    },
                                    break() {
                                        reject(true)
                                    }
                                }
                            )
                        })
                        return await uploadCreateDir(dir)
                }
            case ErrorCode.IllegalName:
            case ErrorCode.FileNotExist:
            case ErrorCode.NoCreatePermission:
            case ErrorCode.NoSpace:
            case ErrorCode.UserFreezed:
            case ErrorCode.DocFreezed:
            case ErrorCode.SiteRemoved:
                await new Promise((resolve, reject) => {
                    const target = dir
                    trigger(
                        EventType.UPLOAD_ERROR,
                        () => reject(false),
                        {
                            target,
                            dest: target.dest,
                            errcode: e.errcode,
                            nativeEvent: e,
                            skip(setDefault) {
                                if (setDefault) {
                                    strategy[e.errcode] = true
                                }
                                reject(false)
                            },
                            break() {
                                reject(true)
                            }
                        }
                    )
                })
                break
            default:
                throw true
        }
    }
}

/**
 * 获取上传信息
 */
async function getAuthRequest(file) {
    const { dest, strategy } = file
    try {
        /** 文件名不合法 */
        if (!/^[^\\\/:*?"<>|]{0,244}$/.test(file.suggestName || file.name)) {
            throw { errcode: ErrorCode.IllegalName }
        }

        /** 文件大小超出限制 */
        if (file.size > FILE_SIZE_LIMIT) {
            throw { errcode: ErrorCode.ExceedSizeLimit, fileSizeLimit: FILE_SIZE_LIMIT }
        }

        const { link, password, perm, usrdisplayname, usrloginname } = dest
        const [, reqhost] = getOpenAPIConfig('host').match(/^https?:\/\/(.+)$/)

        const { docid, rev, name, authrequest } = link ?
            await beginLinkUpload({
                usehttps: useHTTPS(),
                reqmethod: 'POST',
                reqhost,
                link,
                password,
                name: file.suggestName || file.name,
                docid: dest.docid,
                ondup: file.ondup,
                length: file.size,
                client_mtime: Date.parse(file.lastModifiedDate) * 1000
            }) :
            await beginFileUpload({
                usehttps: useHTTPS(),
                reqmethod: 'POST',
                reqhost,
                name: file.suggestName || file.name,
                docid: dest.docid,
                ondup: file.ondup,
                length: file.size,
                client_mtime: Date.parse(file.lastModifiedDate) * 1000
            })

        /**
        * 将目标目录的外链属性, beginupload返回的 docid, rev, name 合并给文件
        */
        merge(file, { link, password, perm, usrdisplayname, usrloginname, docid, rev, name })
        return authrequest
    } catch (e) {
        switch (e.errcode) {
            case ErrorCode.DiffTypeDup:
            case ErrorCode.SameTypeDup:
            case ErrorCode.SameNameNoPerm:
                switch (strategy[e.errcode]) {
                    case OnDup.Skip:
                        file.ondup = OnDup.Skip
                        throw false
                    case OnDup.Cover:
                        file.ondup = OnDup.Cover
                        return await getAuthRequest(file)
                    case OnDup.Rename:
                        if (!dest.link) {
                            file.suggestName = (await getFileSuggestName({ docid: dest.docid, name: file.name })).name
                        }
                        return await getAuthRequest(file)
                    default:
                        /**
                         * 外链文件不允许重命名上传
                         * 非外链上传，获取文件建议名称并上传
                         */
                        const suggestName = dest.link ? '' : (await getFileSuggestName({ docid: dest.docid, name: file.name })).name
                        await new Promise((resolve, reject) => {
                            const target = file
                            trigger(
                                EventType.UPLOAD_DUP,
                                () => reject(false),
                                {
                                    target,
                                    dest: target.dest,
                                    errcode: e.errcode,
                                    nativeEvent: e,
                                    suggestName,
                                    uploadWithSuggestName(setDefault = false) {
                                        target.suggestName = suggestName
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Rename
                                        }
                                        resolve()
                                    },
                                    rename(name) {
                                        if (name && typeof name === 'string') {
                                            target.suggestName = name
                                        } else {
                                            target.suggestName = suggestName
                                        }
                                        resolve()
                                    },
                                    cover(setDefault = false) {
                                        target.ondup = OnDup.Cover
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Cover
                                        }
                                        resolve()
                                    },
                                    skip(setDefault = false) {
                                        if (setDefault) {
                                            strategy[e.errcode] = OnDup.Skip
                                        }
                                        reject(false)
                                    },
                                    break() {
                                        reject(true)
                                    }
                                }
                            )
                        })
                        return await getAuthRequest(file)
                }
            case ErrorCode.IllegalName:
            case ErrorCode.ExceedSizeLimit:
            case ErrorCode.FileNotExist:
            case ErrorCode.NoCreatePermission:
            case ErrorCode.NoSpace:
            case ErrorCode.ArchiveCover:
            case ErrorCode.NoStorage:
            case ErrorCode.FileLocked:
            case ErrorCode.LargeFileLimit:
            case ErrorCode.LinkNotExist:
            case ErrorCode.LowerCSFLevel:
            case ErrorCode.UserFreezed:
            case ErrorCode.DocFreezed:
            case ErrorCode.FileTypeLimited:
            case ErrorCode.SiteRemoved:
            case ErrorCode.LinkAuthFailed:
                if (strategy[e.errcode]) {
                    throw false
                }
                await new Promise((resolve, reject) => {
                    const target = file
                    trigger(
                        EventType.UPLOAD_ERROR,
                        () => reject(false),
                        {
                            target,
                            dest: target.dest,
                            errcode: e.errcode,
                            nativeEvent: e,
                            locker: e.errcode === ErrorCode.FileLocked ?
                                (/is locked by ([^\/\\:*?\"<>|]+)[(（)]/.exec(e.causemsg) as Array<string>)[1].replace(/\s/g, '') :
                                undefined,
                            fileSizeLimit: e.fileSizeLimit || e.detail && e.detail.file_limit_size || FILE_SIZE_LIMIT,
                            skip(setDefault) {
                                if (setDefault) {
                                    strategy[e.errcode] = true
                                }
                                reject(false)
                            },
                            break() {
                                reject(true)
                            }
                        }
                    )
                })
                break
            default:
                throw true
        }
    }
}

/**
 * 结束上传
 * @param file 
 */
async function endUpload(file) {
    try {
        const { link, docid, rev, csflevel = 0, ondup } = file
        const { editor, modified } = link ?
            await endLinkUpload({
                docid,
                rev,
                link
            }) :
            await endFileUpload({
                docid,
                rev,
                csflevel
            })
        assign(file, ondup === OnDup.Cover ?
            {
                editor,
                modified,
                client_mtime: Date.parse(file.lastModifiedDate) * 1000
            } :
            {
                editor,
                modified,
                creator: editor,
                create_time: modified,
                client_mtime: Date.parse(file.lastModifiedDate) * 1000
            })
    } catch (e) {
        throw e
    }
}

WebUploader.Uploader.register(
    {
        // 给定name，以再其他使用WebUploader的地方通过disableWidgets: ['fileupload']禁用掉，避免影响其他上传功能
        'name': 'fileupload',
        'before-send': 'beforeSend',
        'after-send-file': 'afterSendFile'
    },
    {
        /**
         * before-send Hook
         * 上传前检查文件冲突,获取oss参数
         */
        beforeSend(block) {
            /**
             * WebUpload 内置 Promise
             */
            const deferred = WebUploader.Base.Deferred()
            const { file } = block
            const uploader = this.owner
            getAuthRequest(file).then(authrequest => {
                assign(block, { authrequest })
                deferred.resolve()
            }, breakUpload => {
                file.setStatus(FileStatus.Error)
                const fileStrategy = { ...DefaultFileStrategy }
                assign(file, {
                    strategy: fileStrategy,
                    ondup: OnDup.Check
                })
                if (breakUpload) {
                    uploader.getFiles(FileStatus.Inited, FileStatus.Queued, FileStatus.Progress).forEach(file => {
                        assign(file, {
                            strategy: fileStrategy,
                            ondup: OnDup.Check
                        })
                        file.setStatus(FileStatus.Error)
                    })
                }
                deferred.resolve()
            })
            return deferred.promise()
        },
        /**
         * after-send-file Hook
         * 数据块上传完成后调用 osendupload
         */
        afterSendFile(file) {
            const deferred = WebUploader.Base.Deferred()
            endUpload(file).then(deferred.resolve, deferred.reject)
            return deferred.promise()
        }
    }
)

interface ConfigInterface {
    /**
     * Uploader.swf 文件地址
     */
    swf?: string,
    /**
     * 运行环境
     */
    runtimeOrder?: string
    /**
     * 文件上传大小限制
     */
    fileSizeLimit?: number
}

interface InitInterface {
    (config?: ConfigInterface): void
}

/**
 * 初始化上传
 */
export let init: InitInterface

let
    /**
     * 计算flash按钮位置计时器
     */
    flashPickerPosTimeoutId,
    /**
     * flash按钮节点
     */
    flashPickerNode: HTMLElement | null = null,
    /**
     * flash上传目标位置
     */
    flashUploadDest

const InitPromise = new Promise((resolve: InitInterface) => {
    init = resolve
}).then(({ swf = '', runtimeOrder = 'html5,flash', fileSizeLimit = Infinity } = {}) => {

    FILE_SIZE_LIMIT = fileSizeLimit

    /**
     * 上一次记录上传进度的事件，百分比
     * 用于计算上传速度
     */
    let lastMeasureTime, lastPercentage
    try {
        const uploader = new WebUploader.Uploader({
            threads: 1,
            duplicate: true,
            compress: false,
            swf,
            runtimeOrder,
            onBeforeFileQueued() {
                /** 
                 * flash 运行环境 且 未设置 flashUploadDest 文件不加入队列
                 */
                if (uploader.predictRuntimeType() === 'flash' && !flashUploadDest) {
                    console.error('Current upload runtime is flash, please set "flashUploadDest" correctly!')
                    return false
                }
            },
            onFileQueued(file) {
                trigger(EventType.UPLOAD_FILE_QUEUED, null, { file })
            },
            async onFilesQueued(files) {
                uploader.stop()
                const runtime = uploader.predictRuntimeType()
                /**
                 * 同时添加的一组文件公用同一个 strategy 对象，
                 * 记住默认冲突操作时更改 strategy 值， 实现记
                 * 住操作
                 */
                const strategy = { ...DefaultFileStrategy }
                files.forEach(file => {
                    assign(file, {
                        /**
                         * 文件上传目标位置
                         * html5 input 选择的文件 dest 为 file.source.dest, 
                         * 添加一个由 webuploader 按钮选择的文件， dest 为 file.source.source.dest
                         * flash上传的目标位置为 attachFlashPicker 时设置的 flashUploadDest
                         */
                        dest: runtime === 'html5' ?
                            file.dest || file.source.dest || file.source.source.dest :
                            flashUploadDest,
                        strategy,
                        /**
                         * 默认询问同名冲突
                         */
                        ondup: OnDup.Check,
                        /**
                         * 文件默认密级
                         */
                        csflevel: 0
                    })
                })
                trigger(EventType.UPLOAD_FILES_QUEUED, upload, { files })
            },
            onFileDeQueued(file) {
                trigger(EventType.UPLOAD_FILE_DEQUEUED, null, { file })
            },
            onStartUpload() {
                trigger(EventType.UPLOAD_START)
            },
            onStopUpload() {
                trigger(EventType.UPLOAD_STOP)
            },
            onUploadBeforeSend(block, data, headers) {
                /**
                 * 开始上传发送请求前将上传测量事件设为当前时间，百分比设为0
                 */
                lastMeasureTime = Date.now()
                lastPercentage = 0
                const { authrequest: [method, server, ...metas] } = block
                /**
                 * 删除 before-send hook中添加到 block 对象的 authrequest
                 */
                delete block.authrequest
                /**
                 * 对象存储参数添加到 WebUploader 的上传参数
                 */
                assign(block.transport.options, { method, server, sendAsBinary: method === 'PUT' })

                /**
                 * 设置 上传参数参数
                 */
                Object.keys(data).forEach(key => { delete data[key] })
                metas.forEach((meta: string) => {
                    let [key, value] = meta.split(': ')
                    switch (key) {
                        case 'Date': break
                        case 'x-ms-blob-type': headers[key] = value;
                        default: data[key] = value;
                    }
                })
                trigger(EventType.UPLOAD_BEFORE_SEND, null, { file: block.file })
            },
            onUploadAccept() {
                trigger(EventType.UPLOAD_ACCEPT)
            },
            onUploadProgress(file, percentage) {
                const currentTime = Date.now()
                const speed = file.size * (percentage - lastPercentage) / (currentTime - lastMeasureTime) * 1000
                trigger(
                    EventType.UPLOAD_PROGRESS,
                    null,
                    {
                        file,
                        percentage,
                        /**
                         * 上传速度偶现负数，当计算速度小于 0 时，speed 计为 0
                         */
                        speed: speed < 0 ? 0 : speed,
                        uploaded: file.size * percentage
                    }
                )
                lastMeasureTime = currentTime
                lastPercentage = percentage
            },
            onUploadSuccess(file) {
                const {
                    name, suggestName, docid, client_mtime, csflevel, editor, modified, rev, size, creator, create_time,
                    dest: { link, password, perm, usrdisplayname, usrloginname }
                } = file
                /**
                 * 上传完成将上传的文件加入 fileSystem 缓存
                 */
                file = merge(
                    { name: suggestName || name, docid, client_mtime, csflevel, editor, modified, rev, size, creator, create_time, },
                    { link, password, perm, usrdisplayname, usrloginname }
                )
                fs.insert(file)
                trigger(
                    EventType.UPLOAD_SUCCESS,
                    null,
                    { file }
                )
            },
            onUploadComplete(file) {
                trigger(EventType.UPLOAD_COMPLETE, null, { file })
            },
            onUploadFinished() {
                trigger(EventType.UPLOAD_FINISHED)
            }
        })

        /**
         * webuploader 运行环境
         */
        const runtime = uploader.predictRuntimeType() as 'html5' | 'flash'

        /**
         * flash 按钮节点
         */
        let flashNode: HTMLDivElement | null = null

        if (swf && runtime === 'flash') {

            flashNode = document.createElement('div');

            (document.querySelector('body') as HTMLBodyElement).appendChild(flashNode)

            /**
             * 用于撑开flash按钮
             */
            flashNode.innerHTML = `<div style="width:800px;height:600px;"></div>`

            /**
             * 初始化 flash 位置
             */
            const initFlashPickerPos = () => {
                flashPickerNode = null
                if (flashNode) {
                    flashNode.style.overflow = 'hidden'
                    flashNode.style.position = 'fixed'
                    flashNode.style.zIndex = '100'
                    flashNode.style.left = '100%'
                    flashNode.style.top = '100%'
                }
            }

            initFlashPickerPos()

            uploader.addButton(flashNode)

            /**
             * 鼠标移除 flash 按钮时将 flash 按钮挪回默认位置
             */
            bindEvent(
                flashNode,
                'mouseleave',
                initFlashPickerPos
            )
        }

        return { uploader, flashNode, runtime }
    } catch (e) {
        /**
         * 初始化 webuploader 出错，触发运行环境错误事件
         */
        // trigger(EventType.UPLOAD_RUNTIME_ERROR, null, e)
        // 错误在点击上传时触发
        throw e
    }
})

/**
 * 设置flash按钮位置
 */
async function setFlashPickerPos() {
    clearTimeout(flashPickerPosTimeoutId)
    const { flashNode } = await InitPromise
    if (flashPickerNode && flashNode) {
        const { top, right, bottom, left } = flashPickerNode.getBoundingClientRect()
        flashNode.style.top = `${top}px`
        flashNode.style.left = `${left}px`
        flashNode.style.width = `${right - left}px`
        flashNode.style.height = `${bottom - top}px`
        flashPickerPosTimeoutId = setTimeout(setFlashPickerPos, 100)
    }
}

/**
 * 挂载 flash 按钮
 * @param element flash 按钮依附的元素
 * @param dest flash 按钮上传的目标目录
 */
export function attachFlashPicker(element, dest) {
    flashPickerNode = element
    flashUploadDest = dest
    setFlashPickerPos()

    return function unattachFlashPicker() {
        flashPickerNode = null
    }
}

/**
 * 获取当前 runtime
 */
export const runtime = InitPromise.then(({ runtime }) => runtime)

/**
 * 读取一个文件夹所有子文件，文件夹
 * @param dirReader 
 * @param preEntries 
 */
async function readDir(dirReader, preEntries: Array<any> = []) {
    const entries = await new Promise((resolve: (value: Array<any>) => void) => {
        setTimeout(() => {
            /**
             * Direactory Reader 每次最多读取 100 个 entry 对象,
             * 多次调用 readEntries, 直到读取的 entry 数组长度为 0
             */
            dirReader.readEntries(entries => resolve(entries))
            /** 延迟 10ms，目录过多会阻塞渲染，造成浏览器卡顿 */
        }, 10)
    })
    /**
     * 如果本次读取的子 entry 数不为 0， 继续读取
     * 否则返回上一次读取的结果
     */
    if (entries.length) {
        return readDir(dirReader, [...preEntries, ...entries])
    }
    return preEntries
}

/**
 * 从 entry list 构建上传队列
 */
async function buildUploadQueueFromEntryList(entries, dest, dirStrategy) {
    const queue: Array<any> = []

    for (let entry of entries) {
        if (entry.isFile) {
            await new Promise(resolve => {
                /**
                 * 文件 push 到 queue
                 */
                entry.file(file => {
                    assign(file, { dest })
                    queue.push(file)
                    resolve()
                })
            })
        } else {
            try {
                const currentDir = await uploadCreateDir({
                    name: entry.name,
                    dest,
                    ondup: OnDup.Check,
                    strategy: dirStrategy
                })
                const subEntries = await readDir(entry.createReader())
                queue.push(...(await buildUploadQueueFromEntryList(subEntries, currentDir, dirStrategy)))
            } catch (breakAll) {
                if (breakAll) {
                    break
                }
            }
        }
    }

    return queue
}

/**
 * 从 input 选择的 fileList 构建上传队列
 * @param filelist 
 * @param dest 
 */
async function buildUploadQueueFromFileList(filelist: FileList | Array<File>, dest) {
    const
        files = Array.from(filelist),
        dirStrategy = { ...DefaultDirStrategy },
        dirCache = {},
        queue: Array<any> = []
    for (const file of files) {
        try {
            const names = file.webkitRelativePath ? file.webkitRelativePath.split('/').slice(0, -1) : []
            let dir = dest, index = 0
            try {
                for (let name of names) {
                    const path = names.slice(0, index + 1).join('/')
                    if (dirCache[path]) {
                        if (dirCache[path] === -1) {
                            /**
                             * 不上传当前目录及子目录
                             */
                            throw false
                        }
                        /**
                         * 已创建直接返回创建的目录
                         */
                        dir = dirCache[path]
                    } else {
                        /**
                         * 创建目录，并缓存已创建的路径
                         */
                        dirCache[path] = await uploadCreateDir({
                            name,
                            dest: dir,
                            ondup: OnDup.Check,
                            strategy: dirStrategy
                        })
                        dir = dirCache[path]
                    }
                    index++
                }
                assign(file, { dest: dir })
                queue.push(file)
            } catch (e) {
                /**
                 * 出错 标记当前路径，并抛出
                 */
                const path = names.slice(0, index + 1).join('/')
                dirCache[path] = -1
                throw e
            }
        } catch (breakAll) {
            if (breakAll) {
                /** 
                 * 中断后续文件上传
                 */
                break
            }
        }
    }
    return queue
}

/**
 * 用 Promise 实现多个上传队列依次执行
 */
let UploadQueuePromise = Promise.resolve(),
    parsingDir = false

/**
 * 上传 datatransfer
 * @param datatransfer 
 * @param dest 
 */
export async function uploadDataTransfer(datatransfer: DataTransfer, dest) {
    const
        entries = datatransfer.items ? Array.from(datatransfer.items, item => item.webkitGetAsEntry()) : null,
        files = datatransfer.files ? Array.from(datatransfer.files) : []

    UploadQueuePromise = UploadQueuePromise.then(async () => {

        const { uploader } = await InitPromise
        uploader.stop()
        /** 开始解析上传目录 */
        trigger(EventType.UPLOAD_PAESR_DIR_START)
        parsingDir = true

        const uploadQueue = entries ?
            await buildUploadQueueFromEntryList(entries, dest, { ...DefaultDirStrategy }) :
            await buildUploadQueueFromFileList(files, dest)

        /** 解析上传目录完成 */  /** 解析上传目录完成 */
        trigger(EventType.UPLOAD_PAESR_DIR_END)
        parsingDir = false

        if (!reseting) {
            /** 文件加入上传队列 */
            uploader.addFiles(uploadQueue)
            if (!uploader.getFiles(FileStatus.Inited, FileStatus.Queued, FileStatus.Progress).length) {
                trigger(EventType.UPLOAD_FINISHED)
            }
        }
        reseting = false
    })
}

/**
 * 上传 filelist
 * @param filelist 
 * @param dest 
 */
export async function uploadFileList(filelist: FileList, dest) {
    UploadQueuePromise = UploadQueuePromise.then(async () => {

        const { uploader } = await InitPromise
        uploader.stop()
        /** 开始解析上传目录 */
        trigger(EventType.UPLOAD_PAESR_DIR_START)
        parsingDir = true

        const uploadQueue = await buildUploadQueueFromFileList(filelist, dest)
        /** 解析上传目录完成 */
        trigger(EventType.UPLOAD_PAESR_DIR_END)
        parsingDir = false

        if (!reseting) {
            /** 文件加入上传队列 */
            uploader.addFiles(uploadQueue)
            if (!uploader.getFiles(FileStatus.Inited, FileStatus.Queued, FileStatus.Progress).length) {
                trigger(EventType.UPLOAD_FINISHED)
            }
        }
        reseting = false
    })
}

/** 
 * 获取上传文件
 */
export async function getFiles(...args) {
    const { uploader } = await InitPromise
    return uploader.getFiles(...args)
}

/**
 * 开始上传
 */
export async function upload() {
    const { uploader } = await InitPromise
    uploader.upload()
}

/**
 * 暂停上传
 */
export async function stop() {
    const { uploader } = await InitPromise
    uploader.stop()
}

/**
 * 重试文件
 */
export async function retry(file?) {
    const { uploader } = await InitPromise
    uploader.retry(file)
}

/**
 * 跳过文件
 * @param file 
 */
export async function skip(file) {
    const { uploader } = await InitPromise
    uploader.skip(file)
}

/**
 * 取消单个文件
 * @param file 
 */
export async function cancel(file) {
    const { uploader } = await InitPromise
    uploader.cancelFile(file)
    trigger(EventType.UPLOAD_FILE_CANCELED, null, { file })
}

/**
 * reset Uploader
 */
export async function reset() {
    const { uploader } = await InitPromise
    if (parsingDir) {
        reseting = true
    }
    uploader.reset()
    trigger(EventType.UPLOAD_RESET)
}