import { hashHistory } from 'react-router'
import { getOEMConfig } from '../config/config'
import { getID, getUserType, authlogout, thirdauthLogoff, wiseduLogoff } from '../auth/auth'
import session from '../../util/session/session'

let Timer

/**
 * get构建客户端Icon code
 */
export enum UserType {
    LocalUser = 1,
    DomainUser = 2,
    ThirdUser = 3
}

/**
 * 重置自动退出定时器
 */
export async function resetTimer() {

    if (Timer) {
        clearTimeout(Timer)
    }

    let time

    time = await getOEMConfig('clientlogouttime')

    if (time > 0) {
        // time 单位为分钟，转为毫秒
        Timer = setTimeout(async () => {
            if (session.get('login')) {
                await logout(url => {
                    session.remove('login');
                    hashHistory.replace(url)
                })
            }
        }, Math.min(Math.pow(2, 31), time * 60 * 1000));
    }
}


/**
 * 登出系统，如果开启了第三方认证，则同时执行第三方的登出接口
 */
export async function logout(onLogoutSuccess: (url: string) => void, doNotLogoffToken = false) {

    const usertype = await getUserType()

    if (usertype !== UserType.ThirdUser) {
        // 非第三方登录的用户，直接本地退出
        await logoffLocal(onLogoutSuccess, doNotLogoffToken);
    } else {
        const id = await getID()

        if (id) {
            if (id === 'wisedu_v4') {
                // 西南交大，登出AnyShare时不注销集成平台
                if (location.hostname.match('swjtu.edu.cn')) {// 判断注销平台
                    await logoffWisedu(undefined, false, onLogoutSuccess, doNotLogoffToken)
                } else {
                    await logoffWisedu(undefined, true, onLogoutSuccess, doNotLogoffToken)
                }
            }
            else if (id === 'wisedu_sync') {
                // wisedu登出
                await logoffWisedu(undefined, true, onLogoutSuccess, doNotLogoffToken)
            }
            else {
                // sso第三方登出
                await logoffThird(onLogoutSuccess, doNotLogoffToken);
            }
        } else {
            // 本地登出
            await logoffLocal(onLogoutSuccess, doNotLogoffToken);
        }
    }
}

/**
 * 本地注销
 */
async function logoffLocal(onLogoutSuccess: (url: string) => void, doNotLogoffToken) {
    await authlogout(doNotLogoffToken)
    onLogoutSuccess('/')
}

/**
 * sso第三方注销
 */
async function logoffThird(onLogoutSuccess: (url: string) => void, doNotLogoffToken) {
    const config = await thirdauthLogoff(doNotLogoffToken)

    let url;

    if (config.logoutUrl) {
        url = config.logoutUrl;
    } else {
        const authserver = config.authServer;
        url = authserver.replace(/login$/, 'logout') + '?service=' + location.protocol + '//' + location.host;
    }

    onLogoutSuccess(url)
}


/**
 * wisedu注销
 */
async function logoffWisedu(redirectURI, thirdLogout, onLogoutSuccess: (url: string) => void, doNotLogoffToken) {
    const url = await wiseduLogoff(redirectURI, thirdLogout, doNotLogoffToken)
    onLogoutSuccess(url)
}