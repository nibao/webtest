import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 检查本地同步目录
 */
export const checkLocalSync: Core.APIs.Client.Doc.CheckLocalSync = function ({ localPath, syncPath }) {
    return clientAPI('doc', 'CheckLocalSync', { localPath, syncPath })
}

/**
 *获取未同步文档
 */
export const getUnsyncDoc: Core.APIs.Client.Doc.GetUnsyncDoc = function ({ absPath }) {
    return clientAPI('doc', 'GetUnsyncDoc', { absPath })
}

/**
 * 是否是新视图模式
 */
export const isNewView: Core.APIs.Client.Doc.IsNewView = function ({ } = {}) {
    return clientAPI('doc', 'IsNewView', {})
}