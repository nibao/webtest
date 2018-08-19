import { isBrowser, Browser, bindEvent } from '../../../util/browser/browser'

let AsPlugin = null


if (isBrowser({ app: Browser.MSIE })) {
    AsPlugin = document.getElementById('as-activex-plugin')
    if (!AsPlugin) {
        try {
            AsPlugin = document.createElement('object')
            AsPlugin.id = 'as-activex-plugin'
            AsPlugin.classid = 'clsid:{5CDFBCBD-0D60-4490-B42D-2A9EF1889CAF}'
            document.querySelector('head').appendChild(AsPlugin)
        } catch (e) {

        }
    }
}


// 判断支持插件上传
export const isSupported = typeof AsPlugin === 'object' && AsPlugin !== null && typeof AsPlugin.SelectFolder === 'unknown'

/**
 * 选择文件夹
 */
export const selectDir = () => {
    let dir = AsPlugin.SelectFolder()
    return dir ? JSON.parse(decodeURIComponent(dir).replace(/\"folders\"/g, '"dirs"')) : { dirs: [], files: [] }
}

/**
 * 选择文件
 */
export const selectFiles = () => {
    let files = AsPlugin.SelectFiles()
    return files ? JSON.parse(decodeURIComponent(files).replace(/\"folders\"/g, '"dirs"')) : { dirs: [], files: [] }
}

/**
 * 复制到剪切板
 * @param text 
 */
export const copyToClipboard = text => {
    AsPlugin.CopyToClipboard(text)
}

/**
 * 开始上传
 * @param param0 
 */
export const startUpload = ({ip, port, path, docid, csflevel, userid = '', tokenid = '', name = '', ondup = 3}) => {
    return AsPlugin.StartUpload(ip, port, userid, tokenid, path, docid, name, ondup, csflevel)
}

/**
 * 获取已上传文件docid
 */
export const getUploadedDocId = () => {
    return AsPlugin.GetUploadedDocId()
}

/**
 * 获取已上传大小
 */
export const getUploadedSize = () => {
    return AsPlugin.GetUploadedSize()
}

/**
 * 暂停上传
 */
export const pauseUpload = () => {
    AsPlugin.PauseUpload()
}

/**
 * 恢复上传
 */
export const resumeUpload = () => {
    AsPlugin.ResumeUpload()
}

/**
 * 取消上传
 */
export const cancelUpload = () => {
    AsPlugin.CancelUpload()
}

/**
 * 上传状态
 * -1 错误
 * -2 完成
 */
export enum UploadStatus {
    Error = -1,
    Complete = -2
}