import * as React from 'react'
import { includes } from 'lodash'
import { findType } from '../../core/extension/extension'
import { getOpenAPIConfig } from '../../core/openapi/openapi'
import { joinURL } from '../../util/http/http'
import { isDir, docname } from '../../core/docs/docs'

const Types: Array<Components.Thumbnail.extType> = [
    /** 文件类型 */
    'WORD',
    'EXCEL',
    'PPT',
    'PDF',
    'TXT',
    'IMG',
    'ARCHIVE',
    'VIDEO',
    'AUDIO',
    'EXE',
    'CAD',

    /** 文件夹 */
    'DIR',

    /** 未知类型 */
    'UNKNOWN',

    /** oem logo */
    'LOGO',

    /** 文件分类类型 */
    'USERDOC',
    'SHAREDOC',
    'GROUPDOC',
    'CUSTOMDOC',
    'ARCHIVEDOC',

    /** 未同步文档 */
    'UNSYNCDOC'
]

/** 图标资源 */
const Icons = Types.reduce((preIcons, type) => ({
    ...preIcons,
    [type]: require(`./assets/images/${type}.png`)
}), {})

export default class ThumbnailBase extends React.Component<Components.Thumbnail.Props, Components.Thumbnail.State>{

    static defaultProps = {
        size: 64,
        quality: 50,
        type: ''
    }

    state = {
        iconSrc: '',
        thumbnailSrc: '',
        thumbnailLoaded: false
    }

    componentWillMount() {
        const { doc, size, quality, type, fallback, nostatistic } = this.props
        this.buildThumbnail({ doc, size, quality, type, fallback, nostatistic })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.doc !== this.props.doc) {
            this.buildThumbnail(nextProps)
        }
    }

    /** 构造缩略图 */
    private buildThumbnail({ doc, size, quality, type, fallback, nostatistic }) {
        let thumbnailSrc = ''

        if (doc) {
            const { host, EFSPPort, userid, tokenid } = getOpenAPIConfig(['host', 'EFSPPort', 'userid', 'tokenid'])
            const { link, password, docid, rev } = doc

            if (!includes(Types, type)) {
                switch (true) {
                    case typeof doc.doc_type === 'string':
                        type = doc.doc_type.toUpperCase()
                        break
                    case typeof doc.doctype === 'string':
                        type = doc.doctype.toUpperCase()
                        break
                    case isDir(doc):
                        type = 'DIR'
                        break
                    default:
                        type = findType(docname(doc)) || 'UNKNOWN'
                        break
                }
            }

            if (docid) {

                if (type === 'VIDEO') {
                    /** 视频缩略图 */
                    thumbnailSrc = joinURL(`${host}:${EFSPPort}/v1/${link ? 'link' : 'file'}`, {
                        method: 'playthumbnail',
                        docid,
                        rev,
                        ...(link ? {} : { userid, tokenid }),
                        /** 缩略图禁用缓存 */
                        hash: Math.random()
                    })
                } else if (type === 'IMG') {
                    /** 图片缩略图 */
                    thumbnailSrc = joinURL(`${host}:${EFSPPort}/v1/${link ? 'link' : 'file'}`, {
                        method: 'thumbnail',
                        docid,
                        rev,
                        width: size,
                        height: size,
                        quality,
                        ...(link ? { link, password } : { userid, tokenid }),
                        /** 缩略图禁用缓存 */
                        hash: Math.random(),
                        /**是否进行预览统计 */
                        nostatistic: nostatistic
                    })
                }
            }
        }

        this.setState({
            iconSrc: typeof fallback === 'undefined' ? Icons[type] || Icons['UNKNOWN'] : fallback,
            thumbnailSrc,
            thumbnailLoaded: false
        })
    }

    /** 缩略图加载成功 */
    protected handleThumbnailLoaded(e) {
        if (typeof this.props.onThumbnailLoad === 'function') {
            this.props.onThumbnailLoad(e)
        }
        this.setState({
            thumbnailLoaded: true
        })
    }

    /**
     * 缩略图加载失败
     * @param e 
     */
    protected handleThumbnailError(e) {
        const { onThumbnailError, errorFallback } = this.props

        if (typeof onThumbnailError === 'function') {
            onThumbnailError(e)
        }

        if (errorFallback) {
            this.setState({
                iconSrc: errorFallback
            })
        }
    }
}