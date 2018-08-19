import * as React from 'react'
import { render } from 'react-dom'
import Routes from './routes'
import { AppContainer } from 'react-hot-loader'
import { apply as applySkin } from '../core/skin/skin';
import { getCurrentLang } from '../core/language/language'
import { setup } from '../core/openapi/openapi'
import { getOEMConfByOptions } from '../core/oem/oem'
import i18nCore from '../core/i18n'
import i18nUI from '../ui/i18n'
import i18nUtil from '../util/i18n'
import { setFavicon } from '../util/browser/browser'
import i18nComponents from '../components/i18n'
import '../libs/reset.css'
import '../libs/root.css'
import './root.css'
import i18nMobile from './i18n'

setup({
    host: 'http://192.168.138.45'
})

async function boot() {
    // 设置当前语言
    const { language: locale } = await getCurrentLang()

    i18nUI.setup({ locale });
    i18nCore.setup({ locale });
    i18nComponents.setup({ locale });
    i18nUtil.setup({ locale });
    i18nMobile.setup({ locale });

    applySkin()

    const favicon = (await getOEMConfByOptions(['favicon.ico']))['favicon.ico']
    setFavicon(`data:image/png;base64,${favicon}`)

    render(
        <AppContainer>
            <Routes />
        </AppContainer>,
        document.getElementById('root')
    )

    if (module.hot) {
        module.hot.accept('./routes', () => {
            const NextRoutes = require('./routes').default
            render(
                <AppContainer>
                    <NextRoutes />
                </AppContainer>,
                document.getElementById('root')
            )
        })
    }
}

boot()