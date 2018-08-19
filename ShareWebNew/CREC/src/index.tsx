import * as React from 'react'
import { render } from 'react-dom'
import { setup } from '../core/openapi/openapi'
import { login, extLogin } from '../core/auth/auth'
import * as fs from '../core/filesystem/filesystem'
import { create as createDir } from '../core/apis/efshttp/dir/dir'
import { docname } from '../core/docs/docs'
import Upload from '../components/Upload/component.desktop'
import { subscribe, EventType } from '../core/upload/upload'
import { getDetail, open as openLink } from '../core/apis/efshttp/link/link'
import { buildLinkHref } from '../core/linkconfig/linkconfig'
import { bindEvent } from '../util/browser/browser'
import * as md5 from 'js-md5'
import '../libs/reset.css'
import '../libs/root.css'
import './root.css'

/**
 * 获取文件外链并插入邮件
 * @param param0 
 */
async function attachFileLink({ file }) {
    let linkInfo = await getDetail({ docid: file.docid })
    if (!linkInfo.link) {
        linkInfo = await openLink({ docid: file.docid })
    }
    const href = await buildLinkHref(linkInfo.link)

    /**
     * owa 邮件编辑 iframe 的 document
     */
    let OwaEditorDocument: HTMLDocument

    try {
        const OwaEditor = $('divFmtBr').getExpando('formatBar')
        OwaEditorDocument = OwaEditor._oEditor._oDomNode
    } catch (e) {
        OwaEditorDocument = document
    }

    let asAttachment = OwaEditorDocument.getElementById('as-attachment')

    if (!asAttachment) {
        asAttachment = OwaEditorDocument.createElement('div')
        asAttachment.id = 'as-attachment';
        (OwaEditorDocument.querySelector('body') as HTMLBodyElement).appendChild(asAttachment)
        const hr = OwaEditorDocument.createElement('hr')
        asAttachment.appendChild(hr)
    } else {
        const br = OwaEditorDocument.createElement('br')
        asAttachment.appendChild(br)
    }

    const aTag = OwaEditorDocument.createElement('a')
    aTag.href = href
    aTag.innerHTML = file.name

    asAttachment.appendChild(aTag)
}

/**
 * 登录
 */
async function loginAs({ host, appid, key, account, password }) {

    let userid = '',
        tokenid = ''

    setup({
        host,
        userid() { return userid },
        tokenid() { return tokenid }
    })

    const loginInfo = appid && key ?
        await extLogin({ account, appid, key: md5(`${appid}${key}${account}`) }) :
        await login(account, password, 6)

    userid = loginInfo.userid
    tokenid = loginInfo.tokenid

    return loginInfo
}

/**
 * 挂载上传组件
 */
async function boot() {

    /**
     * 覆写 Array.isArray, exchange 2010中的 Array.isArray 会将 NodeList 判断为 数组
     */
    const msIsArray = Array.isArray
    Array.isArray = function (arr) {
        if (typeof NodeList !== 'undefined') {
            return msIsArray(arr) && !(arr instanceof NodeList)
        }
        return msIsArray(arr)
    }

    try {

        const {
            host = 'http://192.168.138.40',
            appid = '',
            key = '',
            account = 'jiale',
            password = '111111',
            baseUrl = '.'
        } = (await (typeof window.AsConfig === 'function' ? window.AsConfig() : window.AsConfig)) || {}

        const loginInfo = await loginAs({ host, appid, key, account, password })

        const userdoc = (await fs.list()).dirs.find(dir => docname(dir) === loginInfo.name)

        if (userdoc) {

            const dest = await createDir({ docid: userdoc.docid, name: `{Outlook 附件}`, ondup: 3 })

            const
                divTB = document.getElementById('divTB') as HTMLDivElement,
                divToolbarButtonaddressbook = document.getElementById('divToolbarButtonaddressbook') as HTMLDivElement

            const mountNode = document.createElement('div')
            const divToolbarButtonaddasfile = document.createElement('div')
            const tbSpN = document.createElement('div')

            divToolbarButtonaddasfile.className = 'tbf fltBefore tbfHvr'
            tbSpN.className = 'tbSpN fltBefore'

            divTB.insertBefore(tbSpN, divToolbarButtonaddressbook)
            divTB.insertBefore(divToolbarButtonaddasfile, tbSpN)

            const body = document.querySelector('body') as HTMLBodyElement
            body.appendChild(mountNode)

            render(<Upload swf={`${baseUrl}/libs/Uploader.swf`} />, mountNode)
            render(<Upload.Picker dest={dest} style={{ lineHeight: '23px' }}>大附件</Upload.Picker>, divToolbarButtonaddasfile)

            /**
             * 上传成功添加文件外链
             */
            subscribe(EventType.UPLOAD_SUCCESS, attachFileLink)
        }
    } catch (e) {
        console.error(e)
    }
}

bindEvent(window, 'load', boot)