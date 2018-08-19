/// <reference path="./template.d.ts" />
import { ShareMgnt } from '../thrift';

/**
 * 获取模板
 * @param templateType 0内链，1外链
 */
export function getLinkTemplate(templateType: Core.Template.TemplateType): PromiseLike<Array<Core.Template.ncTLinkTemplateInfo>> {
    return ShareMgnt('GetLinkTemplate', [templateType]);
}

/**
 *  添加模板，返回值为已配置过其他策略的共享者名称列表
 * @param templateInfo 
 */
export function addLinkTemplate(ncTLinkTemplateInfo: Core.Template.ncTLinkTemplateInfo): PromiseLike<Array<string>> {
    return ShareMgnt('AddLinkTemplate', [{ ncTLinkTemplateInfo }]);
}

/**
 * 编辑模板，返回值为已配置过其他策略的共享者名称列表
 * @param templateInfo 
 */
export function editLinkTemplate(ncTLinkTemplateInfo: Core.Template.ncTLinkTemplateInfo): PromiseLike<Array<string>> {
    return ShareMgnt('EditLinkTemplate', [{ ncTLinkTemplateInfo }]);
}

/**
 * 搜索模板
 * @param templateType 
 * @param key 
 */
export function searchLinkTemplate(templateType: Core.Template.TemplateType, key: string): PromiseLike<Array<Core.Template.ncTLinkTemplateInfo>> {
    return ShareMgnt('SearchLinkTemplate', [templateType, key]);
}

/**
 * 删除模板
 * @param templateId 
 */
export function deleteLinkTemplate(templateId: string): PromiseLike<void> {
    return ShareMgnt('DeleteLinkTemplate', [templateId]);
}


