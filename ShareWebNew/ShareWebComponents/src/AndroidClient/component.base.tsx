import { useHTTPS } from '../../util/browser/browser';
import { ClientTypes } from '../../core/clients/clients';
import { download } from '../../core/apis/eachttp/update/update';
import WebComponent from '../webcomponent';

export default class AndroidClientBase extends WebComponent<any, any>{
    async componentWillMount() {
        try {
            const { URL } = await download({ osType: ClientTypes.ANDROID, reqhost: location.hostname, usehttps: useHTTPS() });
            this.props.onClientDownload(URL);
        } catch (e) {
            if(e.errcode === 404016){
                this.props.onClientMiss(e.errmsg);
            }
        }

    }
}