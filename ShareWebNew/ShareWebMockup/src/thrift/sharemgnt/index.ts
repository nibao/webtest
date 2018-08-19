import { ShareMgnt } from '../../routes';
import Licensem_GetDeviceInfo from './Licensem_GetDeviceInfo';
import GetRetainOutLinkStatus from './GetRetainOutLinkStatus'
import SendRetainOutLinkVCode from './SendRetainOutLinkVCode'
import VerifyRetainOutLinkVCode from './VerifyRetainOutLinkVCode'
import Usrm_GetTriSystemStatus from './Usrm_GetTriSystemStatus'

export default ShareMgnt
    .post('/Licensem_GetDeviceInfo', Licensem_GetDeviceInfo)
    .post('/GetRetainOutLinkStatus', GetRetainOutLinkStatus)
    .post('/SendRetainOutLinkVCode', SendRetainOutLinkVCode)
    .post('/VerifyRetainOutLinkVCode', VerifyRetainOutLinkVCode)
    .post('/Usrm_GetTriSystemStatus', Usrm_GetTriSystemStatus)
