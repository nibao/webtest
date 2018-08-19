/// <reference path="./resourceshare.d.ts" />

import { get, post } from '../../../../util/http/http';

const baseUrl = `${location.protocol}//${location.hostname}:${location.port}/qhdjg`;
/**
 * 获取Token
 */
export const getToken: Core.APIs.THIRDPARTY.ResourceShare.GetToken = function () {
    return get(`${baseUrl}?method=token`);
}

/**
 * 获取学段
 */
export const phaseList: Core.APIs.THIRDPARTY.ResourceShare.PhaseList = function ({ access_token }) {
    return get(`${baseUrl}?method=phase&access_token=${access_token}`);
}

/**
 * 获取学科(课程)
 */
export const subjectList: Core.APIs.THIRDPARTY.ResourceShare.SubjectList = function ({ access_token, phase }) {
    return get(`${baseUrl}?method=subject&access_token=${access_token}&phase=${phase}`);
}

/**
 * 获取版本
 */
export const editionList: Core.APIs.THIRDPARTY.ResourceShare.EditionList = function ({ access_token, phase, subject }) {
    return get(`${baseUrl}?method=edition&access_token=${access_token}&phase=${phase}&subject=${subject}`);
}

/**
 * 获取年级
 */
export const gradeList: Core.APIs.THIRDPARTY.ResourceShare.GradeList = function ({ access_token, phase }) {
    return get(`${baseUrl}?method=grade&access_token=${access_token}&phase=${phase}`);
}

/**
 * 获取册别
 */
export const volumeList: Core.APIs.THIRDPARTY.ResourceShare.VolumeList = function ({ access_token, phase, edition, grade, subject }) {
    return get(`${baseUrl}?method=volume&access_token=${access_token}&phase=${phase}&subject=${subject}&edition=${edition}&grade=${grade}`);
}

/**
 * 获取教材
 */
export const bookList: Core.APIs.THIRDPARTY.ResourceShare.BookList = function ({ access_token, phase, subject, edition, grade, volume }) {
    return get(`${baseUrl}?method=book&access_token=${access_token}&phase=${phase}&subject=${subject}&edition=${edition}&grade=${grade}&volume=${volume}`);

}

/**
 * 获取教材目录
 */
export const unitList: Core.APIs.THIRDPARTY.ResourceShare.UnitList = function ({ access_token, bookCode }) {
    return get(`${baseUrl}?method=unit&access_token=${access_token}&bookCode=${bookCode}`);
}

/**
 * 获取资源类型
 */
export const typeList: Core.APIs.THIRDPARTY.ResourceShare.TypeList = function ({ access_token }) {
    return get(`${baseUrl}?method=type&access_token=${access_token}`);
}

/**
 * 保存资源文件到资源中心
 */
export const shareToResCenter: Core.APIs.THIRDPARTY.ResourceShare.ShareCenter = function ({ access_token, url, filename, creator, uploader, type, book, volume, unit1, unit2, unit3, unit4, grade, subject, phase, edition }) {
    return post(`${baseUrl}?method=shareToResCenter`, {
        access_token, url, filename, creator, uploader, type, book, volume, unit1, unit2, unit3, unit4, grade, subject, phase, edition
    });
}

/* 账号验证*/
export const userValidation: Core.APIs.THIRDPARTY.ResourceShare.UserValidation = function ({
    user,
}) {
    return get(`${baseUrl}?method=validation&user=${user}`)
}

/* 获取用户信息 */
export const getUserInfo: Core.APIs.THIRDPARTY.ResourceShare.UserInfo = function ({
    user,
    key,
}) {
    return get(`${baseUrl}?method=getUserinformation&user=${user}&key=${key}`)
}

/* 分享资源到班级空间 */

export const shareToClassSpace: Core.APIs.THIRDPARTY.ResourceShare.ShareToClassSpace = function ({
    extension,
    cyuid,
    fileName,
    url,
    class_id
}) {
    return post(`${baseUrl}?method=shareToClass`,
        {
            extension,
            cyuid,
            fileName,
            url,
            class_id
        }
    )
}

/* 分享资源到个人空间 */
export const shareToPersonSpace: Core.APIs.THIRDPARTY.ResourceShare.ShareToPersonSpace = function ({
    user,
    key,
    docid,
    type,
    name
}) {
    return post(`${baseUrl}?method=shareToSelf&key=${key}`,
        {
            user,
            docid,
            type,
            name
        }
    )
}