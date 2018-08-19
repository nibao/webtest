/// <reference path="./helper.d.ts" />

import * as React from 'react';
import { render } from 'react-dom';
import { forEach, isString, isArray, isFunction, assign, create } from 'lodash';
import { isDir, docname } from '../core/docs/docs';
import { isTopView } from '../core/entrydoc/entrydoc';
import { findType } from '../core/extension/extension';
import Icon from '../ui/Icon/ui.desktop';
import IconMobile from '../ui/Icon/ui.mobile';
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

import * as iconViewMobile from '../core/icons/assets/mobile/icon-doc-view.png';
import * as iconDirMobile from '../core/icons/assets/mobile/icon-doc-dir.png';
import * as iconWordMobile from '../core/icons/assets/mobile/icon-doc-word.png';
import * as iconExcelMobile from '../core/icons/assets/mobile/icon-doc-excel.png';
import * as iconPPTMobile from '../core/icons/assets/mobile/icon-doc-ppt.png';
import * as iconPDFMobile from '../core/icons/assets/mobile/icon-doc-pdf.png';
import * as iconTXTMobile from '../core/icons/assets/mobile/icon-doc-txt.png';
import * as iconIMGMobile from '../core/icons/assets/mobile/icon-doc-image.png';
import * as iconArchiveMobile from '../core/icons/assets/mobile/icon-doc-archive.png';
import * as iconVideoMobile from '../core/icons/assets/mobile/icon-doc-video.png';
import * as iconAudioMobile from '../core/icons/assets/mobile/icon-doc-audio.png';
import * as iconExeMobile from '../core/icons/assets/mobile/icon-doc-exe.png';
import * as iconFileMobile from '../core/icons/assets/mobile/icon-doc-file.png';
import * as iconCADMobile from '../core/icons/assets/mobile/icon-cad-file.png';

/**
 * 获取扩展名对应图标
 * @param doc 文档对象
 * @return 返回Icon组件
 */
export function getIcon(doc: Core.Docs.Doc, { size = 32 } = {}): React.ReactElement<UI.Icon.Props> {
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


/**
 * 获取扩展名对应移动端图标
 * @param record 文档对象
 * @return 返回Icon组件
 */
export function getMobileIcon(doc: Core.Docs.Doc, { size = '1rem' } = {}): React.ReactElement<UI.Icon.Props> {
    if (isTopView(doc)) {
        return <Icon size={size} url={iconViewMobile} />
    } else if (isDir(doc)) {
        return <Icon size={size} url={iconDirMobile} />
    } else {
        switch (findType(docname(doc))) {
            case 'WORD':
                return <Icon size={size} url={iconWordMobile} />

            case 'EXCEL':
                return <Icon size={size} url={iconExcelMobile} />

            case 'PPT':
                return <Icon size={size} url={iconPPTMobile} />

            case 'PDF':
                return <Icon size={size} url={iconPDFMobile} />

            case 'TXT':
                return <Icon size={size} url={iconTXTMobile} />

            case 'IMG':
                return <Icon size={size} url={iconIMGMobile} />

            case 'ARCHIVE':
                return <Icon size={size} url={iconArchiveMobile} />

            case 'VIDEO':
                return <Icon size={size} url={iconVideoMobile} />

            case 'AUDIO':
                return <Icon size={size} url={iconAudioMobile} />

            case 'EXE':
                return <Icon size={size} url={iconExeMobile} />

            case 'CAD':
                return <Icon size={size} url={iconCADMobile} />

            default:
                return <Icon size={size} url={iconFileMobile} />

        }
    }
}

export const createSharedContext = (ConsumerComponent) => {
    let context;

    return {
        Provider: class extends React.Component<any, any> {

            componentDidMount() {
                context = this.props
            }

            componentWillReceiveProps(next) {
                context = next
            }

            render() {
                return this.props.children
            }
        },

        Consumer: ({ children }) => (
            <ConsumerComponent
                {...context}
            >
                {
                    children
                }
            </ConsumerComponent>
        )
    }
}

export const ClientComponentContext = createSharedContext(({ children, froozen }) => (
    <div>
        {
            children
        }
        {
            froozen ? (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFF',
                    opacity: 0.5
                }}></div>
            ) : null
        }
    </div>
))