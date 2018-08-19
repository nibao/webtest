/**
 * develop 入口文件
 */

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Routes from './routes'
import { apply as applySkin } from '../core/skin/skin'
import { efshttp, eachttp } from '../core/openapi/openapi'
import { init as initPDF } from '../core/preview/preview'
import { getOEMConfByOptions } from '../core/oem/oem'
import { setFavicon } from '../util/browser/browser'
import { getCurrentLang } from '../core/language/language';
import i18nCore from '../core/i18n';
import i18nUI from '../ui/i18n';
import i18nUtil from '../util/i18n';
import i18nComponents from '../components/i18n';
import i18nClient from './i18n'
import * as _ from 'lodash'
import '../libs/reset.css'
import '../libs/root.css'
import './root.css'

_.assign(window, { efshttp, eachttp, _, React, ReactDOM })


async function boot() {
    applySkin()
    // 设置当前语言
    const { language: locale } = await getCurrentLang()

    i18nUI.setup({ locale });
    i18nCore.setup({ locale });
    i18nUtil.setup({ locale });
    i18nComponents.setup({ locale });
    i18nClient.setup({ locale });

    const favicon = (await getOEMConfByOptions(['favicon.ico']))['favicon.ico']
    setFavicon(`data:image/png;base64,${favicon}`)

    /**
     * 加载pdf文档字体
     */

    if (typeof PDFJS !== 'undefined') {
        initPDF({
            cMapUrl: '/libs/pdfjs-dist/cmaps/',
            cMapPacked: true,
            workerSrc: '/libs/pdfjs-dist/build/pdf.worker.entry.js'
        });
    }

    ReactDOM.render(
        <Routes />,
        document.getElementById('root')
    )
}

boot()