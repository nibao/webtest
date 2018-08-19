import AnyShareFactory from './anyshare.base';
import OpenAPI from '../core/apis/openapi/openapi';
import SSO from '../components/SSO/component.mobile';
import Login from '../components/Login/component.mobile';
import Image from '../components/Image/component.mobile';
import Preview from '../components/Preview/component.mobile';
import Play from '../components/Play/component.mobile';
import Upload from '../components/Upload/component.mobile';
import Download from '../components/Download/component.mobile';
import DocSelector from '../components/DocSelector/component.mobile';

module.exports = AnyShareFactory({
    OpenAPI,
    Components: {
        SSO,
        Login,
        Image,
        Preview,
        Play,
        Upload,
        Download,
        DocSelector
    }
})