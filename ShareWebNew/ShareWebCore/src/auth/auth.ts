/// <reference path="../apis/eachttp/auth1/auth1.d.ts" />
/// <reference path="../user/user.d.ts" />


import cookie from 'react-cookie';
import session from '../../util/session/session';
import { rsaEncrypt } from '../../util/rsa/rsa';
import { getNew, extLoginClient, getByThirdParty, logout } from '../apis/eachttp/auth1/auth1';
import { get as getUser } from '../apis/eachttp/user/user';
import { getConfig, getThirdAuth } from '../config/config';
import { mapValues, assign, zipObject, map, } from 'lodash';
import { getFullInfo } from '../user/user';



/**
 * 登录类型
 */
export const OS_TYPE = {
    UNKNOWN: 0,
    IOS: 1,
    ANDROID: 2,
    WINDOWS_PHONE: 3,
    WINDOWS: 4,
    MACOSX: 5,
    WEB: 6,
    MOBILEWEB: 7
};

// AnyShare公钥
const PUBLIC_KEY = 'BB24BD0371A3141EE992761C574F1AA20010420C446144922C00F07EFB3C752' +
    '0D81210A3C66DEC43B75A2370D01CD1F23E1BFC93B907201F5116F29A2C8149' +
    'E2D2671313A0A78E455BBFC20B802BA1CBEE1EBBEDA50290F040F0FD4EBE89F' +
    '24DB546EBB6B16579675551B9016A1A6FDCE6F6933901395453885CF55369AD' +
    'B999';

/**
 * 使用AnyShare公钥进行加密
 */
export function encrypt(input) {
    return rsaEncrypt(input, PUBLIC_KEY);
}

/**
 * 认证用户
 * @param account {string}
 * @param password {string}
 */
export function auth(account: string, password: string, ostype: number, vcodeinfo?: Core.APIs.EACHTTP.Auth1.VcodeInfo): Promise<Core.APIs.EACHTTP.AuthInfo> {
    return getNew({
        account,
        password: encrypt(password),
        deviceinfo: {
            ostype: ostype
        },
        vcodeinfo
    });
}


/**
 * 登录并获取用户信息
 * @param account {string}
 * @param password {string}
 */
export function login(account: string, password: string, ostype: number, vcodeinfo?: Core.APIs.EACHTTP.Auth1.VcodeInfo): Promise<Core.User.UserInfo> {
    return auth(account, password, ostype, vcodeinfo).then(({ userid, tokenid }) => {
        return getFullInfo(userid, tokenid);
    })
}


/**
 *重定向
 */
export function redirect(): void {
    getConfig('thirdauth').then(res => {
        if (res && res.config) {
            location.replace(res.config.authServer);
        }
    })
}

/**
 * 获取第三方配置
 */

export function getAuth(): Promise<any> {
    return getConfig('thirdauth').then(thirdAuth => {
        return thirdAuth;
    });
}

/**
 * 获取地第三方认证ID
 */

export function getID(): Promise<string> {
    return getAuth().then(thirdAuth => {
        return thirdAuth.id;
    })
}

/**
 * 获取登录用户类型
 */
export function getUserType(): Promise<number> {
    return getUser({}).then(({ usertype }) => usertype)
}

/**
 * 第三方认证的参数
 */
export function authByParams(params: any, ostype) {
    return getID().then(id => {
        return getByThirdParty({
            thirdpartyid: id,
            params: mapValues(params, decodeURIComponent),
            deviceinfo: {
                ostype: ostype ? ostype : OS_TYPE.WEB
            }
        })
    })
}

/**
 * 认证并登陆
 */
export function loginByParams(params = {}, ostype): Promise<any> {
    return authByParams(params, ostype).then(({ userid, tokenid }) => {
        return getFullInfo(userid, tokenid);
    })
}

/**
 * 信任的第三方应用appid认证
 */
export function extLogin({ account, appid, key }) {
    return extLoginClient({ account, appid, key }).then(({ userid, tokenid }) => {
        return getFullInfo(userid, tokenid);
    })
}

/**
 * 解析第三方ticket
 */
export function pathArgs(path: string): any {
    let pathArg = path.replace(/^#/, '').replace(/^\/|\/$/g, '').split('?');
    let pathArgs = path ? zipObject(map(pathArg[1].split('&'), kv => {
        return kv.split('=');
    })) : {};
    return pathArgs
}

/**
 * 清除会话cookie
 */
export function clear(): void {
    session.remove('login');
}

/**
 * 构造认证URL
 * @param redirectURI 本地重定向URI，如在客户端进行认证后登录到控制台
 * @return 认证地址
 */
export function buildURI(redirectURI?: string): Promise<string> {
    return getConfig('thirdauth').then(function (thirdauth) {
        let authServer = thirdauth.config.authServer;
        return redirectURI ?
            authServer + '?redirect_uri=' + redirectURI : authServer;
    });
}


/**
 * 获取金智认证版本
 */
export function getVersion(): Promise<string> {
    return getID().then(function (id) {
        switch (id) {
            case 'wisedu_v4':
                return 'v4';
            case 'wisedu_sync':
                return 'v5';
        }
    });
}

/**
 * 构建退出URL
 * @param redirectURI {string} 重定向目的地
 * @param [thirdLogout=true] {boolean} 是否调用第三方注销接口
 * @return {<string> Promise} 返回登出的URL
 */
export function buildLogoutUrl(redirectURI: string, thirdLogout: boolean): Promise<string> {
    return Promise.all([
        getConfig('thirdauth'),
        buildURI(redirectURI),
        getVersion()
    ]).then(function ([thirdauth, uri, version]) {
        if (thirdLogout) {
            if (thirdauth.logoutUrl) {
                return thirdauth.logoutUrl;
            } else if (version === 'v4') {
                // 金智认证V4用户（目前仅西南交大），直接返回AnyShare登录
                return thirdauth.config.oauthServer.replace(/Login$/, 'Logout') + '?goto=' + uri;
            } else {
                return thirdauth.config.oauthServer.replace(/login$/, 'logout') + '?service=' + uri;
            }
        } else {
            return '/';
        }

    });
}

/**
 * wisedu注销
 */
export function wiseduLogoff(redirectURI: string, thirdLogout: boolean, { doNotLogoffToken } = {}): Promise<any> {
    return buildLogoutUrl(redirectURI, thirdLogout).then(function (url) {
        // 金智认证V4，删除注入的Cookie
        if (cookie.load('iPlanetDirectoryPro')) {
            cookie.remove('iPlanetDirectoryPro');
        }

        authlogout({ doNotLogoffToken });

        return url;

    });
}


/**
 * 本地注销登录
 * @param doNotLogoffToken 不要注销token，外部平台跳转登录不调用注销，避免外部平台Token被一并注销
 */
export function authlogout({ doNotLogoffToken = false } = {}): Promise<any> {
    const ostype = OS_TYPE.WEB;

    if (doNotLogoffToken) {
        return Promise.resolve(clear());
    } else {

        return logout({ ostype }).then(function () {
            clear();
        }, function (xhr) {
            if (/401001|401011|401031|401033|500001/.test(xhr.errcode)) {
                clear();
            }
        })
    }
}

/**
 * 第三方登出
 */
export function thirdauthLogoff({ doNotLogoffToken } = {}): Promise<any> {
    return getConfig('thirdauth').then(function (thirdauth) {

        // 先注销AnyShare登录
        authlogout({ doNotLogoffToken })

        return thirdauth.config
    })

}