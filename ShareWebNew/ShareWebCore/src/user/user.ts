import { get as getUser } from '../apis/eachttp/user/user';

/**
 * 获取用户信息
 * @param params
 * @param params.userid 用户id
 * @param params.tokenid 用户会话token
 */
export function get({ userid, tokenid }) {
    return getUser({}, { userid, tokenid })
}

/**
 * 获取用户信息，并合并userid和tokenid
 * @param userid 用户id
 * @param tokenid 用户会话token
 */
export function getFullInfo(userid: string, tokenid: string): Promise<Core.User.UserInfo> {
    return get({ userid, tokenid }).then((user) => {
        return Object.assign({ userid, tokenid }, user);
    })
}

/**
 * 判断value是否是userid
 */
export function isUserId(value: string): boolean {
    return /^(\d|[a-f]){8}(-(\d|[a-f]){4}){3}-(\d|[a-f]){12}$/.test(value);
}