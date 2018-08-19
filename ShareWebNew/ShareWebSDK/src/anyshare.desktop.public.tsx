import AnyShareFactory from './anyshare.base';
import OpenAPI from '../core/apis/openapi/openapi';
import SSO from '../components/SSO/component.desktop';
import DocSelector from '../components/DocSelector/component.desktop';
import Preview from '../components/Preview/component.desktop';
import OWAPreview from '../components/OWAPreview/component.desktop'
import Play from '../components/Play/component.desktop';
import Image from '../components/Image/component.desktop';
import LinkShare from '../components/LinkShare/component.desktop';
import Upload from '../components/WrapperedUpload/component.desktop';
import Download from '../components/Download/component.desktop';
import DocTree from '../components/DocTree/component.desktop';
import Share from '../components/Share/component.desktop';
import Copy from '../components/Copy/component.desktop';
import Move from '../components/Move/component.desktop';

module.exports = AnyShareFactory({
    OpenAPI,
    Components: {
        SSO,
        DocSelector,
        Image,
        Preview,
        OWAPreview,
        Play,
        LinkShare,
        Upload,
        Download,
        DocTree,
        Share,
        Copy,
        Move,
    }
});