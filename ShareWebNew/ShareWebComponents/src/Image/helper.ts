import { buildSrc } from '../../core/image/image';

export enum Status {
    // 获取成功
    OK,

    // 格式错误
    INVALID_FORMAT,

    // 预览失败
    FAILED,

    // 外链密码不正确
    LINK_PWD_ERROR = 401002,

    // 没有预览权限
    NO_PERMISSION = 403002,

    // 文件不存在
    FILE_NOT_EXISTED = 404006
}

function buildThumb(docid: string): any {
    return buildSrc(docid, 100, 100, 50);
}

export function buildGallery(list: Array<any>): Array<any> {
    let checkingPerm = [],
        gallery = [],
        groupIndex = -1;

    return _.map(list, (doc) => ({
        doc,
        img: buildThumb(doc.docid)
    }));
}