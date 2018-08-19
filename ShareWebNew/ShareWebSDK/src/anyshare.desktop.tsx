import AnyShareFactory from './anyshare.base';
import OpenAPI from '../core/apis/openapi/openapi';
import SSO from '../components/SSO/component.desktop';
import Preview from '../components/Preview2/component.desktop';
import OWAPreview from '../components/OWAPreview/component.desktop'
import Play from '../components/Play/component.desktop';
import Image from '../components/Image/component.desktop';
import LinkShare from '../components/LinkShare/component.desktop';
import Upload from '../components/Upload/component.desktop';
import Download from '../components/Download/component.desktop';
import DocTree from '../components/DocTree/component.desktop';
import DocSelector from '../components/DocSelector/component.desktop';
import DocsGrid from '../components/DocsGrid2/component.desktop';
import AttributesPicker from '../components/AttributesPicker/component.desktop';
import EnumPicker from '../components/EnumPicker/component.desktop';
import ExtraMetaInfo from '../components/ExtraMetaInfo/component.desktop';
import DocProperties from '../components/DocProperties/component.desktop';
import ShareInvitation from '../components/ShareInvitation/component.desktop';
import ShareJoin from '../components/ShareJoin/component.desktop';
import Message from '../components/Message/component.desktop';
import Share from '../components/Share/component.desktop';
import AccessCode from '../components/AccessCode/component.desktop';
import Copy from '../components/Copy/component.desktop';
import Move from '../components/Move/component.desktop';
import LinkPassword from '../components/LinkPassword/component.desktop';
import Delete from '../components/Delete/component.desktop';
import Auth from '../components/Auth/component.desktop';
import SaveTo from '../components/SaveTo/component.desktop';
import Login from '../components/Login/component.desktop';
import ViewSize from '../components/ViewSize/component.desktop';
import CreateFolder from '../components/CreateFolder/component.desktop';
import ThirdLogin from '../components/ThirdLogin/component.desktop';
import Index from '../components/Index/component.desktop';
import ClientsDownload from '../components/ClientsDownload/component.desktop';
import MobileClient from '../components/MobileClient/component.desktop';
import LinkDownloads from '../components/LinkDownloads/component.desktop';
import Authorize from '../components/Authorize/component.desktop';
import Quit from '../components/Quit/component.desktop';
import Reg from '../components/Reg/component.desktop';
import UserAgreement from '../components/UserAgreement/component.desktop';
import GroupManage from '../components/GroupManage/component.desktop';
import IsolationZone from '../components/IsolationZone/component.desktop';
import QuotaSpace from '../components/QuotaSpace/component.desktop';
import QuickSearch from '../components/QuickSearch/component.desktop';
import ResourceShare from '../components/ResourceShare/component.desktop';
import AccessList from '../components/AccessList/component.desktop';
import MyAccessList from '../components/MyAccessList/component.desktop';
import PopularList from '../components/PopularList/component.desktop';
import JournalList from '../components/JournalList/component.desktop';
import RecoveryError from '../components/RecoveryError/component.desktop';
import FullTextSearch from '../components/FullSearch/component.desktop';
import Activation from '../components/Activation/component.desktop';

module.exports = AnyShareFactory({
        OpenAPI,
        Components: {
                SSO,
                Image,
                Preview,
                OWAPreview,
                Play,
                LinkShare,
                Upload,
                UploadPicker: Upload.Picker,
                UploadPanel: Upload.Panel,
                UploadExceptions: Upload.Exceptions,
                UploadDragArea: Upload.DragArea,
                Download,
                DocTree,
                DocSelector,
                AttributesPicker,
                EnumPicker,
                ExtraMetaInfo,
                DocProperties,
                ShareInvitation,
                ShareJoin,
                Message,
                Share,
                AccessCode,
                Copy,
                Move,
                DocsGrid,
                LinkPassword,
                Delete,
                Auth,
                SaveTo,
                Login,
                ViewSize,
                CreateFolder,
                ThirdLogin,
                Index,
                ClientsDownload,
                MobileClient,
                LinkDownloads,
                Authorize,
                Quit,
                Reg,
                UserAgreement,
                GroupManage,
                IsolationZone,
                QuotaSpace,
                QuickSearch,
                ResourceShare,
                AccessList,
                MyAccessList,
                PopularList,
                JournalList,
                RecoveryError,
                FullTextSearch,
                Activation
        }
});