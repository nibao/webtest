import { noop, merge } from 'lodash';
import { currify } from '../../util/currify/currify';
import { evaluate } from '../../util/accessor/accessor';
import session from '../../util/session/session';
import { post } from '../../util/http/http';

const Config = {
    CSRFToken: noop
}

/**
 * 设置Log
 */
export function setup(options) {
    merge(Config, options);
}

/**
 * 日志类型
 */
export enum LogType {
    NCT_LT_LOGIN = 10, // 登录日志
    NCT_LT_MANAGEMENT = 11, // 管理操作日志
    NCT_LT_OPEARTION = 12 // 操作日志
};


/**
 * 日至级别
 */
export enum Level {
    ALL, // 所有
    INFO, // 信息
    WARN  // 警告
};


// 登录操作
export enum LoginOps {
    ALL, // 所有操作
    LOGIN, // 登录操作
    LOGOUT, // 退出操作
    OTHER = 127 // 其它操作
};


// 管理操作
export enum ManagementOps {
    ALL, // 所有操作
    CREATE, // 新建操作
    ADD, // 添加操作
    SET, // 设置操作
    DELETE, // 删除操作
    COPY, // 复制
    MOVE, // 移动
    REMOVE, // 移除
    IMPORT, // 导入操作
    EXPORT, // 导出操作
    AUDIT_MGM, // 审核操作
    QUARANTINE, // 隔离
    UPLOAD, // 上传
    PREVIEW, // 预览
    DOWNLOAD, // 下载 
    RESTORE, // 还原
    QUARANTINE_APPEAL, // 隔离区申诉
    OTHER = 127 // 其他操作
};


// 文档操作
export enum OperationOps {
    ALL, // 所有操作
    PREVIEW, // 预览作用
    UPLOAD, // 上传
    DOWNLOAD, // 下载
    EDIT, // 修改
    RENAME, // 重名命
    DELETE, // 删除操作
    COPY, // 复制
    MOVE, // 移动
    RESTORE_FROM_RECYCLE, // 从回收站还原
    DELETE_FROM_RECYCLE, // 彻底删除，
    PERM_MGM, // 权限共享
    LINK_MGM, // 外链共享
    FINDER_MGM, // 发现共享
    BACKUP_BEGIN, // 备份恢复
    GROUPDOC_MGM, // 群组管理
    LOCK_MGM, // 文件锁
    ENTRY_DOC_MGM, // 共享管理
    DEVICE_MGM, // 登陆设备管理
    RESTORE_REV = 50, // 还原版本
    OTHER = 127 // 其它
};


/**
 * 记录日志
 * @param optype 操作类型
 * @param msg 日志信息
 * @param exmsg 附加信息
 * @param loglevel 日至级别
 * @param userid 用户id
 */
function log(logtype: string, optype: OperationOps, msg: string = '', exmsg: string = '', loglevel: Level = Level.INFO, userid: string = session.get('userid')): Promise<void> {
    return post('/api/EACPLog/Log', {
        logtype,
        optype,
        msg,
        exmsg,
        loglevel,
        userid
    }, {
            beforeSend(xhr) {
                xhr.setRequestHeader('X-CSRFToken', evaluate(Config.CSRFToken))
            }
        })
}

// 登陆日志
export const loginLog = currify(log, LogType.NCT_LT_LOGIN);

// 管理日志
export const manageLog = currify(log, LogType.NCT_LT_MANAGEMENT);

// 操作日志
export const operationLog = currify(log, LogType.NCT_LT_OPEARTION);