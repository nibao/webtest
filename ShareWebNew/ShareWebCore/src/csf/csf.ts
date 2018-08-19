import { pairs, map } from 'lodash'
import { ErrorCode } from '../apis/openapi/errorcode'
import { getErrorMessage } from '../errcode/errcode';
import { get as getUser } from '../apis/eachttp/user/user';
import { attribute } from '../apis/efshttp/file/file';
import { getAppmetadata } from '../apis/efshttp/file/file';
import { getDocType } from '../apis/eachttp/entrydoc/entrydoc';
import { isDir } from '../docs/docs'
import { getConfig } from '../config/config';
import __ from './locale'

export enum CsfStatus {
    None,

    /**
     * 没有所有者权限
     */
    NoOwnerPerm,

    /**
     * 选中多个文档库
     */
    SelectMultiLibraries,

    /**
     * 加载中
     */
    Loading,

    /**
     * '您的操作已提交审核，可在“权限申请”中查看。'
     */
    Approval,

    /**
     * 事前检查完毕，成功通过检查
     */
    OK
}

/**
 * "文件密级"右侧的按钮点击状态
 */
export enum CSFBtnStatus {
    /**
     * 未点击状态
     */
    None,

    /**
     * 点击了”密级设置“按钮
     */
    CsfEditor,

    /**
     * 点击了“密级详情”按钮
     */
    CsfDetails
}

/**
 * 查询用户对某个文件的密级是否足够
 */
export function checkCsfLevel(docid: string): PromiseLike<boolean> {
    return Promise.all([getUser({}), attribute({ docid })]).then(([userinfo, docinfo]) => userinfo.csflevel >= docinfo.csflevel);
}

/**
 * 标密系统ID
 */
export const CSFSYSID = {
    // 时代亿信
    SDYX: '7270a9fb-ce86-400f-8c0c-7d48b5790b1b',
    // 706所
    706: '04d468ec-972c-4c90-adfc-e7651de139d8',
    // AS
    ANYSHARE: 'b937b8e3-169c-4bee-85c5-865b03d8c29a'
}

/**
 * 判断文件是否未定密
 * @param doc 
 */
export function checkCsfIsNull(doc) {
    return getConfig('third_csfsys_config').then(csf => {
        // 对接中编办或者8511
        if (csf && (csf.id === CSFSYSID.SDYX || csf.id === CSFSYSID['706'])) {
            return getAppmetadata({ docid: doc.docid, appid: csf.id }).then(res => {
                if (!res || !res[0]) {
                    return false
                }
                if (JSON.parse(res[0].appmetadata).classification_info) {
                    return false
                } else {
                    return true
                }
            });
        } else {
            return false
        }

    })
}

export function isSingleFile(docs: Core.Docs.Docs): {
    fileSelNum: number,
    dirSelNum: number
} {
    let dirSelNum = 0;
    let fileSelNum = 0;
    docs.map((doc) => {
        isDir(doc) ? dirSelNum++ : fileSelNum++;
    })

    return {
        fileSelNum,
        dirSelNum
    }
}

/**
 * 获取密级Dialog标题(密级设置弹窗使用)
 */
export function getCsfTip(docs: Core.Docs.Docs) {
    const { fileSelNum, dirSelNum } = isSingleFile(docs)

    if (dirSelNum) {
        if (fileSelNum) {
            return __('您已选中了多个文件和文件夹，请设置这些文件及文件夹下所有子文件的密级。');
        } else {
            return (dirSelNum === 1) ? __('您已选中了一个文件夹，请设置该文件夹下所有子文件的密级。') : __('您已选中了多个文件夹，请设置这些文件夹下所有子文件的密级。');
        }
    } else {
        return (fileSelNum === 1) ? __('您已选中了一个文件，请设置该文件的密级。') : __('您已选中了多个文件，请设置这些文件的密级。');
    }

}

/**
 * 系统密级从低到高排序
 */
function sortSecu(obj): ReadonlyArray<string> {
    return pairs(obj).sort(function (a, b) {
        return a[1] - b[1];
    }).map(([text,]) => {
        return text
    })
}

/**
 * 获取密级枚举信息
 */

export async function getCsfLevels(): Promise<ReadonlyArray<string>> {
    return sortSecu(await getConfig('csf_level_enum'))
}

/**
 * 根据用户密级构建可选择的密级数组
 * @param userCsflevel 用户密级
 */
export async function buildCsfarray(userCsflevel): Promise<ReadonlyArray<{ level: number, text: string }>> {
    let arr = map((await getCsfLevels()).slice(0, userCsflevel - 4), (item, index) => {
        return {
            level: index + 5,
            text: item
        }
    })
    arr.unshift({ level: 0, text: '---' });

    return arr;
}

/**
 * 
 */
export function getCSFErrorMessage(errCode: number) {
    switch (errCode) {
        case CsfStatus.NoOwnerPerm:
            return __('您不是选中文件/文件夹的所有者，无法进行密级设置。')

        case CsfStatus.SelectMultiLibraries:
            return __('不支持选中多个文档库操作。')

        case ErrorCode.GNSInaccessible:
            return __('文件或文件夹不存在, 可能其所在路径发生变更。')

        default:
            return getErrorMessage(errCode)
    }
}

/**
 * 检查是否选中多个文档库
 * @returns false-没有选中多个文档库；true--选中多个文档库
 */
export async function hasMultiLibraries(docs: Core.Docs.Docs): Promise<boolean> {
    if (docs.length > 1) {
        const [doc] = docs

        if (doc.doctype) {
            return doc.doctype === 'customdoc'
        } else {
            // doc对象上没有doctype属性，调用接口获取（pc侧边栏适用）
            const { doctype } = await getDocType({ docid: doc.docid })

            return doctype === 'customdoc'
        }
    } else {
        return false;
    }
}