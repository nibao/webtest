import * as React from 'react';
import cookie from 'react-cookie';
import { render } from 'react-dom';
import { setup, ECMSManagerClient, createShareMgntClient } from '../core/thrift2/thrift2';
import { setup as setupOpenApi } from '../core/openapi/openapi';
import { apply as applySkin } from '../core/skin/skin';
import { getOEMConfByOptions } from '../core/oem/oem';
import { getCurrentLang } from '../core/language/language';
import { setFavicon } from '../util/browser/browser';
import i18nCore from '../core/i18n';
import i18nUI from '../ui/i18n';
import i18nUtil from '../util/i18n';
import i18nComponents from '../components/i18n';
import i18nConsole from '../console/i18n';
import Routes from './routes';

async function bootstrap() {
    // 启动主程序前获取应用主节点ip，在应用节点调用OpenAPI
    const appIp = (await ECMSManagerClient.get_app_master_node_ip());
    if (appIp !== '') {
        setupOpenApi({
            host: `${location.protocol}//${await createShareMgntClient({ ip: appIp }).GetHostName()}`
        })
        // 设置当前语言
        const { language: locale } = await getCurrentLang()

        i18nUI.setup({ locale });
        i18nCore.setup({ locale });
        i18nUtil.setup({ locale });
        i18nComponents.setup({ locale });
        i18nConsole.setup({ locale });

        applySkin();
        const favicon = (await getOEMConfByOptions(['favicon.ico']))['favicon.ico']
        setFavicon(`data:image/png;base64,${favicon}`)
    }

    setup({ CSRFToken: cookie.load('csrftoken') });
    render(
        <Routes />,
        document.getElementById('root')
    )
}

bootstrap()
