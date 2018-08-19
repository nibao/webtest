import { formatTime } from '../../util/formatters/formatters'
import { manageLog, Level, ManagementOps } from '../log/log';
import { EVFS } from '../thrift/thrift';
import __ from './locale'

/**
 * 在文件名后增加时间的后缀
 * text.doc ->  text201705281011.doc
 */
function formatterName(name: string, time: number): string {
    const [yy, MM, ddAndRemain] = formatTime(time / 1000, 'yyyy-MM-dd HH:mm').split('-')
    const [dd, hhAndRemain] = ddAndRemain.split(' ')
    const [HH, mm] = hhAndRemain.split(':')

    const index = name.lastIndexOf('.')
    if (index !== -1) {
        // 文件名包含'.'
        return name.substring(0, index) + `${yy}${MM}${dd}${HH}${mm}` + name.substring(index, name.length)
    }
    // 文件名不包含'.'
    return name + `${yy}${MM}${dd}${HH}${mm}`
}

/**
 * 记录日志
 */
function log({name, modified, path, retained, prefix}: {
    name: string, modified: number, path: string, retained: boolean, prefix: string
}): any {
    return manageLog(
        ManagementOps.DOWNLOAD,
        __('下载文件“${name}”', { name }),
        __('修改时间：${time}，所在位置：${location}',
            {
                time: formatTime(modified / 1000, 'yyyy-MM-dd HH:mm'),
                location: retained
                    ? __('系统回收区(原位置:') + prefix + path + ')'
                    : prefix + path
            }),
        Level.INFO
    );
}

/**
 * 下载文件
 */
export async function downloadFile(
    {
        docId,
        rev,
        name,
        prefix,
        useHttps,
        reqHost,
        modifiedTime,
        path,
        retained
    }: {
            docId: string,
            rev: string,
            name: string,
            prefix: string,
            useHttps: boolean,
            reqHost: string,
            modifiedTime: number,
            path: string,
            retained: boolean
        }
) {

    const {auth_request, modified} = await EVFS('OSDownload', [
        docId,
        rev,
        'QUERY_STRING',
        reqHost,
        useHttps,
        formatterName(name, modifiedTime)
    ])
    log({ name, modified, path, retained, prefix }).then(() => {
        window.location.assign(auth_request[1])
    })
}