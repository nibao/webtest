import __ from './locale.ts';

export function caAuth(account, config) {
    let promise = new Promise((resolve, reject) => { }),
        componentCA;

    try {
        componentCA = new ActiveXObject("IAccount.DeskEngine");
        componentCA.SetManager(config.authServer, config.appId, config.appKey)
        if (!componentCA.CheckCertLogin()) {
            promise.reject(__('意源证书认证失败，请联系意源的技术人员检查。'));
        } else {
            if (account !== componentCA.AppUserName) {
                promise.reject(__('该用户名与此KEY不匹配，请重新输入。'));
            } else {
                promise.resolve();
            }
        }
    } catch (err) {
        if (window.ActiveXObject === undefined) {
            promise.reject(__('访问失败。请检查是否已安装认证设备驱动，或者手工调低IE浏览器控件安全级别'));
        } else {
            promise.reject(__('该认证设备仅支持在IE浏览器下访问，请切换至IE浏览器'));
        }
    }

    return promise;
}