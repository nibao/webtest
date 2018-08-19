import * as React from 'react';
import { isDir, docname } from '../core/docs/docs';
import { isTopView } from '../core/entrydoc/entrydoc';
import { findType } from '../core/extension/extension';
import Icon from '../ui/Icon/ui.desktop';
import * as iconView from '../core/icons/assets/desktop/icon-doc-view.png';
import * as iconDir from '../core/icons/assets/desktop/icon-doc-dir.png';
import * as iconWord from '../core/icons/assets/desktop/icon-doc-word.png';
import * as iconExcel from '../core/icons/assets/desktop/icon-doc-excel.png';
import * as iconPPT from '../core/icons/assets/desktop/icon-doc-ppt.png';
import * as iconPDF from '../core/icons/assets/desktop/icon-doc-pdf.png';
import * as iconTXT from '../core/icons/assets/desktop/icon-doc-txt.png';
import * as iconIMG from '../core/icons/assets/desktop/icon-doc-image.png';
import * as iconArchive from '../core/icons/assets/desktop/icon-doc-archive.png';
import * as iconVideo from '../core/icons/assets/desktop/icon-doc-video.png';
import * as iconAudio from '../core/icons/assets/desktop/icon-doc-audio.png';
import * as iconExe from '../core/icons/assets/desktop/icon-doc-exe.png';
import * as iconFile from '../core/icons/assets/desktop/icon-doc-file.png';
import * as iconCAD from '../core/icons/assets/desktop/icon-cad-file.png';
import * as iconPSD from '../core/icons/assets/desktop/icon-doc-psd.png';
import * as iconVisio from '../core/icons/assets/desktop/icon-doc-visio.png';
import * as iconHTML from '../core/icons/assets/desktop/icon-doc-html.png';

/**
 * 获取扩展名对应图标
 * @param doc 文档对象
 * @return 返回Icon组件
 */
export function getIcon(doc: Core.Docs.Doc, { size = 32 } = {}): string {
    if (isTopView(doc)) {
        return <Icon size={size} url={iconView} />
    } else if (isDir(doc)) {
        return <Icon size={size} url={iconDir} />
    } else {
        switch (findType(docname(doc))) {
            case 'WORD':
                return <Icon size={size} url={iconWord} />

            case 'EXCEL':
                return <Icon size={size} url={iconExcel} />

            case 'PPT':
                return <Icon size={size} url={iconPPT} />

            case 'PDF':
                return <Icon size={size} url={iconPDF} />

            case 'TXT':
                return <Icon size={size} url={iconTXT} />

            case 'IMG':
                return <Icon size={size} url={iconIMG} />

            case 'ARCHIVE':
                return <Icon size={size} url={iconArchive} />

            case 'VIDEO':
                return <Icon size={size} url={iconVideo} />

            case 'AUDIO':
                return <Icon size={size} url={iconAudio} />

            case 'EXE':
                return <Icon size={size} url={iconExe} />

            case 'CAD':
                return <Icon size={size} url={iconCAD} />

            case 'PSD':
                return <Icon size={size} url={iconPSD} />

            case 'VISIO':
                return <Icon size={size} url={iconVisio} />

            case 'HTML':
                return <Icon size={size} url={iconHTML} />

            default:
                return <Icon size={size} url={iconFile} />

        }
    }
}