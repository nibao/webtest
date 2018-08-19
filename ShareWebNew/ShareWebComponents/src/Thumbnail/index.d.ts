declare namespace Components {
    namespace Thumbnail {

        type extType = 'WORD' | 'EXCEL' | 'PPT' | 'PDF' | 'TXT' | 'IMG' | 'ARCHIVE' | 'VIDEO' | 'AUDIO' | 'EXE' | 'DIR' | 'UNKNOWN' | 'LOGO' | 'USERDOC' | 'SHAREDOC' | 'GROUPDOC' | 'CUSTOMDOC' | 'ARCHIVEDOC' | 'UNSYNCDOC' | ''
        interface Props {

            className?

            /**文档对象 */
            doc?: APIs.EFSHTTP.Doc | null

            /** 图标大小 */
            size?: number

            /** 缩略图质量 */
            quality?: number

            /** 文件类型， 优先读取文件类型， 否则根据文件名查找类型*/
            type?: extType

            fallback?: any

            errorFallback?: any

            onClick?: (e: React.SyntheticEvent<any>) => any

            onThumbnailLoad?: (e: React.SyntheticEvent<any>) => any

            onThumbnailError?: (e: React.SyntheticEvent<any>) => any

            style?: React.CSSProperties

            [key: string]: any
        }

        interface State {

            /** 图标url */
            iconSrc: string

            /** 缩略图url */
            thumbnailSrc: string

            /** 缩略图加载成功 */
            thumbnailLoaded: boolean
        }
    }
}