import { EVFS } from '../../routes';
import GetIllegalFileList from './GetIllegalFileList';
import SearchIllegalFileListByPage from './SearchIllegalFileListByPage';
import GetIllegalFileCount from './GetIllegalFileCount';
import GetFileInfoCount from './GetFileInfoCount';
import GetPageFileInfo from './GetPageFileInfo';
import GetFileRevisions from './GetFileRevisions';
import OSDownload from './OSDownload';
import GetOutLinkAccessInfoCount from './GetOutLinkAccessInfoCount'
import GetPageOutLinkAccessInfo from './GetPageOutLinkAccessInfo'
import GetOutLinkFileInfo from './GetOutLinkFileInfo'

export default EVFS
    .post('/GetIllegalFileList', GetIllegalFileList)
    .post('/GetIllegalFileCount', GetIllegalFileCount)
    .post('/SearchIllegalFileListByPage', SearchIllegalFileListByPage)
    .post('/GetFileInfoCount', GetFileInfoCount)
    .post('/GetPageFileInfo', GetPageFileInfo)
    .post('/GetFileRevisions', GetFileRevisions)
    .post('/OSDownload', OSDownload)
    .post('/GetOutLinkAccessInfoCount', GetOutLinkAccessInfoCount)
    .post('/GetPageOutLinkAccessInfo', GetPageOutLinkAccessInfo)
    .post('/GetOutLinkFileInfo', GetOutLinkFileInfo)
