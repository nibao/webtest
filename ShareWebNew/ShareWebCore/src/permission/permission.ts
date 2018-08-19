/// <reference path="./permission.d.ts" />

import { sum, omit, isUndefined, pick } from 'lodash';
import { currify } from '../../util/currify/currify';
import { bitSum, bitSub, bitTest } from '../../util/accessor/accessor';
import { today } from '../../util/date/date'
import { get as getOwnerInfos, check as checkOwner } from '../apis/eachttp/owner/owner';
import { get as getPermInfos, getInternalLinkTemplate, getExternalLinkTemplate, check, getShareDocConfig } from '../apis/eachttp/perm/perm';
import { getConfig } from '../config/config';
import { getDocType } from '../apis/eachttp/entrydoc/entrydoc';
import { getErrorMessage } from '../errcode/errcode';
import { CSFSYSID } from '../csf/csf';
import { checkPerm } from '../apis/efshttp/link/link'
import { isDir, docname } from '../docs/docs'
import { ErrorCode } from '../apis/openapi/errorcode'
import { attribute as getDocAttribute } from '../apis/efshttp/file/file';
import { getOpenAPIConfig } from '../openapi/openapi';
import { isInEntry } from '../entrydoc/entrydoc';
import __ from './locale';

/**
 * 错误码
 */
export enum Status {
    Normal,                    // 正常状态
    FileNotExisted = 404006,   // 文件或文件夹不存在
    LowCsf = 403066,            // 指定的用户密级低于文件的密级
    OutOfPermission = 403146,  // 超出内链模板可设定最大权限  
    OutOfEndTime = 403147,     // 超过内链模板可设定最大有效期 
    SecretNoPermanent = 403152, // 涉密模式下不允许永久有效
    FreezedUser = 403171,       // 用户被冻结
    FreezedDoc = 403172,        // 该文档被冻结
    NoCsf = 10,                 // 文件未定密，不允许权限配置
    NotOwner = 11,               // 非所有者，不允许权限配置
    UserRealName = 403179,      // 用户未实名认证
    CreatorRealName = 403180,    // 创建者未实名认证
    ShareBeAudited = 12,         // 共享已提交审核
}

/**
 * 权限选项
 */
interface PermissionOption {
    value: number; // 权限值

    require?: number; // 依赖值
}

/**
 * 权限组合
 */
interface PermConfig {
    isowner?: boolean; // 是否是所有者

    allow?: number; // 允许权限

    deny?: number; // 拒绝权限

}

/**
 * 设置的权限属于哪种情况
 */
export enum ShareType {
    ALLOW,
    DENY,
    OWNER
}

export const enum AccessorType {
    USER,
    DEPARTMENT,
    CONTACTOR
}

export const accessorType = {
    [AccessorType.USER]: 'user',
    [AccessorType.DEPARTMENT]: 'department',
    [AccessorType.CONTACTOR]: 'contactor'
}

// 内链权限
export enum SharePermission {
    // 显示
    DISPLAY = 1,

    // 预览
    PREVIEW = 2,

    // 下载
    DOWNLOAD = 4,

    // 新建
    CREATE = 8,

    // 修改
    MODIFY = 16,

    // 删除
    DELETE = 32,

    // 复制
    COPY = 64
}

// 外链权限
export enum LinkSharePermission {
    // 预览
    PREVIEW = 1,

    // 下载
    DOWNLOAD = 2,

    // 上传
    UPLOAD = 4,
}

/**
 * 权限检查结果
 */
export enum PermCheckResult {
    OK,

    UNSET,

    REJECTED
}

/**
 * 检查是否有某项配置权限
 * @param docid 要检查的文档对象的docid
 * @param perm 要检查的权限
 * @param userid 要检查的用户的userid，默认为当前登录用户
 */
export async function checkPermItem(docid: string, perm: SharePermission, userid: string = getOpenAPIConfig('userid')): Promise<boolean> {
    const { result } = await check({ docid, perm, userid })

    return result === PermCheckResult.OK
}

/**
 * 检查外链权限
 */
export function checkLinkPerm({ link, password, perm }) {
    return checkPerm({ link, password, perm }).then(({ result }) => result)
}


/**
 * 原子权限
 */
export const SharePermissionOptions: Array<PermissionOption> = [
    {
        value: SharePermission.DISPLAY,
        require: 0
    },
    {
        value: SharePermission.PREVIEW,
        require: bitSum(SharePermission.DISPLAY)
    },
    {
        value: SharePermission.DOWNLOAD,
        require: bitSum(SharePermission.DISPLAY, SharePermission.PREVIEW)
    },
    {
        value: SharePermission.COPY,
        require: bitSum(SharePermission.DISPLAY, SharePermission.PREVIEW, SharePermission.DOWNLOAD)
    },
    {
        value: SharePermission.MODIFY,
        require: bitSum(SharePermission.DISPLAY, SharePermission.PREVIEW, SharePermission.DOWNLOAD)
    },
    {
        value: SharePermission.CREATE,
        require: bitSum(SharePermission.DISPLAY)
    },
    {
        value: SharePermission.DELETE,
        require: bitSum(SharePermission.DISPLAY)
    }
];

/**
 * 外链原子权限
 */
export const LinkSharePermissionOptions: Array<PermissionOption> = [
    {
        value: LinkSharePermission.PREVIEW,
        require: 0
    },
    {
        value: LinkSharePermission.DOWNLOAD,
        require: bitSum(LinkSharePermission.PREVIEW)
    },
    {
        value: LinkSharePermission.UPLOAD,
        require: 0
    },
]

/**
 * 获取权限对应的text
 */
function getPermissionText(permissionOptions: Array<any>, value: number): string {
    if (permissionOptions === SharePermissionOptions) {
        // 内链
        switch (value) {
            case SharePermission.DISPLAY:
                return __('显示')
            case SharePermission.PREVIEW:
                return __('预览')
            case SharePermission.DOWNLOAD:
                return __('下载')
            case SharePermission.COPY:
                return __('复制')
            case SharePermission.MODIFY:
                return __('修改')
            case SharePermission.CREATE:
                return __('新建')
            case SharePermission.DELETE:
                return __('删除')
        }
    } else {
        // 外链
        switch (value) {
            case LinkSharePermission.PREVIEW:
                return __('预览')
            case LinkSharePermission.DOWNLOAD:
                return __('下载')
            case LinkSharePermission.UPLOAD:
                return __('上传')
        }
    }
}

/**
 * 最大允许权限值
 */
export const MAX_PERM_VALUE = sum(SharePermissionOptions, function (permission) {
    return permission.value
});


/**
 * 将一个权限值拆分为一个权限原子类，以对象表示
 * @param permvalue {int} 权限值
 */
export function splitPerm(permvalue) {
    let perm, perms = {};

    SharePermissionOptions.forEach(function (permission, index) {
        perm = Number(permission.value);
        perms[perm] = (permvalue & perm) === perm;
    });

    return perms;
}


/**
 * 计算高级配置最终的权限加值
 * @param config {object[]}
 * @returns {Number|undefined} 返回权限加值
 */

export function calcPerm(config) {
    if (!config) {
        return undefined;
    }

    let result = sum(config, function (checked, key) {
        return checked === true && Number(key)
    });

    return result || undefined;
}

/**
 * 构建权限值对应的语句描述
 * @params perms {object} 权限值
 */
export function buildSelectionText(permissionOptions: Array<any>, { isowner, allow, deny }: Core.Permission.Perm, maxPerm?: number): string {

    if (isowner === true) {
        // 所有者
        return __('所有者');
    } else {

        // 判断拒绝的所有都配上了,表示为拒绝访问
        if (deny && deny === maxPerm) {
            return __('拒绝访问');
        }

        let allowText = permissionOptions.reduce((prev, permission) => {
            if (bitTest(allow, permission.value)) {
                return prev ? (prev + '/' + getPermissionText(permissionOptions, permission.value)) : getPermissionText(permissionOptions, permission.value)
            }
            return prev
        }, '')

        // 没有拒绝
        if (!deny) {
            return allowText;
        }

        let denyText = permissionOptions.reduce((prev, permission) => {
            if (bitTest(deny, permission.value)) {
                return prev ? (prev + '/' + getPermissionText(permissionOptions, permission.value)) : getPermissionText(permissionOptions, permission.value)
            }
            return prev
        }, '')

        return allowText + ' (' + __('拒绝 ') + denyText + ')';
    }
}

/**
 * 构建权限值(mobile使用)
 */
export function buildPermText(permissionOptions: Array<any>, { allow, deny }: Core.Permission.Perm, maxPerm?: number): {
    allowText: string;
    denyText: string;
} {

    // 判断拒绝的所有都配上了,表示为拒绝访问
    if (deny && deny === maxPerm) {
        return {
            allowText: '',
            denyText: __('拒绝访问')
        }
    }

    let allowText = permissionOptions.reduce((prev, permission) => {
        if (bitTest(allow, permission.value)) {
            return prev ? (prev + '/' + getPermissionText(permissionOptions, permission.value)) : getPermissionText(permissionOptions, permission.value)
        }
        return prev
    }, '')

    // 没有拒绝
    if (!deny) {
        return {
            allowText,
            denyText: ''
        }
    }

    let denyText = permissionOptions.reduce((prev, permission) => {
        if (bitTest(deny, permission.value)) {
            return prev ? (prev + '/' + getPermissionText(permissionOptions, permission.value)) : getPermissionText(permissionOptions, permission.value)
        }
        return prev
    }, '')

    return {
        allowText,
        denyText
    }
}

/**
 * 给一个权限值，找出其权限依赖和被依赖关系
 * @param permissions 权限数组
 * @param value 需要计算依赖关系的权限值
 * @return 返回数组，第一项表示它依赖的权限，第二项表示依赖它的权限
 */
export function findRelation(permissions: Array<PermissionOption>, value: number): Array<number> {
    return permissions.reduce(([requireTo, requiredBy], permission) => {
        // 查找到正向依赖
        if (permission.value === value) {
            return [permission.require, requiredBy];
        }
        // 如果某一项permission的依赖包含权限值，则这一项被permission被该权限依赖
        else if (bitTest(permission.require, value)) {
            return [requireTo, bitSum(requiredBy, permission.value)];
        }
        else {
            return [requireTo, requiredBy];
        }
    }, [0, 0])
}

/**
 * 设置允许权限
 * @param permvalue {int} 权限值
 * @param perms {isowner, allow, deny} 权限
 */
function setAllowPerm(permissions: Array<PermissionOption>, { isowner, allow, deny }: PermConfig, value: number): PermConfig {
    const [requireTo, requiredBy] = findRelation(permissions, value);

    return omit({
        isowner,
        allow: bitSum(allow, value, requireTo),
        deny: bitSub(deny, value, requireTo),
    }, isUndefined)
}

/**
 * 设置权限共享允许权限
 * @param current 当前的权限值
 * @param value 要改变的权限配置项
 */
export const setShareAllowPerm: ({ isowner, allow, deny }: PermConfig, value: SharePermission) => PermConfig = currify(setAllowPerm, SharePermissionOptions);

/**
 * 设置外链共享允许权限
 * @param current 当前的权限值
 * @param value 要改变的权限配置项
 */
export const setLinkSharePerm: ({ allow }, value: LinkSharePermission) => { allow } = currify(setAllowPerm, LinkSharePermissionOptions);

/**
 * 取消允许权限
 * @param value 触发变化的权限值 
 * @param perms {isowner, allow, deny} 权限
 */
function unsetAllowPerm(permissions: Array<PermissionOption>, { isowner, allow, deny }, value: number): PermConfig {
    const [requireTo, requiredBy] = findRelation(permissions, value);

    return omit({
        isowner,
        allow: bitSub(allow, value, requiredBy),
        deny
    }, isUndefined)
}

/**
 * 取消设置权限共享允许权限
 * @param current 当前的权限值
 * @param value 要改变的权限配置项
 */
export const unsetShareAllowPerm: ({ isowner, allow, deny }: PermConfig, value: SharePermission) => PermConfig = currify(unsetAllowPerm, SharePermissionOptions);

/**
 * 取消设置外链共享允许权限
 * @param current 当前的权限值
 * @param value 要改变的权限配置项
 */
export const unsetLinkSharePerm: ({ allow }, value: LinkSharePermission) => { allow } = currify(unsetAllowPerm, LinkSharePermissionOptions);

/**
 * 设置拒绝权限
 * @param value 触发变化的权限值 
 * @param perms {isowner, allow, deny} 权限
 */

export function setDenyPerm(permissions: Array<PermissionOption>, { isowner, allow, deny }: PermConfig, value: number): PermConfig {
    const [requireTo, requiredBy] = findRelation(permissions, value);

    return omit({
        isowner,
        allow: bitSub(allow, value, requiredBy),
        deny: bitSum(deny, value, requiredBy)
    }, isUndefined)
}

export const setShareDenyPerm = currify(setDenyPerm, SharePermissionOptions);

/**
 * 取消拒绝权限
 * @param value 触发变化的权限值 
 * @param perms {isowner, allow, deny} 权限
 */
function unsetDenyPerm(permissions: Array<PermissionOption>, { isowner, allow, deny }: PermConfig, value: number): PermConfig {
    const [requireTo, requiredBy] = findRelation(permissions, value);

    return omit({
        isowner,
        allow,
        deny: bitSub(deny, value, requireTo)
    }, isUndefined)
}

export const unsetShareDenyPerm = currify(unsetDenyPerm, SharePermissionOptions);

/**
 * 获取内链模板
 * 数据库anyshare/t_conf中有两项关于权限配置的字段，优先级高于模板
 *    (1)allowowner(boolean) -- 是否允许配置所有者 
 *          当allowowner为true时，是否允许配置所有者根据模板来；当allowowner为false时，不允许配置所有者
 *    (2)indefiniteperm(boolean) -- 是否允许设置永久有效
 *          当indefiniteperm为true时，是否允许设置永久有效根据模板来；
 *          当indefiniteperm为false时，
 *               1.模板允许设置永久有效，默认天数不限制时， -->  不允许设置永久有效，默认天数30天，可选范围到5年后的12月31号
 *               2.模板允许设置永久有效，默认天数限制时，  -->  不允许设置永久有效，可选范围到5年后的12月31号
 *               3.模板不允许配置永久有效，根据模板来
 */
export function getInternalTemplate(): Promise<any> {
    return Promise.all([getInternalLinkTemplate({}), getConfig('oemconfig')])
        .then(([{ allowperm, allowowner, defaultperm, defaultowner, limitexpiredays, allowexpiredays }, { allowowner: allowownerConfig, indefiniteperm }]) => {
            let template = {
                allowPerms: allowperm,
                allowOwner: allowownerConfig ? allowowner : false,   // 数据库中allowowner为true,依据模板来配置是否允许所有者;数据库中allowowner为false，不允许配置所有者
                defaultPerms: defaultperm,
                defaultOwner: defaultowner,
                validExpireDays: limitexpiredays,
                defaultExpireDays: !limitexpiredays ? allowexpiredays : null,
                maxExpireDays: limitexpiredays ? allowexpiredays : null
            }
            if (!indefiniteperm) {
                if (!template.validExpireDays) {
                    const today = new Date()
                    const maxExpireDays = (new Date((today.getFullYear() + 5), 11, 31).getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / (3600 * 24 * 1000)
                    template = { ...template, validExpireDays: true, maxExpireDays, defaultExpireDays: (template.defaultExpireDays === -1) ? 30 : template.defaultExpireDays }
                }
            }
            return template;
        })
}

/**
 * 获取内链的disabledOptions
 */
export function getDisabledOptions({ docid }: { docid: string }): Promise<any> {
    // （1）归档库，没有删除和修改
    return getDocType({ docid })
        .then(({ doctype }) => {
            return (doctype === 'archivedoc')
                ? bitSum(SharePermission.MODIFY, SharePermission.DELETE)
                : 0;
        })
}


/**
 * 获取permConfigs
 */
export function getPermConfigs({ docid }: { docid: string }, template: Core.Permission.Template, doctype: string, secretMode: boolean): Promise<any> {
    const { validExpireDays, defaultExpireDays, maxExpireDays, allowOwner } = template;

    let timeRange: Array<Date>;
    let defaultSelectDays: number;

    if (validExpireDays) {
        // 限制
        defaultSelectDays = defaultExpireDays ? defaultExpireDays : ((maxExpireDays > 30) ? 30 : maxExpireDays);
        timeRange = getSelectionTimeRange(maxExpireDays);
    } else {
        // 不限制
        defaultSelectDays = defaultExpireDays
        timeRange = getSelectionTimeRange(0)
    }
    let endtime: number = getEndTime(defaultSelectDays);

    return Promise.all([getOwnerInfos({ docid }), getPermInfos({ docid })])
        .then(([{ ownerinfos }, { perminfos }]) => {
            // 将ownerinfos转换成PermConfig类型的数组
            const newOwnerInfos: Array<Core.Permission.PermConfig> = ownerinfos.map(({ userid, name, inheritpath, csflevel }) => {
                return {
                    allow: 0,
                    deny: 0,
                    isowner: true,
                    accessorid: userid,
                    accessorname: name,
                    accessortype: accessorType[AccessorType.USER],
                    endtime: -1,
                    inheritpath,
                    allowOwner: displayOwner(doctype, allowOwner, accessorType[AccessorType.USER], secretMode),
                    timeRange,
                    defaultSelectDays,
                    allowPermanent: true,
                    csflevel
                }
            })
            // 将perminfos转换成PermConfig类型的数组
            const newPermInfos = perminfos.reduce((prev, perminfo) => {

                const { isallowed, permvalue, accessortype, accessorid, inheritpath, accessorcsflevel } = perminfo;
                const key = accessorid + inheritpath

                if (prev.find((perm) => (perm.accessorid + perm.inheritpath) === key)) {
                    // prev中含有与perminfo相同key的数据
                    return prev.map((perm) => {
                        if ((perm.accessorid + perm.inheritpath) === key) {
                            return { ...perm, allow: perm.allow ? perm.allow : perminfo.permvalue, deny: perm.deny ? perm.deny : perminfo.permvalue }
                        }
                        return perm
                    })
                }

                return [
                    ...prev, {
                        ...perminfo,
                        allow: isallowed ? permvalue : 0,
                        deny: isallowed ? 0 : permvalue,
                        isowner: false,
                        allowOwner: displayOwner(doctype, allowOwner, accessortype, secretMode),
                        timeRange,
                        defaultSelectDays,
                        allowPermanent: (perminfo.endtime === -1 || (!secretMode && timeRange.length === 1)),
                        csflevel: accessorcsflevel
                    }
                ]

            }, []).map((perm) => pick(perm, 'allow', 'deny', 'isowner', 'accessorid', 'accessorname', 'accessortype', 'endtime', 'inheritpath', 'allowOwner', 'timeRange', 'defaultSelectDays', 'allowPermanent', 'csflevel'))

            return [...newOwnerInfos, ...newPermInfos]
        })
}
/**
 * 按照内链模板添加一条权限信息
 */
export function formatterNewPermConfigs(doctype: string, visitors: Array<any>, template: Core.Permission.Template, secretMode: boolean) {

    return visitors.map((visitor) => {

        const { defaultPerms, defaultOwner, validExpireDays, defaultExpireDays, maxExpireDays, allowOwner } = template;

        let timeRange: Array<Date>;
        let defaultSelectDays: number;

        if (validExpireDays) {
            // 限制
            defaultSelectDays = defaultExpireDays ? defaultExpireDays : ((maxExpireDays > 30) ? 30 : maxExpireDays);
            timeRange = getSelectionTimeRange(maxExpireDays);
        } else {
            // 不限制
            defaultSelectDays = defaultExpireDays
            timeRange = getSelectionTimeRange(0)
        }
        let endtime: number = getEndTime(defaultSelectDays);

        let perminfo = {
            // 如果是归档库，需要将模板的默认权限减掉删除和修改
            allow: (doctype === 'archivedoc') ? bitSub(defaultPerms, bitSum(SharePermission.DELETE, SharePermission.MODIFY)) : defaultPerms,
            deny: 0,
            isowner: defaultOwner,
            endtime,
            inheritpath: '',
            namepath: __('当前文档'),
            timeRange,
            defaultSelectDays,
            allowPermanent: !secretMode && (endtime === -1 || timeRange.length === 1)
        }
        switch (true) {
            case 'userid' in visitor:
                return {
                    ...perminfo,
                    accessorid: visitor.userid,
                    accessorname: visitor.name,
                    accessortype: accessorType[AccessorType.USER],
                    allowOwner: displayOwner(doctype, allowOwner, accessorType[AccessorType.USER], secretMode),
                    csflevel: visitor.csflevel
                };
            case 'depid' in visitor:
                return {
                    ...perminfo,
                    accessorid: visitor.depid,
                    accessorname: visitor.name,
                    accessortype: accessorType[AccessorType.DEPARTMENT],
                    allowOwner: displayOwner(doctype, allowOwner, accessorType[AccessorType.DEPARTMENT], secretMode)
                };
            case 'id' in visitor:
                return {
                    ...perminfo,
                    accessorid: visitor.id,
                    accessorname: visitor.groupname,
                    accessortype: accessorType[AccessorType.CONTACTOR],
                    allowOwner: displayOwner(doctype, allowOwner, accessorType[AccessorType.CONTACTOR], secretMode)
                }
        }
    })
}

/**
* (1)如果是涉密模式，不显示“所有者”选项
* (2)非涉密模式下，如果当前所在的是个人文档目录，或者当前访问者是部门或联系人组，则下拉面板中不显示“所有者”选项
*/
export function displayOwner(doctype: string, allowowner: boolean, accessortype: string, secretMode: boolean) {
    if (secretMode || doctype === 'userdoc' || !allowowner || accessortype === accessorType[AccessorType.DEPARTMENT] || accessortype === accessorType[AccessorType.CONTACTOR]) {
        return false;
    }
    return true;
}

/**
 * 获取从今天开始到daysNumber天之后的时间选择范围数组
 */
export function getSelectionTimeRange(daysNumber: number): Array<Date> {
    const oneday = 1000 * 60 * 60 * 24;
    const today = new Date()
    return daysNumber ? [today, new Date(today.getTime() + daysNumber * oneday)] : [today]
}

/**
 * 获取daysNumber之后的时间戳, 单位是 毫秒 * 1000
 */
export function getEndTime(days): number {
    if (days === -1) {
        return -1
    }
    const oneday = 1000 * 60 * 60 * 24;
    return (today().getTime() + days * oneday) * 1000;
}

/**
     * 根据csflevel获取对应的密级
     * @param csflevel 文件密级， 
     * @param csf_level_enum 密级枚举, 类似{内部: 6, 机密: 8, 秘密: 7, 绝密: 9, 非密: 5}
     */
export function getCsflevelText(csflevel: number, csf_level_enum: any): string {
    let csflevel_text;
    for (let csfl in csf_level_enum) {
        if (csf_level_enum[csfl] === csflevel) {
            csflevel_text = csfl;
            break;
        }
    }
    return csflevel_text;
}

/**
 * 获取外链模板信息
 */
export function getExternalinkTemp(): Promise<Core.Permission.externalinkTemp> {
    return getExternalLinkTemplate({}).then(({ limitexpiredays, allowexpiredays, allowperm, defaultperm, limitaccesstimes, allowaccesstimes, accesspassword }) => {
        return {
            // 可设定的访问权限
            allowPerms: allowperm,
            // 默认访问权限
            defaultPerms: defaultperm,
            // 限制外链有效期
            validExpireDays: limitexpiredays,
            // 默认有效期
            defaultExpireDays: limitexpiredays ? null : allowexpiredays,
            // 最大有效期
            maxExpireDays: limitexpiredays ? allowexpiredays : null,
            // 强制使用访问密码
            enforceUseLinkPwd: accesspassword,
            // 限制外链打开次数
            limitAccessTime: limitaccesstimes,
            // 默认打开次数
            defaultLimitTimes: limitaccesstimes ? null : allowaccesstimes,
            // 最多打开次数
            maxLimitTimes: limitaccesstimes ? allowaccesstimes : null
        }
    })
}


/**
 *  检查 对接8511未标密文件是否允许开启权限配置
 * @returns promise<boolean> true--允许权限配置； false--不允许权限配置
 */
export async function checkDingMiShare(doc: Core.Docs.Doc): Promise<boolean> {
    const csf = await getConfig('third_csfsys_config')

    if (csf && csf.id === CSFSYSID['706'] && !isDir(doc)) {
        const { csflevel } = await getDocAttribute({ docid: doc.docid })

        // 文件密级为空
        if (csflevel === 0x7FFF) {
            return false
        }
        else {
            return true
        }
    } else {
        return true
    }
}

/**
 * 检查个人文档、群组文档是否允许权限配置
 * @returns promise<{notAllowShareUserdoc, notAllowShareGroupdoc}>
 * notAllowShareUserdoc -- true 当前的文档属于个人文档，且不允许配置权限
 * notAllowShareGroupdoc --true 当前的文档属于群组文档，且不允许配置权限
 */
export async function checkUserdocAndGroupdocShare(doc: Core.Docs.Doc): Promise<{
    notAllowShareUserdoc?: boolean;
    notAllowShareGroupdoc?: boolean
}> {

    const [{ doctype }, { enable_user_doc_inner_link_share, enable_group_doc_inner_link_share }] = await Promise.all([
        getDocType({ docid: doc.docid }),
        getShareDocConfig({})
    ])

    if (doctype === 'userdoc' && !enable_user_doc_inner_link_share) {
        // 个人文档，且不允许个人文档配置权限
        return { notAllowShareUserdoc: true, notAllowShareGroupdoc: false }

    } else if (doctype === 'groupdoc' && !enable_group_doc_inner_link_share) {
        // 群组文档，且不允许群组文档配置权限
        const { isowner } = await checkOwner({ docid: doc.docid })

        if (isowner) {
            // 所有者
            return { notAllowShareGroupdoc: true, notAllowShareUserdoc: false }
        } else {
            // 非所有者
            return { notAllowShareUserdoc: false, notAllowShareGroupdoc: false }
        }
    } else {
        return { notAllowShareUserdoc: false, notAllowShareGroupdoc: false }
    }

}

export function formatterErrorText(errCode: number, doc?: Core.Docs.Doc, template?: any) {
    switch (errCode) {
        case Status.NotOwner: {
            return __('您不是当前文档的所有者，无法配置权限。')
        }

        case Status.LowCsf: {
            return __('你指定的用户密级低于文件 “${docname}” 的密级，您无法对其配置共享。', { docname: docname(doc) })
        }

        case Status.FileNotExisted: {
            return isDir(doc)
                ? __('文件夹“${docname}”不存在, 可能其所在路径发生变更。', { docname: docname(doc) })
                : __('文件“${docname}”不存在, 可能其所在路径发生变更。', { docname: docname(doc) })
        }

        case Status.OutOfPermission: {
            // 超出模板最大权限
            return __('管理员已限制您可设定的访问权限为“${permission}”。', { permission: buildSelectionText(SharePermissionOptions, { allow: template.allowperm }) })
        }

        case Status.OutOfEndTime: {
            // 超出模板最大有效期
            return __('管理员已限制您设定的有效期，不允许超过${days}天。', { days: template.allowexpiredays })
        }

        case Status.SecretNoPermanent: {
            return __('管理员已限制您设定的有效期，不允许永久有效。');
        }

        case Status.FreezedUser:
        case Status.FreezedDoc:
            return __('无法执行权限配置，') + getErrorMessage(errCode)

        case Status.NoCsf: {
            return __('当前文件未定密，不允许共享。')
        }

        case ErrorCode.PermModifyDeniedWithGroupCreater:
            return __('不允许对群组文档的创建者配置权限。')

        case Status.ShareBeAudited:
            return __('您的共享已提交审核，请登录Web客户端“共享申请”中查看')

        default:
            return getErrorMessage(errCode)
    }
}

/**
 * 规范化名字
 */
export function formatterName(name: string): string {
    if (!name) {
        return ''
    }
    let index = name.lastIndexOf('\/');
    return name.substring(index === -1 ? 0 : index + 1, name.length)
}

/**
 * mobile， 根据模板，获取默认信息
 * 
 */
export function getEndtimeWithTemplate({ validExpireDays, defaultExpireDays, maxExpireDays }: Core.Permission.Template, secretMode: boolean): {
    endtime: number;
    timeRange: ReadonlyArray<Date>;
    defaultSelectDays: number;
    allowPermanent: boolean;
    minTime: number;
    maxTime: number;
} {

    let timeRange: Array<Date>;
    let defaultSelectDays: number;

    if (validExpireDays) {
        // 限制
        defaultSelectDays = defaultExpireDays ? defaultExpireDays : ((maxExpireDays > 30) ? 30 : maxExpireDays);
        timeRange = getSelectionTimeRange(maxExpireDays);
    } else {
        // 不限制
        defaultSelectDays = defaultExpireDays
        timeRange = getSelectionTimeRange(0)
    }

    const endtime: number = getEndTime(defaultSelectDays === -1 ? 30 : defaultSelectDays);

    return {
        endtime,
        timeRange,
        defaultSelectDays,
        allowPermanent: !secretMode && (defaultSelectDays === -1 || timeRange.length === 1),
        minTime: getEndTime(0),
        maxTime: validExpireDays ? getEndTime(maxExpireDays) : -1
    }
}

/**
 * 外链访问，获取错误码对应的错误信息
 * @param errorCode 错误码
 * @returns 错误信息
 */
export function getLinkErrorMessage(errorCode: number): string {
    switch (errorCode) {
        case ErrorCode.LinkInaccessable:
            return __('该链接地址已失效')

        case ErrorCode.LinkVisitExceeded:
            return __('抱歉，该链接的打开次数已达上限')

        case ErrorCode.LinkAuthFailed:
            return __('访问密码不正确')

        case EmptyLinkPassword:
            return __('访问密码不能为空')

        default:
            return ''
    }
}

/**
 * 访问外链的状态
 */
export enum LinkReqStatus {
    /**
     * 还未获取到结果
     */
    Initial,

    /**
     * 显示文件/文件夹基本信息
     */
    Info,

    /**
     * 列举文件夹的子文件和子文件夹
     */
    List,

    /**
     * 预览文件
     */
    PreviewFile,

    /**
     * 获取的时候出现异常
     */
    Error
}

/**
 * 检查能否进入目录
 * @param doc 
 */
export async function canOpenDir(doc) {
    if (!isDir(doc)) {
        return false
    } else {
        // 虚拟目录检查没有显示权限，但是可以进入
        if (await isInEntry(doc.docid) || await checkPermItem(doc.docid, SharePermission.DISPLAY)) {
            return true
        } else {
            return false
        }
    }
}

/**
 * 判断目录能否被访问或者文件能否被预览
 * @param doc 文档对象
 */
export function canAccess(doc) {
    if (isDir(doc)) {
        return canOpenDir(doc)
    } else {
        return checkPermItem(doc.docid, SharePermission.PREVIEW)
    }
}

/**
 * 外链访问密码输入框为空
 */
export const EmptyLinkPassword = 10;
