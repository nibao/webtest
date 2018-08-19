import { findType } from '../extension/extension'
import { docname } from '../docs/docs'
import { getDownloadURL } from '../download/download'

export async function hgPreview(doc) {
    if (typeof HGPreview !== 'undefined') {
        try {
            const dlURL = await getDownloadURL(doc)
            const params = {
                server: HGAppConfig.server.EOSS,
                url: dlURL.split('9028')[1]//`/hgproxy${dlURL.split('9028')[1]}`
            }
            const type = findType(docname(doc))
            const Methods = {
                'PDF': HGPreview.type.PDF,
                'WORD': HGPreview.type.OFFICE,
                'PPT': HGPreview.type.OFFICE,
                'EXCEL': HGPreview.type.OFFICE
            }
            if (Methods[type]) {
                HGPreview.show(Methods[type], params, alert, alert)
            } else {
                alert('文件格式不支持')
            }
        } catch (e) {
            alert(e.stack)
        }
    }
}