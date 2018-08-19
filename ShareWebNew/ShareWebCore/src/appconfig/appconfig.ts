'use strict';

/**
 * Application 配置服务
 */
import * as http from '../../util/http/http';
import { loadCSS, loadScript } from '../../util/browser/browser';

/**
 * App配置项
 */
interface Conf {
    // 内链地址前缀
    prefix?: string;

    // 是否允许首页显示第三方登录按钮
    enablesso?: boolean;

    // 第三方脚本
    scripts?: {
        ShareWebClient?: string[];
        ShareWebConsole?: string[];
    };

    // 第三方样式表
    styles?: {
        ShareWebClient?: string[];
        ShareWebConsole?: string[];
    };

    // 标签页配置
    tabs?: Array<any>,

    tabGroups?: Array<any>
}

/**
 * 配置缓存
 */
let CONF: Conf = null;

/**
 * 根配置
 */
let ROOT_CONF = null;


/**
 * 只加载一次
 */
let LOADED = false;


/**
 * 获取根配置
 */
function getRootConf() {
    // 获取OEM配置（指向特定版本）
    return ROOT_CONF || (ROOT_CONF = http.get('/res/conf/conf.json'));
}

/**
 * 合并oem和默认标签页配置
 */
function tabsCover(defaultTabs, oemTabs) {
    return oemTabs ? {tabs: _.map(defaultTabs, tab => _.assign({}, tab, _.find(oemTabs, {name: tab.name})))} : {};
}

/**
 * 获取配置
 * @return {Promise<Object>}
 */
export function get(item): Promise<Conf> {
    const conf = CONF || (
        CONF = Promise.all([
            getRootConf(),
            http.get('/res/conf/default/conf.json', null, { readAs: 'json'})
        ]).then(([rootConf, defaultConf]) => {
            if (rootConf.oem) {
                //返回特定OEM或者default中的conf.json文件(内容为CONF结构体)
                return http.get(`/res/conf/${rootConf.oem}/conf.json`).then(oemConf => _.assign({}, defaultConf, oemConf, tabsCover(defaultConf.tabs, oemConf.tabs)));
            } else {
                return defaultConf;
            }
        })
    );

    return item ? conf.then(json => json[item]) : conf;
}


/**
 * 加载配置
 * @param app {string} app名字
 */
export function load(app: string) {
    if (!app.match(/ShareWebClient|ShareWebConsole/)) { return; }
    if (!LOADED) {
        LOADED = true;
        Promise.all([
            getRootConf(),
            get()
        ]).then(([rootConf, conf]) => {
            if (conf.scripts) {
                _.forEach((conf.scripts[app] || []), script => loadScript(require.toUrl(`/res/conf/${rootConf.oem}/` + script)));
            }

            if (conf.styles) {
                _.forEach((conf.styles[app] || []), style => loadCSS(require.toUrl(`/res/conf/${rootConf.oem}/` + style)));
            }
        });
    }
}