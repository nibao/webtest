import { min, max } from 'lodash'
import '../../gen-js/ECMSManager_types'
import __ from './locale'
import * as androidpng from './assets/Android.png'
import * as standardpng from './assets/standard.png'
import * as advancedpng from './assets/advanced.png'

/**
 * 客户端 webuploader注册名称数组
 */
export const clientUploadNames = [
    'win32',
    'win64',
    'android',
    'mac'
]

/**
 * 服务器 webuploader注册名称
 */
export const serverUploadName = 'serverupload'

/**
 * 应用节点状态
 */
export enum AppNodeStatus {
    /**
     * 还未获取到结果
     */
    Initial,

    /**
     * 已有应用节点
     */
    Setup,

    /**
     * 未设置应用节点
     */
    NoSet
}

/**
 * 升级包的状态
 */
export enum PackageStatus {
    Initial,

    /**
     * 显示升级包详情
     */
    PackageDetail,

    /**
     * 显示上传
     */
    Upload,

    /**
     * 显示进度
     */
    Progress
}

// 客户端升级部分

/**
 * 升级模式
 */
export enum Mode {
    /**
     * none
     */
    None,

    /**
     * 强制升级
     */
    Force,

    /**
     * 不强制升级
     */
    NoForce
}

/**
 * 客户端类型
 */
export enum OsType {
    /**
     * win32
     */
    Win32,

    /**
     * win64
     */
    Win64,

    /**
     * 安卓
     */
    Android,

    /**
     * mac
     */
    Mac,

    /**
     * win32 advanced
     */
    Win32Advanced,

    /**
     * win64 advanced
     */
    Win64Advanced
}

/**
 * 客户端升级策略
 */
export enum ClientUpdateStrategy {
    /**
     * 各自升级到相应的版本
     */
    CorrespondingUpdate,

    /**
     * 升级到尊享版
     */
    ToAdvanced,

    /**
     * 升级到标准版
     */
    ToStandard
}

/**
 * 客户端升级包的图标/名称/后缀
 */
export const clients = {
    [OsType.Win32]: {
        code: '\uf03d',
        fallback: standardpng,
        color: '#55a7d8',
        text: 'Windows_32bit',
        extension: 'exe',
        tip: __('请参照以下范例命名升级包：') + 'AnyShare_Windows_All_x86_develop-6.0.2-20160121-release-2080.exe',
        accept: {
            title: '*.exe',
            extensions: 'exe',
            mimeTypes: '.exe'
        },
        exText: '',
        winTip: __('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用')
    },
    [OsType.Win64]: {
        code: '\uf03d',
        fallback: standardpng,
        color: '#55a7d8',
        text: 'Windows_64bit',
        extension: 'exe',
        tip: __('请参照以下范例命名升级包：') + 'AnyShare_Windows_All_x64_develop-6.0.2-20160121-release-2080.exe',
        accept: {
            title: '*.exe',
            extensions: 'exe',
            mimeTypes: '.exe'
        },
        exText: '',
        winTip: __('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用')
    },
    [OsType.Win32Advanced]: {
        code: '\uf03d',
        fallback: advancedpng,
        color: '#376ea0',
        text: 'Windows_32bit',
        extension: 'exe',
        tip: __('请参照以下范例命名升级包：') + 'AnyShareNew_Windows_All_x86_fm-6.0.2-20160121-release-2080.exe',
        accept: {
            title: '*.exe',
            extensions: 'exe',
            mimeTypes: '.exe'
        },
        exText: 'Web-base',
        winTip: __('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用')
    },
    [OsType.Win64Advanced]: {
        code: '\uf03d',
        fallback: advancedpng,
        color: '#376ea0',
        text: 'Windows_64bit',
        extension: 'exe',
        tip: __('请参照以下范例命名升级包：') + 'AnyShareNew_Windows_All_x64_fm-6.0.2-20160121-release-2080.exe',
        accept: {
            title: '*.exe',
            extensions: 'exe',
            mimeTypes: '.exe'
        },
        exText: 'Web-base',
        winTip: __('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用')
    },
    [OsType.Android]: {
        code: '\uf040',
        fallback: androidpng,
        color: '#99B756',
        text: 'Android',
        extension: 'apk',
        tip: __('请参照以下范例命名升级包：') + 'AnyShare_Android-6.0.2-20160121-release-2080.apk',
        accept: {
            title: '*.apk',
            extensions: 'apk',
            mimeTypes: '.apk'
        }
    },
    [OsType.Mac]: {
        code: '\uf03e',
        text: 'Mac',
        color: '#000',
        extension: 'dmg',
        tip: __('请参照以下范例命名升级包：') + 'AnyShare_Mac-6.0.2-20160121-release-2080-CN.dmg',
        accept: {
            title: '*.dmg',
            extensions: 'dmg',
            mimeTypes: '.dmg'
        }
    }
}

/**
 * 客户端包名称的正则
 */
const PatternPackages = {
    [OsType.Win32]: /Windows_\w+_x86(_[^f][^m][\w]{0,})?-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+\.exe$/,

    [OsType.Win64]: /Windows_\w+_x64(_[^f][^m][\w]{0,})?-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+\.exe$/,

    [OsType.Win32Advanced]: /Windows_\w+_x86_fm-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+\.exe$/,

    [OsType.Win64Advanced]: /Windows_\w+_x64_fm-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+\.exe$/,

    [OsType.Android]: /Android-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+\.apk$/,

    [OsType.Mac]: /Mac-((\d+\.)+\d+)-\d+-(release|Terminator)-\d+-\w+\.dmg$/
}

/**
 * 检查客户端升级包的合法性
 * @param name 包名称
 * @param ostype 包类型
 * @returns true -- 合法; false -- 不合法
 */
export function testPackageNamePattern(name: string, ostype: OsType): boolean {
    return PatternPackages[ostype].test(name)
}



// 服务器升级部分

export enum ErrorCode {
    None,

    /**
     * 不存在存储设备
     */
    NoStorageDevice,

    /**
     * 节点离线
     */
    NodeNotOnLine,

    /**
     * 节点异常
     */
    NodeException,

    /**
     * 上传升级包失败
     */
    UploadError,

    /**
     * 删除升级包失败
     */
    DeleteError,

    /**
     * 升级升级包失败
     */
    UpgradeError
}

/**
 * 服务器上传的confirmStatus
 */
export enum ConfirmStatus {
    None,

    /**
     * 删除升级包
     */
    Delete,

    /**
     * 升级升级包
     */
    Upgrade,

    /**
     * 清空升级状态
     */
    ClearUpgradStatus
}

export enum ServerPackageStatus {
    Initial,

    /**
     * 上传成功
     */
    UploadSuccess,

    /**
     * 升级中
     */
    Upgrading,

    /**
     * 升级完成
     */
    UpgradeComplete
}

export const serverPackageinfo = {
    [ServerPackageStatus.UploadSuccess]: {
        icon: '\uf0c8',
        text: __('上传成功')
    },
    [ServerPackageStatus.Upgrading]: {
        text: __('升级中......')
    },
    [ServerPackageStatus.UpgradeComplete]: {
        icon: '\uf0c9',
        text: __('升级完成')
    }
}

/**
 * 获取节点角色
 */
export function getRoleName({ role_db, role_ecms, role_app, role_storage, sys, is_master }): string {

    let roleName = ''

    // 数据库主节点/数据库从节点
    switch (role_db) {
        case 1:
            roleName = __('数据库主')
            break

        case 2:
            roleName = __('数据库从')
            break

        default:
    }

    // 集群管理
    if (role_ecms) {
        roleName = (roleName ? (roleName + '/') : '') + __('集群管理')
    }

    // 应用/单点服务
    switch (role_app) {
        case 1:
            roleName = (roleName ? (roleName + '/') : '') + __('应用')
            break

        case 2:
            roleName = (roleName ? (roleName + '/') : '') + __('单点服务')
            break

        default:
    }

    // 存储节点
    if (role_storage) {
        roleName = (roleName ? (roleName + '/') : '') + __('存储')
    }

    if (sys) {
        switch (sys) {
            case ncTHaSys.BASIC:
                roleName = (roleName ? (roleName + '/') : '') + __('高可用')
                break

            case ncTHaSys.APP:
                roleName = (roleName ? (roleName + '/') : '') + __('应用')
                break

            case ncTHaSys.STORAGE:
                roleName = (roleName ? (roleName + '/') : '') + __('存储')
                break

            default:
        }

        if (is_master) {
            roleName = roleName + __('主')
        } else {
            roleName = roleName + __('从')
        }
    }

    return roleName
}

/**
 * 获取节点升级信息的表头信息, 开始时间/完成时间/总节点数/已完成/升级中
 */
export function getNodeInfos(nodeInfos: any): { startTime, endTime, nodeNums, doneNums, upgradingNums } {

    if (!nodeInfos.length) {
        return {
            startTime: 0,
            endTime: 0,
            nodeNums: '---',
            doneNums: '---',
            upgradingNums: '---'
        }
    }

    // 总节点数
    const nodeNums = nodeInfos.length
    // 已完成节点
    const doneNodes = nodeInfos.filter(({ status }) => status === 'done')
    // 已完成节点数
    const doneNums = doneNodes.length
    // 升级中节点数
    const upgradingNums = nodeNums - doneNums

    let endTime = 0
    if (!upgradingNums) {
        // 所有节点都已完成, 结束时间为最大的一个
        endTime = max(nodeInfos.map(({ last_time }) => last_time))
    }

    // 开始时间为最小的一个
    const startTime = min(nodeInfos.map(({ start_time }) => start_time))

    return {
        startTime,
        endTime,
        nodeNums,
        doneNums,
        upgradingNums
    }

}

/**
 * errorMessage 
 * @param offLineNodes 离线的节点数组
 */
export function getErrorMessage(errorCode: number, offLineNodes: ReadonlyArray<string>): string {
    switch (errorCode) {
        // 节点离线
        case ErrorCode.NodeNotOnLine:
            return offLineNodes.length === 1 ?
                __('节点${node}已离线，请检查节点', { node: offLineNodes[0] })
                :
                __('节点${nodes}已离线，请检查节点', { nodes: offLineNodes.join('\、') })

        // 节点异常
        case ErrorCode.NodeException:
            return __('存在系统异常，请检查系统状态。')

        default:
            return ''
    }
}

/**
 * 获取ErrorDialogTitile
 */
export function getErrorTitleMessage(errorType: ErrorCode): string {
    switch (errorType) {
        case ErrorCode.DeleteError:
            return __('删除升级包失败，错误信息如下：')

        case ErrorCode.UpgradeError:
            return __('升级升级包失败，错误信息如下：')

        case ErrorCode.UploadError:
            return __('上传升级包失败，错误信息如下：')

        default:
            return ''
    }
}