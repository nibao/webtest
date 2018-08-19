import * as React from 'react'
import Message from '../../../components/Message2/component.desktop'
import { isDir } from '../../../core/docs/docs'
import { openDoc } from '../../helper'
import { MessageType } from '../../../core/message/message'

/**
 * 预览文件
 * @param doc 
 */
const handlePreview = async function (doc) {
    openDoc(doc, { newTab: !isDir(doc) })
}

/**
 * 打开文件所在目录
 * @param doc 
 */
const handleRedirect = async function (doc) {
    openDoc(doc)
}

/**
 * 跳转至审核界面
 */
const handleCheck = async function () {
    let path = '/home/approvals/share-review'
    window.open(`/#${path}`)
}

export function ShareMessages(props) {
    return (
        <Message
            {...props}
            showMsgType={MessageType.Share}
            doPreview={handlePreview}
            doRedirect={handleRedirect}
        />
    )
}

export function SecurityMessages(props) {
    return (
        <Message
            {...props}
            showMsgType={MessageType.Security}
            doPreview={handlePreview}
            doRedirect={handleRedirect}
        />
    )
}

export function CheckMessages(props) {
    return (
        <Message
            {...props}
            showMsgType={MessageType.Check}
            // doPreview={handlePreview}
            doRedirect={handleRedirect}
            doCheck={handleCheck}
        />
    )
}