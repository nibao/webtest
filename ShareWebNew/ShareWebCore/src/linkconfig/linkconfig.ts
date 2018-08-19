import { formatTime } from '../../util/formatters/formatters';
import { get as getUser } from '../user/user';
import { getOpenAPIConfig } from '../openapi/openapi';
import { getHostInfo } from '../apis/eachttp/redirect/redirect';
import { sendMail } from '../apis/eachttp/message/message';
import { getOEMConfByOptions } from '../oem/oem';
import { getConfig } from '../config/config';
import { docname, isDir } from '../docs/docs';
import __ from './locale';

/**
 * 原子权限
 */
export const PERMISSIONS: Array<Core.LinkConfig.Perm> = [
    {
        name: __('预览'),
        value: 1,
        require: []
    },
    {
        name: __('下载'),
        value: 2,
        require: [1]
    },
    {
        name: __('上传'),
        value: 4,
        require: []
    }
];

export function getFinalPerm(perms): number {
    return perms.reduce((permValue, perm) => {
        if (perm.checked) {
            return permValue + perm.value;
        } else {
            return permValue;
        }
    }, 0)
}

/**
 * 构造外链地址
 * @param link 外链id
 */
export async function buildLinkHref(link: string): Promise<string> {
    const [https, { host, https_port, port }] = await Promise.all([getConfig('https'), getHostInfo(null)]);

    return `${https ? 'https' : 'http'}://${host}:${https ? https_port : port}/link/${link}`;
}

/**
 * 构造二维码下载链接
 */
export function buildQRCodeHref(text: string, format: string, name: string): Promise<string> {
    return Promise.all([getConfig('https'), getHostInfo(null)]).then(([https, { host, port, https_port }]) => {
        return `${https ? 'https' : 'http'}://${host}:${https ? https_port : port}/api/qrcode?format=${format}&text=${text}&name=${name}`
    })
}

/**
 * 构造邮件
 * @param params 邮件参数
 */
export async function writeMail({ doc, link, password, endtime, accesscode, enableLinkAccessCode }) {
    const [{ product }, { name: sender }, href] = await Promise.all([
        getOEMConfByOptions(['product']),
        getUser(getOpenAPIConfig(['userid', 'tokenid'])),
        buildLinkHref(link),
    ]);
    const subject = isDir(doc) ?
        __('${sender} 用${product}给您共享了一个文件夹', { sender, product }) :
        __('${sender} 用${product}给您共享了一个文件', { sender, product });
    const title = enableLinkAccessCode ?
        `${__('提取码：')}<i class="code-font">${accesscode}</i>` :
        `${__('点击查看：')}<a href="${href}">${href}</a>`

    return {
        subject,
        content: `
            <style>
                .mail {
                    margin-top: 30px;
                    margin-left: 30px;
                    display: inline-block;
                    border: 1px solid #c0c0c0;
                    padding:10px;
                }
                .mail > h1 {
                    font-weight: normal;
                    font-size: inherit;
                }
                .mail > h1 > em {
                    font-weight: bolder;
                }
                
                .mail > div > span {
                    color:#ac000e;
                }
                .mail > div {
                    margin-top: 15px;
                }
                .hidden {   
                    display:none;
                }
                .tip {
                    margin-top:20px;
                    color:#6d6d6d;
                }
                .code-font {
                    font-size: 16px;
                    font-weight: bold;
                }
                .mail > div > i {
                    font-style:normal;
                }
            </style>
            <div class="mail">
                <h1><strong>${sender}</strong>　${isDir(doc) ? __('用${product}给您共享了一个文件夹：', { product }) : __('用${product}给您共享了一个文件：', { product })}${docname(doc)}</h1>
                <div>
                    ${title}
                </div>
                <div class="${!password && 'hidden'}">
                    ${ __('访问密码：${password}', { password })}
                </div>
                <div>
                    ${__('有效期限：')}<span>${formatTime(endtime / 1000, 'yyyy-MM-dd')}</span>
                </div>
                <div class="tip">${__('(如果您的浏览器没正常打开此页面，请将链接复制后粘贴到浏览器地址栏)')}</div>
                <div class="tip">${__('此为系统邮件，无需回复。')}</div>
            </div>
        `
    }
}

/**
 * 发送邮件
 * @param params 邮件参数
 */
export async function mail({ doc, link, password, endtime, accesscode, mailto, enableLinkAccessCode }) {
    return sendMail({
        mailto,
        ...(await writeMail({
            doc,
            link,
            password,
            endtime,
            accesscode,
            enableLinkAccessCode,
        }))
    });
}