import { EVFS } from '../thrift';

/**
 * 获取第三方对象存储服务信息
 *
 * @return :    使用的第三方对象存储信息
 * @throw 转抛内部调用异常。
 */
export const getThirdPartyOSSInfo: Core.EVFS.GetThirdPartyOSSInfo = function () {
  return EVFS('GetThirdPartyOSSInfo');
}

/**
 * 设置第三方对象存储服务信息
 *
 * @param ossInfo:    对象存储服务信息
 * @throw 转抛内部调用异常。
 */
export const setThirdPartyOSSInfo: Core.EVFS.SetThirdPartyOSSInfo = function ([ossInfo]) {
  return EVFS('SetThirdPartyOSSInfo', [{ 'ncTEVFSOSSInfo': ossInfo }]);
}

/**
 * 验证第三方对象存储服务是否可以通信
 *
 * @param ossInfo:    对象存储服务信息
 * @throw 转抛内部调用异常。
 */
export const connectThirdPartyOSS: Core.EVFS.ConnectThirdPartyOSS = function ([ossInfo]) {
  return EVFS('ConnectThirdPartyOSS', [{ 'ncTEVFSOSSInfo': ossInfo }]);
}


/**
  * 获取文件上传格式限制
  *
  * ncTLimitSuffixDoc 列表
  * @throw 转抛内部调用异常
  */
export const GetFileSuffixLimit: Core.EVFS.GetFileSuffixLimit = function () {
  return EVFS('GetFileSuffixLimit')
}

/**
  * 设置文件上传格式限制
  *
  * @throw 转抛内部调用异常
  */
export const SetFileSuffixLimit: Core.EVFS.SetFileSuffixLimit = function ([suffixDocs]) {
  return EVFS('SetFileSuffixLimit', [suffixDocs])
}
