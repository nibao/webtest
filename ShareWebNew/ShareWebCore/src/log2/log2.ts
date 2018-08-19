import { createEACPLogClient, ECMSManagerClient } from '../thrift2/thrift2';
import { getUTCTime } from '../../util/date/date';
import { head } from '../../util/http/http';
import session from '../../util/session/session';
import '../../gen-js/EACPLog_types';

/**
 * 记录日志
 * @param logType 日志类别
 * @param level 日至级别
 * @param opType 操作类型
 * @param msg 内容
 * @param exMsg 附加信息
 * @param userId 用户id
 */
async function log({
    logType,
    level,
    opType,
    msg = '',
    exMsg = '',
    userId = session.get('userid')
}: {
    logType: ncTLogType;
    level: ncTLogLevel;
    opType: number;
    msg: string;
    exMsg: string;
    userId: string;
} = {}) {
    const { getResponseHeader } = await head('/meta');
    const [clientAddr, serverTime] = ['x-client-addr', 'x-server-time'].map(item => {       
        return getResponseHeader(item);
    })

    return createEACPLogClient({ip: await ECMSManagerClient.get_app_master_node_ip()}).Log(new ncTLogItem({
        userId,
        logType,
        level,
        opType,
        date: getUTCTime(serverTime) * 1000,
        ip: clientAddr,
        mac: '',
        msg: msg.trim(),
        exMsg: exMsg.trim(),
        userAgent: '',
        objId: '',
        additionalInfo: ''
    }))
}

/** 登录日志
 * @example
 * ```js
import 'gen-js/EACPLog_types';
import { loginLog } from 'log2/log2'

loginLog({ 
    level: ncTLogLevel['NCT_LL_INFO'], // EACPLog.thrift日志级别枚举值
    opType: ncTLoginType['NCT_CLT_LOGIN_IN'], // EACPLog.thrift登录日志类型枚举值
    msg = '',
    exMsg = '', 
})
 * ```
 */
export const loginLog = ({...params}) => log({...params, logType: ncTLogType['NCT_LT_LOGIN']})

// 管理日志
export const manageLog = ({...params}) => log({...params, logType: ncTLogType['NCT_LT_MANAGEMENT']})

// 操作日志
export const operationLog = ({...params}) => log({...params, logType: ncTLogType['NCT_LT_OPEARTION']})