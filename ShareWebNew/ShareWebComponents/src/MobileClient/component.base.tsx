import { useHTTPS, Browser, userAgent, OSType } from '../../util/browser/browser';
import { ClientTypes } from '../../core/clients/clients';
import { download } from '../../core/apis/eachttp/update/update';
import WebComponent from '../webcomponent';

export default class MobileClientBase extends WebComponent<any, any>{
    async componentWillMount() {
        const { clientType, doClientDownload } = this.props;
        if (userAgent().app !== Browser.WeChat) {
            try {
                if (clientType === OSType.IOS) {
                    const URL = 'https://itunes.apple.com/cn/app/anyshare/id724109340';
                    doClientDownload(URL);
                } else if (clientType === OSType.Android) {
                    const { URL } = await download({ osType: ClientTypes.ANDROID, reqhost: location.hostname, usehttps: useHTTPS() });
                    doClientDownload(URL);
                }
            } catch (e) {
                if (e.errcode === 404016) {
                    this.props.onClientMiss(e.errmsg);
                }
            }
        }
    }
}
