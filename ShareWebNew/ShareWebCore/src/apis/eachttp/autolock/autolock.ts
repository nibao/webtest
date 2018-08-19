import { eachttp } from '../../../openapi/openapi';

/**
 * 锁定文件
 */
export const lock: Core.APIs.EACHTTP.AutoLock.Lock = function ({ docid }, options?) {
    return eachttp('autolock', 'lock', { docid }, options)
}

/**
 * 尝试锁定文件
 */
export const trylock: Core.APIs.EACHTTP.AutoLock.TryLock = function ({ docid }, options?) {
    return eachttp('autolock', 'trylock', { docid }, options)
}

/**
 * 刷新文件锁
 */
export const refresh: Core.APIs.EACHTTP.AutoLock.Refresh = function ({ lockinfos }, options?) {
    return eachttp('autolock', 'refresh', { lockinfos }, options)
}

/**
 * 解锁
 */
export const unlock: Core.APIs.EACHTTP.AutoLock.Unlock = function ({ docid }, options?) {
    return eachttp('autolock', 'unlock', { docid }, options)
}

/**
 * 获取文件锁信息
 */
export const getLockInfo: Core.APIs.EACHTTP.AutoLock.GetLockInfo = function ({ docid }, options?) {
    return eachttp('autolock', 'getlockinfo', { docid }, options)
}

/**
 * 获取文件夹锁信息
 */
export const getDirLockInfo: Core.APIs.EACHTTP.AutoLock.GetDirLockInfo = function ({ docid }, options?) {
    return eachttp('autolock', 'getdirlockinfo', { docid }, options)
}