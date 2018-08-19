import * as React from 'react';
import { render } from 'react-dom';
import App from './app';
import i18nCore from '../core/i18n';
import i18nUI from '../ui/i18n';
import i18nUtil from '../util/i18n';
import i18nComponents from '../components/i18n';
import { setup as setupClientAPI } from '../core/clientapi/clientapi';
import { getLanguageInfo } from '../core/apis/client/config/config';
import { setup as setupOpenAPI } from '../core/openapi/openapi';
import { getGlobalServer, getLocalServerById } from '../core/apis/client/config/config';
import i18nWindows from './i18n';

export default function (service, root) {
    return new Promise(async resolve => {
        setupClientAPI({
            host: 'http://127.0.0.1:10081',
            onException: (ex) => console.error(ex),
        });

        const { globalServerConfig: { lastServer } } = await getGlobalServer();
        const { localServerConfig: { eacpPort, efspPort, userId } } = await getLocalServerById({ serverId: lastServer });

        const { language: locale } = await getLanguageInfo()

        i18nUI.setup({ locale });
        i18nCore.setup({ locale });
        i18nComponents.setup({ locale });
        i18nUtil.setup({ locale });
        i18nWindows.setup({ locale });

        setupOpenAPI({
            host: `https://${lastServer}`,
            EACPPort: eacpPort,
            EFSPPort: efspPort,
            userid: userId,
        });

        render(
            <App
                service={service}
            />,
            root,
            resolve
        )
    })
}