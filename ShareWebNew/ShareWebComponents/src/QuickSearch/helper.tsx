import * as React from 'react';
import { docname } from '../../core/docs/docs';
import { findType } from '../../core/extension/extension';
import Icon from '../../ui/Icon/ui.desktop';
import * as iconWord from './assets/icon-doc-word.png';
import * as iconExcel from './assets/icon-doc-excel.png';
import * as iconPPT from './assets/icon-doc-ppt.png';
import * as iconPDF from './assets/icon-doc-pdf.png';
import * as iconTXT from './assets/icon-doc-txt.png';
import * as iconIMG from './assets/icon-doc-img.png';
import * as iconArchive from './assets/icon-doc-rar.png';
import * as iconVideo from './assets/icon-doc-video.png';
import * as iconAudio from './assets/icon-doc-audio.png';
import * as iconExe from './assets/icon-doc-exe.png';
import * as iconOther from './assets/icon-doc-other.png';
import * as iconCAD from './assets/icon-doc-cad.png';
import * as iconPsd from './assets/icon-doc-psd.png';
import * as iconHtml from './assets/icon-doc-html.png';
import * as iconVisio from './assets/icon-doc-visio.png';

/**
 * 获取扩展名对应图标
 * @param doc 文档对象
 * @return 返回Icon组件
 */
export function getIcon(doc: Core.Docs.Doc, { size = 20 } = {}): string {
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
            return <Icon size={size} url={iconPsd} />

        case 'HTML':
            return <Icon size={size} url={iconHtml} />

        case 'VISIO':
            return <Icon size={size} url={iconVisio} />

        default:
            return <Icon size={size} url={iconOther} />

    }

}

/**
 * 文档状态
 */
export enum DocState {
    /**
     * 无状态
     */
    None,

    /**
     * 延迟下载
     */
    DownloadDeferred,

    /**
     * 过期（已下载）
     */
    Expired,

    /**
     * 最新（已下载）
     */
    Latest,

    /**
     * 未同步
     */
    Unsynchronized

}

