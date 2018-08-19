import { curryRight } from 'lodash'
import { eachttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取配置信息
 */
export const get = CacheableOpenAPIFactory(eachttp, 'config', 'get', { expires: 60 * 1000 }).bind(null, null, { userid: null, tokenid: null })

/**
 * 获取OEM配置
 */
export const getOemConfigBySection = curryRight(CacheableOpenAPIFactory(eachttp, 'config', 'getoemconfigbysection', { expires: 60 * 1000 }))({ userid: null, tokenid: null })

/**
 * 获取水印配置
 */
export const getDocWatermarkConfig: Core.APIs.EACHTTP.Config.GetDocWatermarkConfig = CacheableOpenAPIFactory(eachttp, 'config', 'getdocwatermarkconfig', { expires: 60 * 1000 }).bind(null, null, { userid: null, tokenid: null })

/**
 * 获取OfficeOnline配置
 */
export const getSiteOfficeOnLineInfo: Core.APIs.EACHTTP.Config.GetSiteOfficeOnlineInfo = curryRight(CacheableOpenAPIFactory(eachttp, 'config', 'getsiteofficeonlineinfo', { expires: 60 * 1000 }))({ userid: null, tokenid: null })