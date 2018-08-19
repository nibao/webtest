/// <reference path="./extension.d.ts" />

import { includes, findKey } from 'lodash';
import { isDir } from '../docs/docs';
import __ from './locale';

/**
 * @static
 */
export const EXTENSIONS: Core.Extension.Extensions = {
    'WORD': ['.docx', '.dotx', '.dot', '.doc', '.odt', '.wps', '.docm', '.dotm'],
    'EXCEL': ['.xlsx', '.xlsm', '.xlsb', '.xls', '.et', '.xla', '.xltm', '.xltx', '.xlt', '.ods'],
    'PPT': ['.pptx', '.ppt', '.pot', '.pps', '.ppsx', '.dps', '.potm', '.ppsm', '.potx', '.pptm', '.odp'],
    'PDF': ['.pdf'],
    'TXT': ['.txt'],
    'IMG': ['.jpg', '.jpeg', '.gif', '.bmp', '.png', '.wmf', '.emf', '.svg', '.tga', '.tif'],
    'ARCHIVE': ['.zip', '.rar', '.tgz', '.tar', '.cab', '.uue', '.jar', '.ace', '.lzh', '.arj', '.gzip', '.gz', '.gz2', '.bz', '.bz2', '.7z', '.iso', '.rpm'],
    'VIDEO': ['.avi', '.rmvb', '.rm', '.mp4', '.3gp', '.mkv', '.mov', '.mpg', '.mpeg', '.wmv', '.flv', '.asf', '.h264', '.x264', '.mts', '.m2ts'],
    'AUDIO': ['.mp3', '.aac', '.wav', '.wma', '.flac', '.m4a', '.ape', '.ogg'],
    'EXE': ['.exe', '.msi', '.bat'],
    'CAD': ['.dwg', '.dwt', '.dxf'],
    'PSD': ['.psd'],
    'VISIO': ['.vsd', '.vss', '.vst', '.vdx', '.vsx', '.vtx'],
    'HTML': ['.html']
};


/**
 * OWAS支持的预览格式
 */
const OWAS_EXTENSIONS = {
    'WORD': ['.docx', '.doc', '.docm', '.odt', '.dotm', '.dotx'],
    'EXCEL': ['.xlsx', '.xls', '.ods', '.xlsb', '.xlsm'],
    'PPT': ['.pptx', '.ppt', '.odp', '.pot', '.potm', '.potx', '.pps', '.ppsm', '.ppsx', '.pptm'],
    'PDF': []
}

/**
 * OWAS支持编辑的格式
 */
const OWAS_EXTENSIONS_EDITABLE = {
    'WORD': ['.docx', '.docm', '.odt'],
    'EXCEL': ['.xlsx', '.ods', '.xlsb', '.xlsm'],
    'PPT': ['.pptx', '.odp', '.ppsx'],
    'PDF': []
}

/**
 * 微信企业号支持的图片格式
 */
const PICTURE_EXTENSIONS = {
    'IMG': ['.jpg', '.tif', '.jpeg', '.gif', '.bmp', '.png']
}

/**
 * 图片预览格式
 */
const IMAGE_EXENSIONS = {
    'IMG': ['.jpg', '.jpeg', '.gif', '.bmp', '.png', '.wmf', '.emf', '.svg', '.tga', '.tif']
}

/**
 * 序列化文件名
 * @param 文件名或扩展名
 */
export function serializeName(name): string {
    if (!name) {
        return ''
    }

    let dotIndex = name.lastIndexOf('.');

    if (dotIndex === -1) {
        // 输入字段即为扩展名，则加上"."
        return '.' + name;
    } else {
        // 截取最后一个"."到结尾字符串
        return name.slice(dotIndex);
    }
}

/**
 * 获取文件名
 * @param fullname
 * @return [name, ext]
 */
export function splitName(name: string): [string, string] {
    if (!name) {
        return ['', '']
    }

    let dotIndex = name.lastIndexOf('.')
    if (dotIndex === -1) {
        return [name, '']
    }

    return [name.slice(0, dotIndex), name.slice(dotIndex + 1)]
}

/**
 * 获取文档类型
 * @param extension 文件名或扩展名
 * @return 返回文档类型
 */
export function findType(name: string): string {
    return findKey(EXTENSIONS, (exts) => {
        return includes(exts, serializeName(name.toLowerCase()));
    });
}

/**
 * 获取OWAS文档类型
 */
export function findOWASType(name): string {
    return findKey(OWAS_EXTENSIONS, (exts) => {
        return includes(exts, serializeName(name.toLowerCase()));
    });
}

export function findOWASEditType(name): string {
    return findKey(OWAS_EXTENSIONS_EDITABLE, exts => includes(exts, serializeName(name.toLowerCase())))
}

/**
 * 微信企业号支持图片类型
 */
export function findPictrueType(name): string {
    return findKey(PICTURE_EXTENSIONS, (exts) => {
        return includes(exts, serializeName(name.toLowerCase()));
    });
}

/**
 * 图片预览支持格式
 * @param name 
 */
export function findImageType(name): string {
    return findKey(IMAGE_EXENSIONS, (exts) => {
        return includes(exts, serializeName(name.toLowerCase()));
    });
}

/**
 * 是否是OWAS支持的文件类型
 */
export function OWASSupported(name, { editable = false } = {}): boolean {
    return editable ? !!findOWASEditType(name) : !!findOWASType(name);
}

/**
 * 格式化文件类型
 * @param doc {}
 */
export function formatType(doc) {

    if (isDir(doc)) {
        if (!doc.doctype) {
            return __('文件夹');
        } else {
            if (doc.doctype === 'customdoc') {
                return doc.typename || __('文档库');
            } else {
                switch (doc.doctype) {
                    case 'userdoc':
                        return __('个人文档');

                    case 'sharedoc':
                        return __('共享文档');

                    case 'groupdoc':
                        return __('群组文档');
                }
            }
        }
    } else {
        switch (findType(doc.name || doc.docname)) {
            case 'IMG':
                return __('图片');

            case 'WORD':
                return __('WORD');

            case 'EXCEL':
                return __('EXCEL');

            case 'PPT':
                return __('PPT');

            case 'PDF':
                return __('PDF');

            case 'TXT':
                return __('文本');

            case 'ARCHIVE':
                return __('压缩文件');

            case 'VIDEO':
                return __('视频');

            case 'AUDIO':
                return __('音频');

            case 'CAD':
                return __('CAD');

            default:
                return __('其他');

        }
    }
}